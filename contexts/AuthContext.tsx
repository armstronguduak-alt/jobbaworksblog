import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthUser,
  UserStats,
  Transaction,
  PlanId,
  ReferralEntry,
  Post,
  PostStatus,
  UserStatus,
  SubscriptionPlan,
  Chapter,
} from '../types';
import { PLANS as INITIAL_PLANS } from '../constants';
import { moderateContent } from '../services/geminiService';
import { supabase } from '../src/integrations/supabase/client';

interface AuthContextType {
  user: AuthUser | null;
  stats: UserStats;
  pageToggles: Record<string, boolean>;
  posts: Post[];
  systemPlans: Record<PlanId, SubscriptionPlan>;
  allUsers: AuthUser[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, gender: string, email: string, password: string, phone: string, refCode?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  addReward: (type: 'reading' | 'comment' | 'post_approval', key: string, customAmount?: number) => Promise<{ success: boolean; message: string }>;
  submitCommentWithReward: (postId: string, content: string) => Promise<{ success: boolean; message: string }>;
  upgradePlan: (planId: PlanId) => Promise<boolean>;
  setLimitModalShown: () => void;
  requestWithdrawal: (
    amount: number,
    method: string,
    currency?: 'naira' | 'usdt',
    details?: Record<string, string | undefined>
  ) => Promise<{ success: boolean; message: string }>;
  savePost: (postData: Partial<Post>) => Promise<void>;
  updatePostStatus: (postId: string, status: PostStatus, category?: string, readingTimeSeconds?: number) => Promise<void>;
  manageUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  updateSystemPlan: (planId: PlanId, updates: Partial<SubscriptionPlan>) => Promise<void>;
  categories: string[];
  addCategory: (category: string) => Promise<void>;
  editCategory: (oldCategory: string, newCategory: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  updatePageToggles: (toggles: Record<string, boolean>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  generateArticleFromTopic: (topic: string, category: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getTodayDate = () => new Date().toISOString().split('T')[0];
const formatHumanDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : getTodayDate();

const DEFAULT_PAGE_TOGGLES = {
  leaderboardEnabled: true,
  swapEnabled: true,
  referralsEnabled: true,
  earningsEnabled: true,
  walletEnabled: true,
};

const EMPTY_STATS: UserStats = {
  balance: 0,
  usdtBalance: 0,
  totalEarnings: 0,
  postEarnings: 0,
  referrals: 0,
  referralEarnings: 0,
  referralList: [],
  postsReadToday: 0,
  postsReadTarget: INITIAL_PLANS.free.readLimit,
  commentsMadeToday: 0,
  commentsTarget: INITIAL_PLANS.free.commentLimit,
  pendingRewards: 0,
  lastUpdateDate: getTodayDate(),
  transactions: [],
};

const splitIntoChapters = (content: string): Chapter[] => {
  const sections = content.split('<h2>');
  if (sections.length > 1) {
    return sections.map((s, i) => ({
      id: `ch-${i}`,
      title: i === 0 ? 'Introduction' : s.substring(0, 40).split('</h2>')[0],
      content: i === 0 ? s : '<h2>' + s,
      order: i + 1,
    }));
  }

  const words = content.split(' ');
  const chunkSize = 350;
  const chapters: Chapter[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chapters.push({
      id: `ch-${i / chunkSize}`,
      title: `Segment ${(i / chunkSize) + 1}`,
      content: words.slice(i, i + chunkSize).join(' '),
      order: (i / chunkSize) + 1,
    });
  }
  return chapters.length ? chapters : [{ id: 'ch-0', title: 'Introduction', content: content || '', order: 1 }];
};

const planIdList: PlanId[] = ['free', 'starter', 'pro', 'elite', 'vip', 'executive', 'platinum'];

const toPlanRecord = (rows: any[] | null | undefined): Record<PlanId, SubscriptionPlan> => {
  const merged: Record<PlanId, SubscriptionPlan> = { ...INITIAL_PLANS } as Record<PlanId, SubscriptionPlan>;
  (rows || []).forEach((p) => {
    const id = p.id as PlanId;
    if (!planIdList.includes(id)) return;
    merged[id] = {
      ...merged[id],
      id,
      name: p.name,
      price: Number(p.price ?? 0),
      readLimit: Number(p.daily_read_limit ?? merged[id].readLimit),
      commentLimit: Number(p.daily_comment_limit ?? merged[id].commentLimit),
      readReward: Number(p.read_reward ?? merged[id].readReward),
      commentReward: Number(p.comment_reward ?? merged[id].commentReward),
      monthlyReturnCap: Number(p.monthly_return_cap ?? merged[id].monthlyReturnCap),
      breakEvenDay: Number(p.break_even_day ?? merged[id].breakEvenDay),
      minReferrals: Number(p.min_referrals ?? merged[id].minReferrals),
      isActive: Boolean(p.is_active),
    };
  });
  return merged;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<UserStats>(EMPTY_STATS);
  const [pageToggles, setPageToggles] = useState<Record<string, boolean>>(DEFAULT_PAGE_TOGGLES);
  const [posts, setPosts] = useState<Post[]>([]);
  const [systemPlans, setSystemPlans] = useState<Record<PlanId, SubscriptionPlan>>(INITIAL_PLANS as Record<PlanId, SubscriptionPlan>);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const db = useMemo(() => supabase as any, []);

  const hydratePosts = async (viewerId?: string, viewerRole: 'admin' | 'moderator' | 'user' = 'user') => {
    const { data: postRows, error: postsError } = await db
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    const filteredRows = (postRows || []).filter((p: any) => {
      if (viewerRole === 'admin' || viewerRole === 'moderator') return true;
      if (viewerId && p.author_user_id === viewerId) return true;
      return p.status === 'approved';
    });

    const authorIds = [...new Set(filteredRows.map((p: any) => p.author_user_id).filter(Boolean))];
    const categoryIds = [...new Set(filteredRows.map((p: any) => p.category_id).filter(Boolean))];
    const postIds = filteredRows.map((p: any) => p.id);

    const [authorsRes, categoriesRes, commentsRes] = await Promise.all([
      authorIds.length ? db.from('profiles').select('user_id,name,avatar_url,bio').in('user_id', authorIds) : Promise.resolve({ data: [] }),
      categoryIds.length ? db.from('categories').select('id,name').in('id', categoryIds) : Promise.resolve({ data: [] }),
      postIds.length ? db.from('post_comments').select('*').in('post_id', postIds).order('created_at', { ascending: true }) : Promise.resolve({ data: [] }),
    ]);

    const commentUserIds = [...new Set((commentsRes.data || []).map((c: any) => c.user_id).filter(Boolean))];
    const commentersRes = commentUserIds.length
      ? await db.from('profiles').select('user_id,name').in('user_id', commentUserIds)
      : { data: [] };

    const authorMap = new Map((authorsRes.data || []).map((a: any) => [a.user_id, a]));
    const categoryMap = new Map((categoriesRes.data || []).map((c: any) => [c.id, c.name]));
    const commenterMap = new Map((commentersRes.data || []).map((u: any) => [u.user_id, u.name]));

    const commentsByPost = new Map<string, any[]>();
    (commentsRes.data || []).forEach((c: any) => {
      const current = commentsByPost.get(c.post_id) || [];
      current.push(c);
      commentsByPost.set(c.post_id, current);
    });

    const mappedPosts: Post[] = filteredRows.map((p: any) => {
      const author: any = authorMap.get(p.author_user_id);
      const rowComments = commentsByPost.get(p.id) || [];
      return {
        id: p.id,
        authorId: p.author_user_id,
        author: {
          name: (author as any)?.name || 'Unknown Author',
          avatar: (author as any)?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=author',
          bio: (author as any)?.bio || '',
        },
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || '',
        content: p.content || '',
        chapters: splitIntoChapters(p.content || ''),
        category: categoryMap.get(p.category_id) || 'Uncategorized',
        featuredImage: p.featured_image || 'https://picsum.photos/1200/600',
        publishDate: formatHumanDate(p.published_at || p.created_at),
        readingTime: `${Math.max(1, Math.round((Number(p.reading_time_seconds || 25) || 25) / 60))} min read`,
        readingTimeSeconds: Number(p.reading_time_seconds || 25),
        comments: rowComments.map((c: any) => ({
          id: c.id,
          authorId: c.user_id,
          authorName: commenterMap.get(c.user_id) || 'User',
          content: c.content,
          createdAt: c.created_at,
        })),
        status: (p.status || 'draft') as PostStatus,
        trending: false,
        isHighValue: false,
        isStory: p.is_story || false,
        authorEarningsClaimed: p.author_earnings_claimed || false,
        aiModeration: p.moderation_summary
          ? {
              grammarScore: 90,
              plagiarismRisk: 'low',
              isSpam: false,
              summary: p.moderation_summary,
              flags: Array.isArray(p.moderation_flags) ? p.moderation_flags : [],
            }
          : null,
      };
    });

    setPosts(mappedPosts);
  };

  const loadSystemData = async () => {
    const [plansRes, categoriesRes, settingsRes] = await Promise.all([
      db.from('subscription_plans').select('*').order('price', { ascending: true }),
      db.from('categories').select('name').eq('is_active', true).order('name'),
      db.from('system_settings').select('value').eq('key', 'page_toggles').maybeSingle(),
    ]);

    if (!plansRes.error) setSystemPlans(toPlanRecord(plansRes.data));
    if (!categoriesRes.error) setCategories((categoriesRes.data || []).map((c: any) => c.name));

    const toggles = settingsRes.data?.value;
    if (toggles && typeof toggles === 'object') {
      setPageToggles({ ...DEFAULT_PAGE_TOGGLES, ...toggles });
    }
  };

  const hydrateUserAndStats = async (userId: string) => {
    const [
      profileRes,
      roleRes,
      subscriptionRes,
      walletRes,
      todayCounterRes,
      transactionsRes,
      postReadsRes,
      commentEarningsRes,
      referralRowsRes,
      referralCommissionsRes,
    ] = await Promise.all([
      db.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      db.from('user_roles').select('role').eq('user_id', userId),
      db.from('user_subscriptions').select('*').eq('user_id', userId).maybeSingle(),
      db.from('wallet_balances').select('*').eq('user_id', userId).maybeSingle(),
      db.from('daily_user_counters').select('*').eq('user_id', userId).eq('counter_date', getTodayDate()).maybeSingle(),
      db.from('wallet_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      db.from('post_reads').select('post_id').eq('user_id', userId),
      db.from('comment_earnings').select('post_id').eq('user_id', userId),
      db.from('referrals').select('*').eq('referrer_user_id', userId).order('created_at', { ascending: false }),
      db.from('referral_commissions').select('*').eq('referrer_user_id', userId),
    ]);

    if (profileRes.error || !profileRes.data) {
      throw new Error('Profile not found.');
    }

    const roleRows = roleRes.data || [];
    const role = roleRows.some((r: any) => r.role === 'admin')
      ? 'admin'
      : roleRows.some((r: any) => r.role === 'moderator')
      ? 'moderator'
      : 'user';

    const planId = ((subscriptionRes.data?.plan_id as PlanId) || 'free') as PlanId;
    const currentPlan = systemPlans[planId] || INITIAL_PLANS[planId];

    const referralRows = referralRowsRes.data || [];
    const referredIds = referralRows.map((r: any) => r.referred_user_id);

    const [referredProfilesRes, referredSubsRes] = await Promise.all([
      referredIds.length ? db.from('profiles').select('user_id,name,username').in('user_id', referredIds) : Promise.resolve({ data: [] }),
      referredIds.length ? db.from('user_subscriptions').select('user_id,plan_id').in('user_id', referredIds) : Promise.resolve({ data: [] }),
    ]);

    const referredNameMap = new Map((referredProfilesRes.data || []).map((p: any) => [p.user_id, p.name]));
    const referredUsernameMap = new Map((referredProfilesRes.data || []).map((p: any) => [p.user_id, p.username || '']));
    const referredPlanMap = new Map((referredSubsRes.data || []).map((s: any) => [s.user_id, s.plan_id as PlanId]));

    const commissionByUser = new Map<string, number>();
    (referralCommissionsRes.data || []).forEach((c: any) => {
      commissionByUser.set(c.referred_user_id, (commissionByUser.get(c.referred_user_id) || 0) + Number(c.commission_amount || 0));
    });

    const referralList: ReferralEntry[] = referralRows.map((r: any) => {
      const planId = (referredPlanMap.get(r.referred_user_id) || 'free') as PlanId;
      const planPrice = Number(systemPlans[planId]?.price || INITIAL_PLANS[planId]?.price || 0);
      return {
        id: r.id,
        userId: r.referred_user_id,
        name: referredNameMap.get(r.referred_user_id) || 'Referred User',
        username: referredUsernameMap.get(r.referred_user_id) || '',
        date: new Date(r.created_at).toISOString().split('T')[0],
        status: planId !== 'free' ? 'active' : 'registered',
        rewardEarned: commissionByUser.get(r.referred_user_id) || 0,
        planId,
        planPrice,
        expectedCommission: planPrice * 0.25,
      };
    });

    const transactions: Transaction[] = (transactionsRes.data || []).map((tx: any) => ({
      id: tx.id,
      amount: Number(tx.amount || 0),
      type: tx.type,
      status: tx.status,
      date: new Date(tx.created_at).toISOString().split('T')[0],
      description: tx.description || '',
    }));

    setUser({
      id: profileRes.data.user_id,
      name: profileRes.data.name,
      email: profileRes.data.email || '',
      phone: profileRes.data.phone || undefined,
      avatar: profileRes.data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileRes.data.name)}`,
      bio: profileRes.data.bio || undefined,
      planId,
      role,
      status: profileRes.data.status || 'active',
      joinedDate: new Date(profileRes.data.joined_at || profileRes.data.created_at).toISOString().split('T')[0],
      referralCode: profileRes.data.referral_code,
      completedReadingPosts: (postReadsRes.data || []).map((r: any) => r.post_id),
      completedCommentPosts: (commentEarningsRes.data || []).map((r: any) => r.post_id),
      claimedAuthorPosts: [],
      lastLimitModalDate: undefined,
      planStartedAt: subscriptionRes.data?.started_at ? new Date(subscriptionRes.data.started_at).toISOString().split('T')[0] : getTodayDate(),
      planEarnings: Number(subscriptionRes.data?.plan_earnings || walletRes.data?.total_earnings || 0),
    });

    const referralEarnings = Number(walletRes.data?.referral_earnings || 0);

    setStats({
      balance: Number(walletRes.data?.balance || 0),
      usdtBalance: Number(walletRes.data?.usdt_balance || 0),
      totalEarnings: Number(walletRes.data?.total_earnings || 0),
      postEarnings: Number(walletRes.data?.post_earnings || 0),
      referrals: referralRows.length,
      referralEarnings,
      referralList,
      postsReadToday: Number(todayCounterRes.data?.read_count || 0),
      postsReadTarget: currentPlan.readLimit,
      commentsMadeToday: Number(todayCounterRes.data?.comment_count || 0),
      commentsTarget: currentPlan.commentLimit,
      pendingRewards: Number(walletRes.data?.pending_rewards || 0),
      lastUpdateDate: getTodayDate(),
      transactions,
    });

    const isAdmin = role === 'admin';
    if (isAdmin) {
      const [profilesRes, subscriptionsRes, rolesRes] = await Promise.all([
        db.from('profiles').select('*').order('created_at', { ascending: false }),
        db.from('user_subscriptions').select('user_id,plan_id'),
        db.from('user_roles').select('user_id,role'),
      ]);

      const subMap = new Map((subscriptionsRes.data || []).map((s: any) => [s.user_id, s.plan_id as PlanId]));
      const rolesMap = new Map<string, 'user' | 'moderator' | 'admin'>();
      (rolesRes.data || []).forEach((r: any) => {
        if (r.role === 'admin') rolesMap.set(r.user_id, 'admin');
        else if (r.role === 'moderator' && rolesMap.get(r.user_id) !== 'admin') rolesMap.set(r.user_id, 'moderator');
        else if (!rolesMap.has(r.user_id)) rolesMap.set(r.user_id, 'user');
      });

      setAllUsers(
        (profilesRes.data || []).map((p: any) => ({
          id: p.user_id,
          name: p.name,
          email: p.email || '',
          phone: p.phone || undefined,
          avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.name)}`,
          bio: p.bio || undefined,
          planId: (subMap.get(p.user_id) || 'free') as PlanId,
          role: rolesMap.get(p.user_id) || 'user',
          status: (p.status || 'active') as UserStatus,
          joinedDate: new Date(p.joined_at || p.created_at).toISOString().split('T')[0],
          referralCode: p.referral_code,
          completedReadingPosts: [],
          completedCommentPosts: [],
          claimedAuthorPosts: [],
        }))
      );
    } else {
      setAllUsers([]);
    }

    await hydratePosts(userId, role);
  };

  const buildFallbackUserFromSession = (sessionUser: any): AuthUser => {
    const metadata = sessionUser?.user_metadata || {};
    const fallbackName = (sessionUser?.email || 'New User').split('@')[0] || 'New User';
    const safeName = (metadata.name || fallbackName).toString();

    return {
      id: sessionUser?.id,
      name: safeName,
      email: (sessionUser?.email || '').toString(),
      phone: metadata.phone || undefined,
      avatar:
        metadata.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(safeName)}`,
      bio: undefined,
      planId: 'free',
      role: 'user',
      status: 'active',
      joinedDate: getTodayDate(),
      referralCode: '',
      completedReadingPosts: [],
      completedCommentPosts: [],
      claimedAuthorPosts: [],
    };
  };

  const ensureMyAccount = async (sessionUser: any) => {
    const metadata = sessionUser?.user_metadata || {};
    const fallbackName = (sessionUser?.email || 'New User').split('@')[0] || 'New User';
    const safeName = (metadata.name || fallbackName).toString();
    const safeEmail = (sessionUser?.email || '').toString();
    const safePhone = (metadata.phone || '').toString();
    const safeUsername = (metadata.username || '').toString();
    const safeGender = (metadata.gender || '').toString();
    const safeAvatar = (metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(safeName)}`).toString();
    const referredByCode = (metadata.referred_by_code || '').toString();

    const { error } = await db.rpc('initialize_my_account', {
      _name: safeName,
      _email: safeEmail,
      _phone: safePhone,
      _username: safeUsername || null,
      _gender: safeGender || null,
      _avatar_url: safeAvatar,
      _referred_by_code: referredByCode || null,
    });

    if (error) {
      throw new Error(error.message || 'Failed to initialize account records');
    }
  };

