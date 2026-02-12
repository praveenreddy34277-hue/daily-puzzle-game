# Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/daily-puzzle-game.git
cd daily-puzzle-game
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with Firebase and Database credentials
```

### 3. Run Locally
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 📚 File Quick Reference

| File | Purpose |
|------|---------|
| `lib/firebase.ts` | Firebase initialization |
| `lib/contexts/AuthContext.tsx` | Authentication state |
| `lib/puzzleFactory.ts` | Daily puzzle generation |
| `lib/puzzles/*.tsx` | Puzzle implementations |
| `components/Game.tsx` | Main game logic |
| `app/api/*` | Backend API routes |
| `lib/db.ts` | Client storage (IndexedDB) |
| `lib/db.server.ts` | Server storage (PostgreSQL) |

---

## 🎮 Game Flow

```
User visits http://localhost:3000
    ↓
Checks auth status
    ├─ Not logged in? → Redirect to /login
    └─ Logged in? → Load /game
    ↓
/game page loads:
    1. Fetch user progress from IndexedDB
    2. Generate today's puzzle (deterministic seed)
    3. Display puzzle to user
    4. User solves and submits
    5. Validate answer (client-side)
    6. Update streaks and score
    7. Save to IndexedDB
    8. Sync to PostgreSQL (optional)
    ↓
Show results and next day link
```

---

## 🧩 Puzzle Types

| Type | Location | Complexity |
|------|----------|-----------|
| Arithmetic | `lib/puzzles/arithmetic.tsx` | Easy |
| Word Scramble | `lib/puzzles/wordScramble.tsx` | Easy |
| Pattern | `lib/puzzles/pattern.tsx` | Medium |
| Memory Grid | `lib/puzzles/memoryGrid.tsx` | Medium |
| Logic Ordering | `lib/puzzles/logicOrdering.tsx` | Hard |

---

## 🔑 Environment Variables

```env
# Firebase (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# PostgreSQL (get from Neon)
DATABASE_URL=postgresql://user:pass@host/db
```

---

## 🧪 Testing Checklist

- [ ] Can sign in with Google
- [ ] Puzzle loads after login
- [ ] Can submit answer and get feedback
- [ ] Streak updates correctly
- [ ] Data persists after refresh
- [ ] New puzzle appears each day
- [ ] Can sign out

---

## 🚢 Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Neon database provisioned
- [ ] Repository pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables added to Vercel
- [ ] Test deployment works
- [ ] Custom domain configured (optional)

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Firebase config missing" | Check `.env.local` has all variables starting with `NEXT_PUBLIC_` |
| "Cannot connect to database" | Verify `DATABASE_URL` is correct; test with `psql` |
| "Sign in fails" | Add `localhost` to Firebase authorized domains |
| "Puzzle not loading" | Check browser console; clear site data and refresh |

---

## 📊 Database Queries

### Get user's progress
```sql
SELECT * FROM user_progress WHERE user_id = 'firebase-uid';
```

### Check today's completion
```sql
SELECT * FROM daily_completions WHERE user_id = 'uid' AND date = '2024-02-11';
```

### Top scorers
```sql
SELECT user_id, total_score, current_streak 
FROM user_progress 
ORDER BY total_score DESC 
LIMIT 10;
```

---

## 📚 Code Snippets

### Use Auth Hook
```tsx
import { useAuth } from '@/lib/contexts/AuthContext';

function MyComponent() {
  const { user, signInWithGoogle, logout } = useAuth();
  
  return (
    <>
      {user ? (
        <>Welcome, {user.displayName}!</>
      ) : (
        <button onClick={signInWithGoogle}>Sign In</button>
      )}
    </>
  );
}
```

### Generate Puzzle
```tsx
import { PuzzleFactory } from '@/lib/puzzleFactory';

const puzzle = PuzzleFactory.getDailyPuzzle();
console.log(puzzle.metadata.title);
```

### Save Progress
```tsx
import { updateUserProgress } from '@/lib/db';

await updateUserProgress({
  userId: user.uid,
  currentStreak: 5,
  totalScore: 150,
  // ... other fields
});
```

---

## 🎯 Next Features to Add

1. **Leaderboard** - Top scorers and streaks
2. **Achievements** - Badges for milestones
3. **Difficulty Settings** - Easy/Medium/Hard modes
4. **Multiplayer** - Compete with friends
5. **Comments** - Share puzzle tips
6. **Mobile App** - React Native or PWA

---

## 📞 Support

- **Docs**: See [SETUP.md](SETUP.md) and [IMPLEMENTATION.md](IMPLEMENTATION.md)
- **Code Comments**: Check source files for detailed explanations
- **GitHub Issues**: Report bugs or request features

---

## ⌨️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Run production server

# Linting
npm run lint            # Check for errors

# Database
npx vercel env pull     # Pull Vercel env vars locally
```

---

**Made with ❤️ by your team**
