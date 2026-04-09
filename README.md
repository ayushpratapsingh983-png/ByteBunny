


# 🐰 ByteBunny v0.1

> Learn coding languages the fun way — Tauri 2 + Rust + React + Firebase

---
ByteBunny 🐰 is a fast, gamified desktop coding companion built with Tauri and React. It makes learning engaging with interactive paths, daily streaks, and custom animations. Featuring a sleek UI and secure auth, it delivers native performance to supercharge your programming adventure.
## ✨ What's new in v0.1

| Feature | Details |
|---|---|
| 🔥 Firebase Auth | Email/password + Google Sign-In, persisted across app restarts |
| ☁️ Cloud sync | Firestore real-time — progress syncs across devices instantly |
| 🔑 Admin panel | Push new levels live without redeploying |
| 🐰 Loading screen | Animated bunny with cycling coding tips |
| 🎮 Gammy auth | Hopping bunny animation on login/signup buttons |
| 📡 Scanline fix | Only shows on menu/auth pages, never during gameplay |
=======
# 🐰 ByteBunny

> Learn coding languages the fun way — built with **Tauri 2 + Rust + React**

---

## ✨ Features

- **6 Coding Languages**: Python, JavaScript, Rust, SQL, Bash, Go
- **50 Levels per language** with progressive difficulty
- **Recap every 5 levels** to reinforce learning
- **3-heart system** — wrong answers cost hearts; retry improves your score
- **Daily streak tracking** with visual weekly calendar
- **XP system** — earn points based on accuracy
- **Email / phone / username auth** with password strength enforcement
- **Dark & Light mode** toggle in Settings
- **Zigzag level map** with SVG bezier path connections
- **ByteBunny mascot** 🐰 reacts to your answers
- **Persistent storage** via Tauri Plugin Store (native JSON on disk)
- **Monospace throughout** — JetBrains Mono font

---

## 🛠️ Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Rust | ≥ 1.77  | https://rustup.rs |
| Node | ≥ 18    | https://nodejs.org |
| npm  | ≥ 9     | bundled with Node |
| Tauri CLI | 2.x | `npm install -g @tauri-apps/cli` |
>>>>>>> 0189a73c6eae47f41fc20cb0e28fb92172c6c37b

---

## 🚀 Quick Start

```bash
<<<<<<< HEAD
npm install
npm run tauri dev       # dev mode with hot reload
npm run tauri build     # production build
```

**Prerequisites:** Rust ≥ 1.77, Node ≥ 18
**Linux:** `sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`

---

## 🔥 Firebase Setup

Your Firebase credentials are already wired in `src/lib/firebase.js`.
You just need to enable the services:

### 1 — Enable Auth methods
Firebase Console → **byte-bunny** → **Authentication** → **Sign-in method**
- Enable **Email/Password**
- Enable **Google** (set a support email)

### 2 — Create Firestore
Firebase Console → **Firestore Database** → **Create database** → Production mode → pick region

### 3 — Deploy security rules
Firebase Console → Firestore → **Rules** tab → paste from `firestore.rules` → Publish

### 4 — Make yourself Admin
1. Sign up in the app (creates your Firebase user)
2. Firebase Console → **Authentication** → **Users** → copy your UID
3. Add it to `src/stores/appStore.js`:
```js
const ADMIN_UIDS = ['paste-your-uid-here'];
```
4. Add same UID in `firestore.rules` write rule
5. Restart app — **🔑 Admin Panel** appears in Profile

### 5 — Authorize Google OAuth domain
Firebase Console → Authentication → **Settings** → **Authorized domains** → add `localhost` + your prod domain

---

## 🔑 Admin Panel

**Profile → 🔑 Admin Panel** (admin users only)

### Push levels (JSON format)
```json
[
  {
    "id": 51,
    "recap": false,
    "title": "Level 51",
    "q": "What does `git rebase` do?",
    "opts": ["Merges branches", "Moves commits to new base", "Deletes commits", "Pushes to remote"],
    "ans": 1,
    "xp": 35
  }
]
```
Push → players see new levels immediately, no app update needed.

---

## 🌊 Persistent Auth Flow

```
App opens → Firebase checks IndexedDB session
  ├─ Session found → restore user → go to home ✅
  └─ No session    → show welcome screen

Log out → Firebase clears session → next open shows welcome ✅
```

---

## ☁️ Real-time Sync Flow

```
Complete level → pushToFirestore(/users/{uid})
                         ↓
             onSnapshot fires on all other devices
                         ↓
             mergeProgress() takes best score per level
                         ↓
             UI updates live across devices ✅
```
=======
# 1. Clone / unzip the project
cd bytebunny

# 2. Install JS dependencies
npm install

# 3. Run in development mode (hot reload)
npm run tauri dev

