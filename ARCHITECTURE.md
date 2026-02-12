# Architecture Documentation

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER (Client)                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────────────────────────────┐         │
│  │            React 18 + Next.js 14 Components            │         │
│  ├─────────────────────────────────────────────────────────┤         │
│  │                                                         │         │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────┐    │         │
│  │  │  Login   │  │   Game UI    │  │  Progress    │    │         │
│  │  │  Page    │  │   (Puzzle)   │  │  Display     │    │         │
│  │  └──────────┘  └──────────────┘  └──────────────┘    │         │
│  │                                                         │         │
│  └─────────────────────────────────────────────────────────┘         │
│                          ▲       │       ▲                           │
│                          │       │       │                           │
│  ┌───────────────────────┴───┬───┴───┬───┴───────────────────────┐  │
│  │                       STATE MANAGEMENT                        │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  ┌─────────────────┐  ┌───────────────────────────────┐   │  │
│  │  │ AuthContext     │  │  Puzzle Logic & Validation    │   │  │
│  │  │ • User data     │  │  • Seeded generation          │   │  │
│  │  │ • Session token │  │  • Client-side validation     │   │  │
│  │  └─────────────────┘  │  • Streak calculation         │   │  │
│  │                       └───────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                          ▲       │                                 │
│                          │       │                                 │
│  ┌───────────────────────┴───────┴──────────────────────────────┐ │
│  │         Local Storage (IndexedDB via Dexie)                  │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  • User progress (streaks, scores)                           │ │
│  │  • Today's puzzle state                                      │ │
│  │  • User answers and attempts                                 │ │
│  │  • Timer and session data                                    │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                 │
└───────────────────────────────┼─────────────────────────────────┘
                                │
                    HTTP/HTTPS  │
                                │
┌───────────────────────────────┴─────────────────────────────────────┐
│                    VERCEL (Edge Network)                             │
├───────────────────────────────┬─────────────────────────────────────┤
│                               │                                     │
│  ┌────────────────────────────▼──────────────────────────────┐    │
│  │            Next.js API Routes (Node.js)                  │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │  • /api/health          - Database health check        │    │
│  │  • /api/progress        - User progress sync           │    │
│  │  • /api/completion      - Daily completion tracking    │    │
│  │                                                         │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                     │
│                      (Optional)                                │
│                     Sync to DB                                │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│           NEON (PostgreSQL Cloud Database)                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  users           │  │  user_progress   │  │  daily_      │  │
│  │  • id (PK)       │  │  • user_id (FK)  │  │  completions │  │
│  │  • email         │  │  • current_streak│  │  • user_id   │  │
│  │  • name          │  │  • longest_streak│  │  • date      │  │
│  │  • avatar_url    │  │  • total_score   │  │  • completed │  │
│  │  • created_at    │  │  • last_completed│  │  • score     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
LOGIN FLOW:
─────────

User clicks "Sign in"
        ↓
Firebase OAuth
        ↓
Firebase returns JWT
        ↓
AuthContext stores token
        ↓
Redirect to /game
        ↓
Load user progress from IndexedDB


PUZZLE FLOW:
───────────

On /game page load:
        ↓
generateDailySeed(date)  ← Same seed for all users worldwide
        ↓
PuzzleFactory.generatePuzzle(seed)
        ↓
Select puzzle type (deterministic)
        ↓
Generate puzzle data (deterministic)
        ↓
Render puzzle UI
        ↓
User solves → Submit answer
        ↓
Client-side validation
        ↓
Update progress & streak
        ↓
Save to IndexedDB
        ↓
(Optional) Sync to PostgreSQL


STATE MANAGEMENT:
────────────────

Redux-like Flow (without Redux):

Component
    ↓
useAuth() hook → AuthContext
    ↓
AuthState + Functions
    ↓
Component re-renders

Game Component
    ↓
Load puzzle + progress
    ↓
IndexedDB queries
    ↓
Update state
    ↓
Re-render with new state
    ↓
Save back to IndexedDB
```

## Component Hierarchy

```
App
├── layout.tsx
│   └── AuthProvider
│       ├── / (page.tsx)
│       │   └── Redirect logic
│       ├── /login (page.tsx)
│       │   └── LoginPage
│       │       └── Google Sign-In button
│       └── /game (page.tsx)
│           └── GameComponent
│               ├── ProgressDisplay
│               │   ├── Current Streak card
│               │   ├── Longest Streak card
│               │   ├── Puzzles Solved card
│               │   └── Total Score card
│               └── PuzzleDisplay
│                   ├── Puzzle Renderer (type-specific)
│                   │   ├── ArithmeticPuzzleRenderer
│                   │   ├── WordScrambleRenderer
│                   │   ├── PatternRenderer
│                   │   ├── MemoryGridRenderer
│                   │   └── LogicOrderingRenderer
│                   ├── Input controls
│                   ├── Submit button
│                   ├── Feedback message
│                   └── Rules list
```

## Data Model

### User Object (Firebase)
```typescript
{
  uid: "firebase-unique-id",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  emailVerified: true,
  metadata: { ... }
}
```

### User Progress (IndexedDB & PostgreSQL)
```typescript
{
  userId: "firebase-uid",
  currentStreak: 5,
  longestStreak: 12,
  totalPuzzlesSolved: 47,
  completedDates: ["2024-02-01", "2024-02-02", ...],
  totalScore: 485,
  lastCompletedDate: "2024-02-11"
}
```

### Daily Completion (PostgreSQL)
```typescript
{
  userId: "firebase-uid",
  date: "2024-02-11",
  puzzleId: "arithmetic-20240211",
  isCompleted: true,
  score: 10,
  timeSpent: 45,        // seconds
  attempts: 1
}
```

### Puzzle State (IndexedDB)
```typescript
{
  userId: "firebase-uid",
  date: "2024-02-11",
  puzzle: { /* full puzzle object */ },
  userAnswer: "42",
  isSubmitted: true,
  isCorrect: true,
  attempts: 1,
  timeSpent: 45,
  startTime: 1707619200000
}
```

## Authentication Flow

```
FIREBASE AUTHENTICATION:
───────────────────────

