# Daily Puzzle Game - Setup & Development Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running Locally](#running-locally)
6. [Architecture](#architecture)
7. [Deployment](#deployment)
8. [Features Implemented](#features-implemented)

## 🎯 Project Overview

**Daily Puzzle Game** is a full-stack web application that:
- Allows users to authenticate via Google
- Provides one unique puzzle per day (same for all users)
- Tracks streaks, scores, and completion history
- Offers 5+ different puzzle types
- Uses deterministic seeding for consistent daily puzzles
- Stores progress locally (IndexedDB) and remotely (PostgreSQL)

### Key Differentiators
- **Client-first architecture**: Puzzles are solved and validated entirely in the browser
- **Deterministic generation**: All users get the same puzzle each day via mathematical seeding
- **Offline-capable**: Full state persists locally; syncs to server when online
- **Scalable**: No heavy computation on server; database only stores progress records

---

## 📦 Prerequisites

Before you start, ensure you have:

1. **Node.js 18+** - [Download](https://nodejs.org/)
   ```bash
   node --version  # Should be v18+
   ```

2. **npm 9+** - Comes with Node.js
   ```bash
   npm --version
   ```

3. **Git** - [Download](https://git-scm.com/)

4. **Firebase Account** - [Create Free Account](https://firebase.google.com/)
   - You'll need a Google account
   - Create a new Firebase project
   - Enable Google Sign-In

5. **Neon PostgreSQL Account** - [Sign Up](https://neon.tech/)
   - Create a free PostgreSQL database
   - Get your connection string

6. **GitHub Account** (optional, for deployment)
7. **Vercel Account** (optional, for production deployment) - [Sign Up](https://vercel.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/daily-puzzle-game.git
cd daily-puzzle-game
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages:
- React 18 & Next.js 14
- Firebase SDK
- Tailwind CSS
- Dexie (IndexedDB)
- PostgreSQL client

---

## ⚙️ Configuration

### Step 1: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. In **Authentication**:
   - Click "Get Started"
   - Enable "Google" sign-in provider
   - Set authorized domains (add `localhost` for development)

4. Get your credentials from **Project Settings** → **General**:
   - Copy the config object

### Step 2: Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Create a new database (or use `postgres`)
4. Copy the connection string from **Connection string** → **Pooled connection**
   - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

### Step 3: Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Firebase Configuration (from Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myproject-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx

# PostgreSQL Connection (from Neon)
DATABASE_URL=postgresql://neon_user:neon_password@ep-xxxxx.neon.tech/neon_dbname?sslmode=require
```

**⚠️ Never commit `.env.local` to Git!** It's already in `.gitignore`.

---

## 🏃 Running Locally

### 1. Start Development Server

```bash
npm run dev
```

You should see:
```
> next dev
  
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### 2. Open in Browser

Visit `http://localhost:3000`

You should be redirected to `/login` where you can sign in with Google.

### 3. First-Time Database Setup

When you first try to play, the app will:
1. Create IndexedDB schema locally
2. Call `/api/health` to initialize PostgreSQL tables
3. Create your user record
4. Initialize progress tracking

**No manual SQL needed!**

---

## 📂 Architecture Overview

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety across the codebase
- **Tailwind CSS**: Utility-first styling
- **Dexie**: IndexedDB wrapper for client storage
- **Firebase**: Authentication & session management

### Backend Stack
- **Node.js + Next.js API Routes**: Serverless functions
- **PostgreSQL (Neon)**: Persistent data storage
- **pg library**: PostgreSQL client

### Data Flow

```
┌─────────────────┐
│   Browser       │
│  (React + TS)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌──────────────┐
│IndexedDB│  │API Routes    │
│(Local)  │  │(Next.js)     │
└────────┘  └──────┬───────┘
                   │
                   ▼
            ┌─────────────────┐
            │  PostgreSQL     │
            │  (Neon Cloud)   │
            └─────────────────┘
```

### Key Components

**Authentication** ([lib/contexts/AuthContext.tsx](lib/contexts/AuthContext.tsx))
- Manages Firebase auth state
- Provides `useAuth()` hook
- Persists session across refreshes

**Puzzle Framework** ([lib/types.ts](lib/types.ts))
- Defines puzzle interfaces
- Standardizes puzzle structure
- Enables easy addition of new types

**Puzzle Factory** ([lib/puzzleFactory.ts](lib/puzzleFactory.ts))
- Generates daily puzzle from seed
- Selects puzzle type deterministically
- Ensures all users get same puzzle

**Puzzle Implementations**
- [lib/puzzles/arithmetic.tsx](lib/puzzles/arithmetic.tsx) - Math problems
- [lib/puzzles/wordScramble.tsx](lib/puzzles/wordScramble.tsx) - Word games
- [lib/puzzles/pattern.tsx](lib/puzzles/pattern.tsx) - Sequence patterns
- [lib/puzzles/memoryGrid.tsx](lib/puzzles/memoryGrid.tsx) - Memory challenges
- [lib/puzzles/logicOrdering.tsx](lib/puzzles/logicOrdering.tsx) - Logic puzzles

**Game Component** ([components/Game.tsx](components/Game.tsx))
- Orchestrates puzzle display and validation
- Manages state persistence
- Handles streak updates
- Syncs with IndexedDB and server

**Storage Layer**
- **Client** ([lib/db.ts](lib/db.ts)): IndexedDB via Dexie
- **Server** ([lib/db.server.ts](lib/db.server.ts)): PostgreSQL queries

**API Endpoints**
- `GET/POST /api/health` - Database health check
- `GET/POST /api/progress` - User progress syncing
- `GET/POST /api/completion` - Daily completion tracking

---

## 🔐 Understanding Authentication

### Firebase Sign-In Flow

```
User clicks "Sign in with Google"
    ↓
Firebase opens Google OAuth dialog
    ↓
User logs in with Google account
    ↓
Firebase returns JWT token
    ↓
Token stored in browser session
    ↓
Persisted via Firebase's built-in mechanism
    ↓
useAuth() hook provides user data throughout app
```

### Session Persistence

- Firebase automatically manages tokens
- Session persists across page refreshes
- Tokens are stored securely by Firebase SDK
- Logout clears all auth state

---

## 🎮 Puzzle System Design

### Daily Seed Generation

```typescript
// Date YYYY-MM-DD → Deterministic number seed
const date = "2024-02-11"
const seed = parseInt("20240211") // 20240211
// Then hashed: seed = (seed * 9301 + 49297) % 233280
// Result: Same seed every Feb 11, any year
```

### Puzzle Selection

1. Use seed to select puzzle type randomly
2. Use same seed to generate puzzle data
3. All users worldwide get identical puzzle

### Validation

- All validation happens in browser
- No server-side computation needed
- User gets instant feedback
- State saved to IndexedDB immediately

### Streak Logic

```
Today's puzzle completed?
  ├─ No: Maintain current streak
  └─ Yes:
     ├─ Last completed = yesterday? Increment streak
     ├─ Last completed = today? Keep same streak
     └─ Before yesterday? Reset to 1
```

---

## 🚀 Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Prerequisites
- GitHub repo with this code
- Vercel account (free)

#### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select this GitHub repository

3. **Configure Environment**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all your `.env.local` variables

4. **Deploy**
   - Vercel automatically builds on push
   - Your app is live at `https://yourproject.vercel.app`

#### Auto-Deploy

Every push to `main` automatically redeploys your app!

### Option 2: Deploy to Other Platforms

The app works on any Node.js hosting:
- **Heroku**: Use `Procfile` (you'll need to create one)
- **Railway**: Auto-detects Next.js
- **Render**: Supports Next.js deployments

---

## 🧪 Testing Locally

### Test Authentication
1. Go to `http://localhost:3000/login`
2. Click "Sign in with Google"
3. Use your test Google account
4. Should redirect to `/game`

### Test Puzzle Loading
1. After login, puzzle should load
2. Try solving it
3. Submit and check validation

### Test Data Persistence
1. Solve a puzzle
2. Refresh the page
3. Progress should be saved (shown in IndexedDB)
4. Complete another puzzle
5. Check streak updated

### Test Database
1. Curl the health endpoint:
   ```bash
   curl http://localhost:3000/api/health
   ```
2. Should return: `{"status":"healthy","timestamp":"...","database":"connected"}`

---

## 🐛 Troubleshooting

### "Firebase config is missing"
- Check `.env.local` has all Firebase variables
- Make sure they start with `NEXT_PUBLIC_`
- Restart dev server after changes

### "Cannot connect to database"
- Verify `DATABASE_URL` in `.env.local`
- Test connection: `psql "$DATABASE_URL"`
- Check Neon dashboard for active database

### "Sign in fails"
- Check Firebase project has Google Sign-In enabled
- Verify `localhost` is in authorized domains
- Try incognito window (clear cookies)

### "Puzzle not loading"
- Check browser console for errors
- Verify IndexedDB enabled (DevTools → Storage → IndexedDB)
- Try clearing site data and reload

---

## 📈 Development Workflow

### Adding a New Puzzle Type

1. **Create puzzle file** in `lib/puzzles/`:
   ```typescript
   // lib/puzzles/myPuzzle.tsx
   import { PuzzleType, BasePuzzle } from '@/lib/types';
   
   export class MyPuzzleGenerator {
     static generate(seed: number): MyPuzzle { ... }
   }
   
   export function MyPuzzleRenderer({ puzzle }) { ... }
   
   export class MyPuzzleValidator {
     static validate(puzzle, answer) { ... }
   }
   ```

2. **Add type** to `PuzzleType` enum in [lib/types.ts](lib/types.ts)

3. **Register in factory** in [lib/puzzleFactory.ts](lib/puzzleFactory.ts):
   ```typescript
   case PuzzleType.MY_PUZZLE:
     return MyPuzzleGenerator.generate(seed);
   ```

4. **Test** - should appear in daily rotation!

### Making Code Changes

```bash
# Make changes
git add .
git commit -m "Describe your changes"
git push origin main

# Vercel auto-deploys
# Check deployment at vercel.com
```

---

## 📊 Database Schema

### users
```sql
id VARCHAR(255) PRIMARY KEY      -- Firebase UID
email VARCHAR(255) UNIQUE        -- User email
name VARCHAR(255)                -- Display name
avatar_url VARCHAR(512)          -- Profile picture
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### user_progress
```sql
id SERIAL PRIMARY KEY
user_id VARCHAR(255) UNIQUE      -- FK to users
current_streak INT DEFAULT 0
longest_streak INT DEFAULT 0
total_puzzles_solved INT DEFAULT 0
total_score INT DEFAULT 0
last_completed_date DATE
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### daily_completions
```sql
id SERIAL PRIMARY KEY
user_id VARCHAR(255)             -- FK to users
date DATE                        -- YYYY-MM-DD
puzzle_id VARCHAR(255)           -- Puzzle identifier
is_completed BOOLEAN DEFAULT FALSE
score INT DEFAULT 0
time_spent INT DEFAULT 0         -- seconds
attempts INT DEFAULT 0
created_at TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, date)            -- One completion per day per user
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Dexie.js](https://dexie.org/)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add puzzle type"`
4. Push to GitHub: `git push origin feature/my-feature`
5. Create Pull Request

---

## 📝 License

MIT - Use freely for personal or commercial projects

---

**Questions?** Check the code comments or open an issue on GitHub!
