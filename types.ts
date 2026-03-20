export type PlanId =
  | 'free'
  | 'starter'
  | 'pro'
  | 'elite'
  | 'vip'
  | 'executive'
  | 'platinum';

export type TransactionType =
  | 'reading_reward'
  | 'comment_reward'
  | 'post_approval_reward'
  | 'referral_bonus'
  | 'subscription_fee'
  | 'withdrawal';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  description: string;
}

export type UserRole = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'banned' | 'suspended';

export interface ReferralEntry {
  id: string;
  userId: string;
  name: string;
  username: string;
  date: string;
  status: 'registered' | 'active' | 'inactive';
  rewardEarned: number;
  planId?: PlanId;
  planPrice?: number;
  expectedCommission?: number;
}

export interface UserStats {
  balance: number;
  usdtBalance: number;
  totalEarnings: number;
  postEarnings: number;
  referrals: number;
  referralEarnings: number;
  referralList: ReferralEntry[];
  postsReadToday: number;
  postsReadTarget: number;
  commentsMadeToday: number;
  commentsTarget: number;
  pendingRewards: number;
  lastUpdateDate: string;
  transactions: Transaction[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  bio?: string;
  planId: PlanId;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  referralCode: string;
  completedReadingPosts: string[];
  completedCommentPosts: string[];
  claimedAuthorPosts: string[];
  lastLimitModalDate?: string;
  planStartedAt?: string;
  planEarnings?: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export type PostStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type Category = string;

export interface PostAuthor {
  name: string;
  avatar: string;
  bio?: string;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface AiModerationResult {
  grammarScore: number;
  plagiarismRisk: 'low' | 'medium' | 'high';
  isSpam: boolean;
  summary: string;
  flags: string[];
}

export interface Post {
  id: string;
  authorId: string;
  author: PostAuthor;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  chapters: Chapter[];
  category: Category;
  featuredImage: string;
  publishDate: string;
  readingTime: string;
  comments: PostComment[];
  status: PostStatus;
  trending?: boolean;
  isHighValue?: boolean;
  aiModeration?: AiModerationResult | null;
  authorEarningsClaimed?: boolean;
  isStory?: boolean;
}

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  price: number;
  readLimit: number;
  commentLimit: number;
  readReward: number;
  commentReward: number;
  monthlyReturnCap: number;
  breakEvenDay: number;
  minReferrals: number;
  features: string[];
  isActive?: boolean;
}