1. User clicks "Sign in with Google"
   ↓
2. Firebase opens Google OAuth popup
   ↓
3. User logs in with Google account
   ↓
4. Google authorizes Firebase app
   ↓
5. Firebase returns:
   - JWT ID token
   - Refresh token
   - User info
   ↓
6. Firebase SDK stores tokens securely
   ↓
7. AuthContext updates user state
   ↓
8. Components re-render
   ↓
9. User can access /game


PERSISTENCE:
───────────

Firebase SDK automatically handles:
✓ Storing tokens in secure storage
✓ Refreshing tokens when needed
✓ Maintaining session across page refreshes
✓ Logging out and clearing tokens


VERIFICATION:
────────────

Server API routes can:
1. Extract token from request headers
2. Verify token with Firebase admin SDK
3. Extract uid from verified token
4. Use uid to access user data
```

## Puzzle Generation Algorithm

```
DETERMINISTIC SEEDING:
─────────────────────

Date: 2024-02-11
  ↓
Format: "20240211" (YYYYMMDD)
  ↓
Convert to number: 20240211
  ↓
Apply hash: (20240211 * 9301 + 49297) % 233280
  ↓
Result: stable_seed_number
  ↓
(Same seed every 2024-02-11)


PUZZLE TYPE SELECTION:
──────────────────────

seed = 45678
  ↓
Create SeededRandom(45678)
  ↓
Available types: [ARITHMETIC, WORD_SCRAMBLE, ...]
  ↓
selectedType = types[seed % types.length]
  ↓
Result: Deterministic type


PUZZLE DATA GENERATION:
──────────────────────

type = ARITHMETIC
seed = 45678
  ↓
rng = SeededRandom(45678)
  ↓
num1 = rng.nextInt(1, 50)  // 23
  ↓
num2 = rng.nextInt(1, 50)  // 17
  ↓
operator = rng.nextChoice(['+', '-', '*', '/'])  // '+'
  ↓
answer = 23 + 17 = 40
  ↓
Result: Complete puzzle


PROPERTIES:
──────────

✓ Same seed → Same puzzle
✓ Same date → Same seed
✓ Same date (any year) → Same seed
✓ Next day → Different seed → Different puzzle
✓ All users globally get same puzzle on date X
```

## Streak Calculation Logic

```
CURRENT STREAK LOGIC:
────────────────────

Today is 2024-02-11

Case 1: lastCompletedDate = "2024-02-10" (yesterday)
  ✓ Puzzle completed today
  → currentStreak++
  → Update lastCompletedDate

Case 2: lastCompletedDate = "2024-02-11" (today)
  ✓ Already completed today
  → Keep same streak
  → Don't increment

Case 3: lastCompletedDate = "2024-02-09" or earlier
  ✓ Missed at least one day
  → Reset streak to 1
  → Update lastCompletedDate


LONGEST STREAK:
───────────────

After each completion:
  if currentStreak > longestStreak:
    longestStreak = currentStreak
```

## API Response Examples

### /api/health
```json
{
  "status": "healthy",
  "timestamp": "2024-02-11T15:30:45Z",
  "database": "connected"
}
```

### /api/progress (GET)
```json
{
  "userId": "firebase-uid-123",
  "currentStreak": 5,
  "longestStreak": 12,
  "totalPuzzlesSolved": 47,
  "totalScore": 485,
  "lastCompletedDate": "2024-02-11"
}
```

### /api/completion (POST)
```json
{
  "success": true,
  "data": {
    "id": 1234,
    "user_id": "firebase-uid-123",
    "date": "2024-02-11",
    "puzzle_id": "arithmetic-20240211",
    "is_completed": true,
    "score": 10,
    "time_spent": 45,
    "attempts": 1,
    "created_at": "2024-02-11T15:30:45Z"
  }
}
```

## Deployment Architecture

```
LOCAL DEVELOPMENT:
─────────────────
npm run dev
    ↓
Next.js dev server (http://localhost:3000)
    ↓
Uses .env.local for config


PRODUCTION (VERCEL):
───────────────────
Push to GitHub
    ↓
GitHub triggers Vercel build webhook
    ↓
Vercel builds Next.js app
    ↓
Deploys to edge network
    ↓
Uses environment variables
    ↓
API routes execute as serverless functions
    ↓
Connect to Neon PostgreSQL
```

---

This architecture ensures:
✓ Fast client-side experience
✓ Minimal server load
✓ Scalable to millions of users
✓ Persistent data storage
✓ Easy deployment and updates
