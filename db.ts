import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    planId TEXT DEFAULT 'free',
    status TEXT DEFAULT 'active',
    joinedDate TEXT NOT NULL,
    referralCode TEXT UNIQUE NOT NULL,
    referredBy TEXT,
    avatar TEXT,
    completedReadingPosts TEXT DEFAULT '[]',
    completedCommentPosts TEXT DEFAULT '[]',
    lastLimitModalDate TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    authorId TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    featuredImage TEXT,
    publishDate TEXT,
    readingTime TEXT,
    status TEXT DEFAULT 'draft',
    aiModeration TEXT,
    FOREIGN KEY (authorId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS stats (
    userId TEXT PRIMARY KEY,
    balance REAL DEFAULT 0,
    totalEarnings REAL DEFAULT 0,
    postEarnings REAL DEFAULT 0,
    referrals INTEGER DEFAULT 0,
    referralEarnings REAL DEFAULT 0,
    postsReadToday INTEGER DEFAULT 0,
    commentsMadeToday INTEGER DEFAULT 0,
    pendingRewards REAL DEFAULT 0,
    lastUpdateDate TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Add phone to users if it doesn't exist
try {
  db.exec('ALTER TABLE users ADD COLUMN phone TEXT');
} catch (e) {
  // Column might already exist
}

// Add usdtBalance to stats if it doesn't exist
try {
  db.exec('ALTER TABLE stats ADD COLUMN usdtBalance REAL DEFAULT 0');
} catch (e) {
  // Column might already exist
}

// Seed initial categories if empty
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
  ['Technology', 'Entertainment', 'Health', 'Lifestyle', 'Business', 'Design', 'Education', 'Product Reviews', 'Finance'].forEach(cat => {
    insertCategory.run(cat);
  });
}

// Seed default settings if empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
if (settingsCount.count === 0) {
  const defaultSettings = {
    leaderboardEnabled: true,
    swapEnabled: true,
    referralsEnabled: true,
    earningsEnabled: true,
    walletEnabled: true,
  };
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('pageToggles', JSON.stringify(defaultSettings));
}

// Seed guest admin if empty
const guestAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('guest-admin@jobbaworks.com');
if (!guestAdmin) {
  import('bcryptjs').then(bcrypt => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('guest123', salt);
    
    const id = 'admin_guest';
    const joinedDate = new Date().toISOString().split('T')[0];
    db.prepare(`
      INSERT INTO users (id, name, email, password, role, planId, status, joinedDate, referralCode, avatar)
      VALUES (?, ?, ?, ?, 'admin', 'elite', 'active', ?, ?, ?)
    `).run(id, 'Guest Admin', 'guest-admin@jobbaworks.com', hashedPassword, joinedDate, 'GUEST', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuestAdmin');

    db.prepare(`
      INSERT INTO stats (userId, balance, totalEarnings, postEarnings, referrals, referralEarnings, postsReadToday, commentsMadeToday, pendingRewards, lastUpdateDate)
      VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0, ?)
    `).run(id, joinedDate);
  });
}

export default db;