# 4. Build production app
npm run tauri build
```

The built installers will be in `src-tauri/target/release/bundle/`.
>>>>>>> 0189a73c6eae47f41fc20cb0e28fb92172c6c37b

---

## 📁 Project Structure

```
bytebunny/
<<<<<<< HEAD
├── src/
│   ├── lib/firebase.js          ← Config, auth helpers, Firestore push/subscribe
│   ├── stores/appStore.js       ← Zustand + Firebase (source of truth)
│   ├── data/levels.js           ← Built-in levels + async Firestore override loader
│   ├── components/UI.jsx        ← Bunny, Toast, Nav, Settings, Scanline
│   └── pages/
│       ├── LoadingScreen.jsx    ← Bunny tips screen shown while Firebase init
│       ├── AuthPages.jsx        ← Login/Signup with BunnyLoader animation
│       ├── MapPage.jsx          ← Async levels from Firestore
│       ├── LevelPage.jsx        ← Async levels from Firestore
│       ├── ProfilePage.jsx      ← Admin button for admin users
│       └── AdminPage.jsx        ← Push levels + user lookup + deployment checklist
├── src-tauri/src/lib.rs         ← Rust: validate_password, scoring, xp calc
├── firestore.rules              ← Deploy to Firebase Console
└── package.json                 ← firebase ^10 included
=======
├── src/                        # React frontend
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Page router
│   ├── styles/
│   │   └── globals.css         # All CSS (dark/light themes, animations)
│   ├── stores/
│   │   └── appStore.js         # Zustand state + Tauri Store persistence
│   ├── data/
│   │   └── levels.js           # 50 questions per language + level generator
│   ├── components/
│   │   └── UI.jsx              # Shared components (Bunny, Toast, Nav, etc.)
│   └── pages/
│       ├── WelcomePage.jsx     # Landing screen
│       ├── AuthPages.jsx       # Login + Signup
│       ├── HomePage.jsx        # Language selection + continue button
│       ├── MapPage.jsx         # Zigzag level map
│       ├── LevelPage.jsx       # Quiz / answer screen
│       └── ProfilePage.jsx     # Stats, badges, streak calendar
├── src-tauri/                  # Rust backend
│   ├── src/
│   │   ├── main.rs             # Entry point
│   │   └── lib.rs              # Tauri commands (validate_password, scoring, etc.)
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # App config (window size, bundle, etc.)
│   ├── build.rs                # Build script
│   └── capabilities/
│       └── default.json        # Permission scopes
├── public/
│   └── bunny.svg               # App icon
├── index.html                  # HTML shell
├── vite.config.js              # Vite bundler config
└── package.json                # Node dependencies
>>>>>>> 0189a73c6eae47f41fc20cb0e28fb92172c6c37b
```

---

<<<<<<< HEAD
## 🦀 Rust Commands

| Command | Returns |
|---|---|
| `validate_password(password)` | Strength score 0–4 |
| `calculate_level_score(hearts, max, attempts)` | Score % |
| `get_xp_for_level(level_id, score, base_xp)` | XP earned |
| `get_app_version()` | `"0.1.0"` |
=======
## 🦀 Rust Commands Available

| Command | Description |
|---------|-------------|
| `validate_password(password)` | Returns strength score 0-4 |
| `calculate_level_score(hearts, max, attempts)` | Returns % score |
| `get_xp_for_level(level_id, score, base_xp)` | Returns XP earned |
| `get_app_version()` | Returns app version string |

Call from React via:
```js
import { invoke } from '@tauri-apps/api/core';
const strength = await invoke('validate_password', { password: 'MyPass1!' });
```
>>>>>>> 0189a73c6eae47f41fc20cb0e28fb92172c6c37b

---

## 🎨 Tech Stack

<<<<<<< HEAD
Tauri 2 (Rust) · Firebase 10 (Auth + Firestore) · React 18 · Vite · Zustand · JetBrains Mono

MIT 🐰
=======
| Layer | Tech |
|-------|------|
| Desktop shell | Tauri 2 (Rust) |
| Memory safety | Rust ownership + borrow checker |
| Persistence | `tauri-plugin-store` (native JSON) |
| Frontend | React 18 + Vite |
| State management | Zustand (with persist middleware) |
| Animations | CSS keyframes + transitions |
| Font | JetBrains Mono |
| Icons | Emoji (no external deps) |

---

## 🗺️ Level System

- **Levels 1–50** per language
- **Every 5th level** = 📖 Recap (True/False questions)
- **Hearts**: 3 lives per attempt; losing all = score capped at 10%
- **Retry**: Wrong answer → 2s correction → let user retry (score -= 28% per miss)
- **Score improvement**: Retrying a failed level and completing it raises your saved score
- **XP**: Earned = `floor(levelBaseXP × score% / 100)`

---

## ⚙️ Customization

### Window size
Edit `src-tauri/tauri.conf.json`:
```json
"width": 420,
"height": 820
```

### Add a new language
1. Add entry to `LANGUAGES` array in `src/data/levels.js`
2. Add 10 questions to `QUESTIONS[langId]`
3. Add 10 recap questions to `RECAPS[langId]`

### Colors
All colors are CSS variables in `src/styles/globals.css` under `:root` (dark) and `[data-theme="light"]`.

---

## 📄 License

MIT — free to use, modify, and ship 🐰
>>>>>>> 0189a73c6eae47f41fc20cb0e28fb92172c6c37b