  const refreshAppData = async (userId?: string) => {
    await loadSystemData();
    if (userId) {
      await hydrateUserAndStats(userId);
    } else {
      await hydratePosts();
      setStats(EMPTY_STATS);
      setAllUsers([]);
    }
  };

  const hydrateSessionState = async (session: any) => {
    if (session?.user) {
      try {
        await ensureMyAccount(session.user);
      } catch (error) {
        console.warn('Account bootstrap warning:', error);
      }

      try {
        await refreshAppData(session.user.id);
      } catch (error) {
        console.error('Failed to hydrate full account state:', error);
        setUser((prev) => (prev?.id === session.user.id ? prev : buildFallbackUserFromSession(session.user)));
        setStats(EMPTY_STATS);
        setAllUsers([]);
        await hydratePosts(session.user.id, 'user').catch(() => undefined);
      }
      return;
    }

    setUser(null);
    await refreshAppData();
  };

  useEffect(() => {
    let mounted = true;
    let activeHydration = 0;

    const hydrateSafely = async (session: any) => {
      const runId = ++activeHydration;
      setIsLoading(true);

      try {
        await Promise.race([
          hydrateSessionState(session),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Session hydration timeout')), 10000)),
        ]);
      } catch (error) {
        console.error('Auth hydration warning:', error);
        if (session?.user) {
          setUser((prev) => (prev?.id === session.user.id ? prev : buildFallbackUserFromSession(session.user)));
          await hydratePosts(session.user.id, 'user').catch(() => undefined);
        } else {
          setUser(null);
        }
      } finally {
        if (mounted && runId === activeHydration) {
          setIsLoading(false);
        }
      }
    };

    const { data: listener } = db.auth.onAuthStateChange((event: string, session: any) => {
      if (!mounted) return;
      
      // Prevent full app reloads on token background refreshes
      if (['INITIAL_SESSION', 'SIGNED_IN', 'SIGNED_OUT'].includes(event)) {
         void hydrateSafely(session);
      } else if (event === 'USER_UPDATED' && session?.user) {
         void refreshAppData(session.user.id);
      }
    });

    const bootstrap = async () => {
      try {
        const {
          data: { session },
        } = await db.auth.getSession();

        if (!mounted) return;
        await hydrateSafely(session);
      } catch (error) {
        console.error('Failed to initialize app state:', error);
        if (mounted) setIsLoading(false);
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    if (!user?.id) return;

    const realtimeChannel = db.channel(`live-sync-${user.id}`);
    const watchedTables = [
      { table: 'wallet_balances', filter: `user_id=eq.${user.id}` },
      { table: 'wallet_transactions', filter: `user_id=eq.${user.id}` },
      { table: 'daily_user_counters', filter: `user_id=eq.${user.id}` },
      { table: 'post_reads', filter: `user_id=eq.${user.id}` },
      { table: 'comment_earnings', filter: `user_id=eq.${user.id}` },
      { table: 'user_subscriptions', filter: `user_id=eq.${user.id}` },
      { table: 'profiles', filter: `user_id=eq.${user.id}` },
      { table: 'posts' },
      { table: 'post_comments' },
      { table: 'referrals', filter: `referrer_user_id=eq.${user.id}` },
      { table: 'referrals', filter: `referred_user_id=eq.${user.id}` },
      { table: 'referral_commissions', filter: `referrer_user_id=eq.${user.id}` },
      { table: 'subscription_plans' },
      { table: 'categories' },
      { table: 'system_settings' },
    ];

    if (user.role === 'admin') {
      watchedTables.push(
        { table: 'profiles' },
        { table: 'user_roles' },
        { table: 'user_subscriptions' },
        { table: 'referral_commissions' },
        { table: 'wallet_transactions' },
        { table: 'wallet_balances' }
      );
    }

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(async () => {
        try {
          await loadSystemData();
          await hydrateUserAndStats(user.id);
        } catch (error) {
          console.warn('Realtime refresh warning:', error);
        }
      }, 250);
    };

    watchedTables.forEach((target) => {
      realtimeChannel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: target.table,
        ...(target.filter ? { filter: target.filter } : {}),
      }, scheduleRefresh);
    });

    realtimeChannel.subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      db.removeChannel(realtimeChannel);
    };
  }, [db, user?.id, user?.role]);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await db.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) throw new Error(error.message || 'Invalid credentials');

    if (data?.user) {
      setUser((prev) => (prev?.id === data.user.id ? prev : buildFallbackUserFromSession(data.user)));
      ensureMyAccount(data.user).catch((err: any) => {
        console.warn('Login account bootstrap warning:', err?.message || err);
      });
    }

    if (data?.session) {
      refreshAppData(data.session.user.id).catch((err: any) => {
        console.warn('Background refresh warning:', err?.message || err);
      });
    }
  };

  const register = async (name: string, username: string, gender: string, email: string, password: string, phone: string, refCode?: string) => {
    if (phone) {
      const { count } = await db.from('profiles').select('*', { count: 'exact', head: true }).eq('phone', phone);
      if (count && count > 0) {
        throw new Error('This phone number has already been used by another account. One phone number per user is allowed.');
      }
    }

    const normalizedCode = refCode?.trim().toUpperCase() || null;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username || name)}`;

    const { data, error } = await db.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name,
          username: username.toLowerCase().trim(),
          gender,
          phone,
          avatar_url: avatar,
          referred_by_code: normalizedCode,
        },
      },
    });

    if (error) throw new Error(error.message || 'Registration failed');
    if (!data.user) throw new Error('Registration created, but no user returned yet. Please verify email and try login.');

    if (data.session?.user) {
      await ensureMyAccount(data.session.user);
    }
  };

  const logout = async () => {
    await db.auth.signOut();
    setUser(null);
    setStats(EMPTY_STATS);
    setAllUsers([]);
  };

  const addReward = async (
    type: 'reading' | 'comment' | 'post_approval',
    key: string,
    customAmount?: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'User not authenticated' };

    if (type === 'reading') {
      const { data: previousRead } = await db.from('post_reads').select('id').eq('post_id', key).eq('user_id', user.id).maybeSingle();
      if (previousRead) {
          return { success: false, message: 'You have already claimed the reading reward for this post.' };
      }
      const { data, error } = await db.rpc('claim_post_read', { _post_id: key });
      if (error) return { success: false, message: error.message || 'Could not claim reading reward.' };
      await hydrateUserAndStats(user.id);
      const success = Boolean(data?.success);
      return { success, message: data?.message || (success ? 'Reward claimed.' : 'Unable to claim reward.') };
    }

    if (type === 'comment') {
      return { success: false, message: 'Use submit comment action to earn comment rewards.' };
    }

    if (type === 'post_approval' && customAmount) {
      const { error } = await db.rpc('credit_wallet', {
        _user_id: user.id,
        _amount: customAmount,
        _type: 'post_approval_reward',
        _description: 'Post Approval Reward',
        _meta: { post_id: key },
      });

      if (error) return { success: false, message: error.message || 'Failed to issue approval reward.' };
      
      const { error: postError } = await db.from('posts').update({ author_earnings_claimed: true }).eq('id', key);
      if (postError) console.error('Failed marking post as claimed', postError);

      await hydrateUserAndStats(user.id);
      await hydratePosts();
      return { success: true, message: `₦${customAmount} earned for post approval` };
    }

    return { success: false, message: 'Unsupported reward type.' };
  };

  const submitCommentWithReward = async (postId: string, content: string) => {
    if (!user) return { success: false, message: 'User not authenticated' };

    const { data: previousCommentReward } = await db.from('comment_earnings').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
    
    if (previousCommentReward) {
        // User already earned the comment reward for this post, let them comment without reward erroring out
        const { error } = await db.from('post_comments').insert({ post_id: postId, user_id: user.id, content });
        if (error) return { success: false, message: 'Failed to submit comment.' };
        await hydratePosts(user.id, user.role);
        return { success: true, message: 'Comment submitted successfully.' };
    }

    const { data, error } = await db.rpc('submit_comment_with_reward', {
      _post_id: postId,
      _content: content,
    });

    if (error) return { success: false, message: error.message || 'Failed to submit comment.' };

    await hydrateUserAndStats(user.id);
    await hydratePosts(user.id, user.role);

    return { success: Boolean(data?.success), message: data?.message || 'Comment submitted.' };
  };

  const savePost = async (postData: Partial<Post>) => {
    if (!user) return;

    const categoryRecord = await db.from('categories').select('id').eq('name', postData.category || 'Technology').maybeSingle();

    let moderationSummary: string | null = null;
    let moderationFlags: string[] = [];
    if (postData.status === 'pending') {
      const mod = await moderateContent(postData.title || '', postData.content || '');
      moderationSummary = mod.summary;
      moderationFlags = mod.flags;
    }

    let finalSlug = postData.slug || (postData.title || 'untitled').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
    // Prevent duplicate unique key violations on Postgres schema and preserve SEO on updates
    if (postData.id) {
      const existing = posts.find(p => p.id === postData.id);
      if (existing) {
        finalSlug = existing.slug;
      }
    } else {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 9)}`;
    }

    const payload = {
      id: postData.id || undefined,
      author_user_id: user.id,
      category_id: categoryRecord.data?.id || null,
      title: postData.title || 'Untitled',
      slug: finalSlug,
      excerpt: postData.excerpt || (postData.content || '').replace(/<[^>]*>/g, '').slice(0, 180),
      content: postData.content || '',
      featured_image: postData.featuredImage || 'https://picsum.photos/1200/600',
      status: postData.status || 'draft',
      is_story: postData.isStory || false,
      moderation_summary: moderationSummary,
      moderation_flags: moderationFlags,
      published_at: postData.status === 'approved' ? new Date().toISOString() : null,
    };

    const { error } = await db.from('posts').upsert(payload);
    if (error) throw error;

    await hydratePosts(user.id, user.role);
  };

  const updatePostStatus = async (postId: string, status: PostStatus, category?: string, readingTimeSeconds?: number) => {
    if (!user) return;

    let categoryId: string | null = null;
    if (category) {
      const categoryRes = await db.from('categories').select('id').eq('name', category).maybeSingle();
      categoryId = categoryRes.data?.id || null;
    }

    const updates: any = {
      status,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
      approved_by_user_id: status === 'approved' ? user.id : null,
      published_at: status === 'approved' ? new Date().toISOString() : null,
    };

    if (readingTimeSeconds) {
       updates.reading_time_seconds = readingTimeSeconds;
    }

    if (categoryId) updates.category_id = categoryId;

    const { error } = await db.from('posts').update(updates).eq('id', postId);
    if (error) throw error;

    if (status === 'approved') {
       try {
         const postItem = posts.find(p => p.id === postId);
         if (postItem && postItem.authorId) {
             const { data: previousRewards } = await db.from('wallet_transactions')
                .select('id')
                .eq('type', 'post_approval_reward')
                .eq('user_id', postItem.authorId)
                .contains('meta', { post_id: postId })
                .maybeSingle();

             if (!previousRewards) {
                 const rewardAmount = postItem.isStory ? 1000 : 500;
                 await db.rpc('credit_wallet', { 
                    _user_id: postItem.authorId, 
                    _amount: rewardAmount, 
                    _type: 'post_approval_reward', 
                    _description: 'Post Approval Reward', 
                    _meta: { post_id: postId } 
                 });
                 // I will also send notification here!
                 await db.from('notifications' as any).insert({ user_id: postItem.authorId, type: 'approval', message: `Your ${postItem.isStory ? 'Story' : 'Article'} "${postItem.title}" has been approved! You earned a ₦${rewardAmount} bonus.` });
             }
         }
       } catch (err) {
         console.error('Failed to issue approval reward/notification:', err);
       }
    }

    await hydratePosts(user.id, user.role);
  };

  const manageUserStatus = async (userId: string, status: UserStatus) => {
    const { error } = await db.from('profiles').update({ status }).eq('user_id', userId);
    if (error) throw error;
    if (user?.role === 'admin') await hydrateUserAndStats(user.id);
  };

  const updateSystemPlan = async (planId: PlanId, updates: Partial<SubscriptionPlan>) => {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.readLimit !== undefined) payload.daily_read_limit = updates.readLimit;
    if (updates.commentLimit !== undefined) payload.daily_comment_limit = updates.commentLimit;
    if (updates.readReward !== undefined) payload.read_reward = updates.readReward;
    if (updates.commentReward !== undefined) payload.comment_reward = updates.commentReward;
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;

    const { error } = await db.from('subscription_plans').update(payload).eq('id', planId);
    if (error) throw error;

    await loadSystemData();
  };

  const addCategory = async (category: string) => {
    const slug = category.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const { error } = await db.from('categories').insert({ name: category, slug, is_active: true });
    if (error) throw error;
    await loadSystemData();
  };

  const editCategory = async (oldCategory: string, newCategory: string) => {
    const slug = newCategory.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const { error } = await db.from('categories').update({ name: newCategory, slug }).eq('name', oldCategory);
    if (error) throw error;
    await loadSystemData();
    if (user) await hydratePosts(user.id, user.role);
  };

  const deleteCategory = async (category: string) => {
    const { error } = await db.from('categories').delete().eq('name', category);
    if (error) throw error;
    await loadSystemData();
  };

  const upgradePlan = async (planId: PlanId) => {
    if (!user) return false;

    const plan = systemPlans[planId];
    
    const { error: rpcError } = await db.rpc('process_plan_upgrade', { 
      _user_id: user.id, 
      _new_plan_id: planId 
    });

    if (rpcError) {
      const { error: upsertError } = await db
        .from('user_subscriptions')
        .upsert({ user_id: user.id, plan_id: planId, plan_earnings: 0 }, { onConflict: 'user_id' });

      if (upsertError) return false;
      
      const { data: wallet } = await db.from('wallet_balances').select('balance').eq('user_id', user.id).maybeSingle();
      if (wallet) {
          await db.from('wallet_balances').update({
             balance: Number(wallet.balance) + Number(plan.price)
          }).eq('user_id', user.id);
      }
      
      const { data: refRecord } = await db.from('referrals').select('referrer_user_id').eq('referred_user_id', user.id).maybeSingle();
      if (refRecord?.referrer_user_id) {
          const commission = Number(plan.price) * 0.25;
          await db.from('referral_commissions').insert({
             referrer_user_id: refRecord.referrer_user_id,
             referred_user_id: user.id,
             commission_amount: commission
          });
          const { data: refWallet } = await db.from('wallet_balances').select('*').eq('user_id', refRecord.referrer_user_id).maybeSingle();
          if (refWallet) {
             await db.from('wallet_balances').update({
                balance: Number(refWallet.balance) + commission,
                total_earnings: Number(refWallet.total_earnings) + commission,
                referral_earnings: Number(refWallet.referral_earnings) + commission
             }).eq('user_id', refRecord.referrer_user_id);
          }
      }
    }

    await db.from('wallet_transactions').insert({
      user_id: user.id,
      amount: Number(plan.price),
      type: 'subscription_fee',
      status: 'completed',
      description: `Tier Upgrade: ${plan.name}`,
      meta: { plan_id: planId },
    });

    await hydrateUserAndStats(user.id);
    return true;
  };

  const requestWithdrawal = async (
    amount: number,
    method: string,
    currency: 'naira' | 'usdt' = 'naira',
    details: Record<string, string | undefined> = {}
  ) => {
    if (!user) return { success: false, message: 'Not authenticated' };

    const plan = systemPlans[user.planId];
    if (stats.referrals < plan.minReferrals) {
      return { success: false, message: `Complete minimum referrals (${plan.minReferrals}) to unlock withdrawal.` };
    }

    if (stats.totalEarnings <= 0) {
      return { success: false, message: 'You must have earned funds before withdrawing.' };
    }

    if (stats.postsReadToday === 0 && stats.commentsMadeToday === 0) {
      return { success: false, message: 'You must complete at least one daily task before withdrawing.' };
    }

    const isUsdt = currency === 'usdt';
    const available = isUsdt ? stats.usdtBalance : stats.balance;

    if (amount > available) {
      return { success: false, message: 'Insufficient available balance.' };
    }

    const patch = isUsdt ? { usdt_balance: available - amount } : { balance: available - amount };

    const [balanceUpdate, txInsert, withdrawalInsert] = await Promise.all([
      db.from('wallet_balances').update(patch).eq('user_id', user.id),
      db.from('wallet_transactions').insert({
        user_id: user.id,
        amount,
        type: 'withdrawal',
        status: 'pending',
        description: `Withdrawal request via ${method} (Processing in 24-72 hours)`,
        meta: { method, currency, ...details },
      }),
      db.from('withdrawal_requests').insert({
        user_id: user.id,
        amount,
        currency,
        method,
        details,
      }),
    ]);

    if (balanceUpdate.error || txInsert.error || withdrawalInsert.error) {
      return {
        success: false,
        message:
          balanceUpdate.error?.message || txInsert.error?.message || withdrawalInsert.error?.message || 'Withdrawal failed.',
      };
    }

    await hydrateUserAndStats(user.id);
    return { success: true, message: 'Withdrawal processing initiated.' };
  };

  const deletePost = async (postId: string) => {
    if (!user) return;
    const { error } = await db.from('posts').delete().eq('id', postId);
    if (error) throw error;
    await hydratePosts(user.id, user.role);
  };

  const generateArticleFromTopic = async (topic: string, category: string) => {
    if (!user) return { success: false, message: 'Not authenticated' };

    try {
      const apiKey = 'AIzaSyAR5H9rVETPkngVtdwtlAnf25dvmrH_0z8';
      const prompt = `Write a comprehensive, SEO-optimized blog article about "${topic}" in HTML format (using only standard tags like <h2>, <p>, <ul>, <li>, <strong>, <em>, blockquote). The article should be between 800 and 1200 words. Do not include an <h1> tag. Output ONLY raw HTML body without markdown formatting blocks. Make it engaging, informative, and professional.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error('API Error: Could not generate article text.');
      }

      const data = await response.json();
      let contentHtml = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      contentHtml = contentHtml.replace(/```html/g, '').replace(/```/g, '').trim();

      // Placeholder for Nano Banana Pro / Gemini Image - falling back to pollinations as safe standard for images
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + " " + category)}?width=1200&height=600&nologo=true`;

      const postData: Partial<Post> = {
        title: topic,
        content: contentHtml,
        excerpt: contentHtml.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
        category: category,
        status: 'pending',
        featuredImage: imgUrl,
      };

      await savePost(postData);

      return { success: true, message: 'Draft article generated and sent to moderation queue.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Unable to generate article.' };
    }
  };

  const setLimitModalShown = () => {
    setUser((prev) => (prev ? { ...prev, lastLimitModalDate: getTodayDate() } : null));
  };

  const updatePageToggles = async (toggles: Record<string, boolean>) => {
    const { error } = await db
      .from('system_settings')
      .upsert(
        { key: 'page_toggles', value: toggles, is_public: true, updated_by_user_id: user?.id || null },
        { onConflict: 'key' }
      );

    if (error) throw error;
    setPageToggles(toggles);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        pageToggles,
        posts,
        systemPlans,
        allUsers,
        login,
        register,
        logout,
        isLoading,
        addReward,
        submitCommentWithReward,
        upgradePlan,
        setLimitModalShown,
        requestWithdrawal,
        savePost,
        updatePostStatus,
        manageUserStatus,
        updateSystemPlan,
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        updatePageToggles,
        deletePost,
        generateArticleFromTopic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
