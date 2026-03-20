
import { Post, Category, UserStats, SubscriptionPlan } from './types';

export const HIGH_RPM_CATEGORIES = [
  'Finance',
  'Technology',
  'Business',
  'Education',
  'Product Reviews'
];

export const PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    readLimit: 5,
    commentLimit: 4,
    readReward: 10,
    commentReward: 10,
    monthlyReturnCap: 2700,
    breakEvenDay: 30,
    minReferrals: 10,
    features: ['5 Paid Reads/Day', '4 Paid Comments/Day', 'Basic Rewards', 'Community Support']
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 2000,
    readLimit: 6,
    commentLimit: 6,
    readReward: 6,
    commentReward: 4,
    monthlyReturnCap: 1500,
    breakEvenDay: 18,
    minReferrals: 10,
    features: ['6 Paid Reads/Day', '6 Paid Comments/Day', 'Faster Rewards', 'Balanced Experience']
  },
  pro: {
    id: 'pro',
    name: 'Pro Active',
    price: 5000,
    readLimit: 8,
    commentLimit: 8,
    readReward: 12,
    commentReward: 7,
    monthlyReturnCap: 4428,
    breakEvenDay: 17,
    minReferrals: 8,
    features: ['8 Paid Reads/Day', '8 Paid Comments/Day', 'Higher Earning Potential', 'Verified Badge']
  },
  elite: {
    id: 'elite',
    name: 'Elite Growth',
    price: 10000,
    readLimit: 10,
    commentLimit: 10,
    readReward: 22,
    commentReward: 12,
    monthlyReturnCap: 9680,
    breakEvenDay: 16,
    minReferrals: 8,
    features: ['10 Paid Reads/Day', '10 Paid Comments/Day', 'Priority Support', 'Exclusive Insights']
  },
  vip: {
    id: 'vip',
    name: 'VIP Power',
    price: 20000,
    readLimit: 12,
    commentLimit: 12,
    readReward: 40,
    commentReward: 23,
    monthlyReturnCap: 25376,
    breakEvenDay: 15,
    minReferrals: 8,
    features: ['12 Paid Reads/Day', '12 Paid Comments/Day', 'High-Value Priority', 'Instant Withdrawals']
  },
  executive: {
    id: 'executive',
    name: 'Executive Master',
    price: 50000,
    readLimit: 15,
    commentLimit: 20,
    readReward: 70,
    commentReward: 50,
    monthlyReturnCap: 57150,
    breakEvenDay: 14,
    minReferrals: 6,
    features: ['15 Paid Reads/Day', '20 Paid Comments/Day', 'Max Capacity', 'Executive Networking']
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Master',
    price: 100000,
    readLimit: 18,
    commentLimit: 25,
    readReward: 120,
    commentReward: 100,
    monthlyReturnCap: 140000,
    breakEvenDay: 14,
    minReferrals: 6,
    features: ['18 Paid Reads/Day', '25 Paid Comments/Day', 'Ultimate Earning Power', 'VIP Concierge']
  }
};

export const USER_STATS: UserStats = {
  balance: 1240.50,
  usdtBalance: 0,
  totalEarnings: 1560.65,
  referrals: 12,
  referralEarnings: 60.00,
  postEarnings: 0,
  referralList: [],
  postsReadToday: 0,
  postsReadTarget: 3,
  commentsMadeToday: 0,
  commentsTarget: 1,
  pendingRewards: 45.00,
  lastUpdateDate: new Date().toISOString().split('T')[0],
  transactions: []
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'system',
    status: 'approved',
    slug: 'future-of-ai-development',
    title: 'The Future of Generative AI: Beyond Chatbots',
    excerpt: 'Exploring how multimodal models are reshaping the landscape of software engineering and creative arts.',
    content: '',
    chapters: [
      {
        id: 'c1-1',
        title: 'Introduction to Multimodal LLMs',
        order: 1,
        content: '<p>The landscape of artificial intelligence is shifting faster than we could have predicted just two years ago. We are moving from simple text-based interactions to complex, multimodal systems that understand audio, video, and code as fluently as text.</p><p>Multimodality is not just a trend; it is the natural evolution of how machines process human-like inputs. By combining vision, sound, and language, AI can now perform tasks that were once thought impossible, such as real-time architectural design from voice descriptions.</p>'
      },
      {
        id: 'c1-2',
        title: 'The Bridge Between Design and Implementation',
        order: 2,
        content: '<h2>The Rise of Multimodal Learning</h2><p>Developers are now leveraging models that can literally "see" the UI they are building. This bridge between design and implementation is narrowing.</p><p>Imagine a world where a hand-drawn sketch on a napkin can be converted into a functional React component in seconds. This is the power of vision-augmented LLMs that JobbaWorks writers are increasingly covering.</p>'
      }
    ],
    author: {
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Senior Software Architect specializing in LLM integrations.'
    },
    category: 'Technology',
    publishDate: 'Oct 24, 2024',
    readingTime: '6 min read',
    featuredImage: 'https://picsum.photos/seed/ai/1200/600',
    trending: true,
    isHighValue: true,
    comments: [],
    aiModeration: {
      grammarScore: 98,
      plagiarismRisk: 'low',
      isSpam: false,
      summary: 'High quality technical article.',
      flags: []
    }
  },
  {
    id: '2',
    authorId: 'system',
    status: 'approved',
    slug: 'financial-freedom-2025',
    title: 'Modern Strategies for Financial Independence',
    excerpt: 'Why traditional retirement models are failing and how to build a diversified portfolio in a volatile market.',
    content: '',
    chapters: [
      {
        id: 'c2-1',
        title: 'The 2025 Financial Reality',
        order: 1,
        content: '<p>Financial independence is no longer about hitting a magic number at 65. It\'s about building cash flow engines that support your lifestyle today.</p><p>The era of low interest rates and predictable indices is over. Today, a robust portfolio must include uncorrelated assets, yield-bearing decentralized finance protocols, and fractional ownership in high-growth enterprises.</p>'
      }
    ],
    author: {
      name: 'James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      bio: 'Ex-Wall Street analyst turned independent financial advisor.'
    },
    category: 'Finance',
    publishDate: 'Oct 22, 2024',
    readingTime: '8 min read',
    featuredImage: 'https://picsum.photos/seed/finance/1200/600',
    trending: true,
    isHighValue: true,
    comments: [],
    aiModeration: {
      grammarScore: 95,
      plagiarismRisk: 'low',
      isSpam: false,
      summary: 'Well-structured financial advice.',
      flags: []
    }
  }
];
