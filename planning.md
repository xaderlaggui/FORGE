# FitApp — React Native Project Plan
> Expo + Firebase, full feature set

---

## Tech Stack

| Area | Choice | Notes |
|---|---|---|
| **Framework** | Expo SDK 51+ | Managed workflow, EAS Build for iOS & Android distribution |
| **Auth & Database** | Firebase | Auth, Firestore, Storage, Cloud Functions, Crashlytics |
| **Navigation** | Expo Router v3 | File-based routing, tab + stack layout, deep links |
| **State Management** | Zustand + React Query | Zustand for global UI state, React Query for server cache |
| **Styling** | NativeWind + Gluestack | Tailwind utility classes + accessible component library |
| **AI Coach** | Anthropic API | Via Firebase Cloud Functions — Claude Sonnet for plan suggestions |

---

## Screen Map

### Auth Stack
- 🔒 Login
- 👤 Sign up
- 🌐 Social login
- 🔄 Reset password

### Onboarding Stack
- 👤 Profile setup
- ⚖️ BMI setup
- 🎯 Goal selection
- 🏃 Fitness level

### Home Tab
- 🏠 Dashboard
- 🔥 Streak widget
- 💧 Water tracker
- 🤖 AI coach tip

### Workout Tab
- 📅 Weekly planner
- 🏋️ Exercise library
- ▶️ Active workout
- ⏱️ Rest timer

### Nutrition Tab
- 🍎 Food log
- 📊 Macro summary
- 📷 Barcode scan

### Progress Tab
- 📈 Weight chart
- 📸 Progress photos
- 📏 Body measurements
- ⚖️ BMI history

### Community Tab
- 🏆 Leaderboard
- 👥 Friends
- ⭐ Achievements

### Settings Tab
- 👤 Profile
- ⌚ Wearable sync
- 🔔 Notifications
- 🛡️ Privacy

---

## Folder Structure

```
fitapp/
 ├── app/                        # Expo Router — file = route
 │   ├── (auth)/                 # login, signup, reset
 │   ├── (onboarding)/           # profile, goals, BMI setup
 │   └── (tabs)/                 # home, workout, nutrition…
 ├── components/
 │   ├── ui/                     # Button, Card, Input…
 │   ├── charts/                 # WeightChart, MacroRing…
 │   └── workout/                # ExerciseCard, SetLogger…
 ├── hooks/                      # useStreak, useBMI, useWorkout…
 ├── stores/                     # Zustand stores
 ├── services/
 │   ├── firebase.ts             # init, auth, firestore
 │   ├── ai.ts                   # AI coach calls
 │   └── wearable.ts             # HealthKit / Health Connect
 ├── utils/                      # bmi.ts, streak.ts, nutrition.ts
 ├── types/                      # TypeScript interfaces
 └── functions/                  # Firebase Cloud Functions
```

---

## Firestore Data Model

### `users/{uid}`
| Field | Type |
|---|---|
| `uid` | `string` PK |
| `displayName`, `email` | `string` |
| `height`, `weight`, `age` | `number` |
| `bmi`, `bmiHistory[]` | `number / array` |
| `streak`, `lastActiveDate` | `number / timestamp` |
| `waterGoalMl` | `number` |
| `goals`, `fitnessLevel` | `string[]` |

### `users/{uid}/workouts/{id}`
| Field | Type |
|---|---|
| `id` | `string` PK |
| `date` | `timestamp` |
| `exercises[]` | `array` |
| `  exerciseId`, `name` | `string` |
| `  sets[{reps, weight}]` | `array` |
| `durationMin`, `calories` | `number` |
| `notes` | `string` |

### `exercises/{id}` *(global)*
| Field | Type |
|---|---|
| `name`, `category` | `string` |
| `muscleGroups[]` | `string[]` |
| `equipment`, `difficulty` | `string` |
| `instructions[]`, `videoUrl` | `string[]` |

### `users/{uid}/nutrition/{date}`
| Field | Type |
|---|---|
| `meals[]` | `array` |
| `  name`, `calories` | `string / number` |
| `  protein`, `carbs`, `fat` | `number` |
| `waterMl` | `number` |
| `totalCalories` | `number` |

---

## Key Libraries

### Navigation & UI
| Package | Purpose |
|---|---|
| `expo-router` | File-based navigation |
| `@gluestack-ui/themed` | Component library |
| `react-native-reanimated` | Animations |
| `react-native-gifted-charts` | Progress charts |

### Data & Backend
| Package | Purpose |
|---|---|
| `firebase` / `@react-native-firebase` | Auth, Firestore |
| `@tanstack/react-query` | Server state |
| `zustand` | Global UI state |
| `zod` | Schema validation |

### Device & Sensors
| Package | Purpose |
|---|---|
| `expo-camera` | Progress photos |
| `expo-barcode-scanner` | Food barcode scan |
| `react-native-health` | Apple HealthKit |
| `react-native-health-connect` | Android wearables |

### Notifications & Misc
| Package | Purpose |
|---|---|
| `expo-notifications` | Push & local alerts |
| `expo-haptics` | Streak & timer feedback |
| `@shopify/flash-list` | Performant lists |
| `dayjs` | Date handling |

---

## Build Phases

### Phase 1 — Foundation *(weeks 1–2)*
Expo project init, Firebase setup, Expo Router tabs, Auth screens (email + Google), onboarding flow, Firestore schema, user profile. CI with EAS Build.

**Tags:** `Auth` · `Onboarding` · `Firebase`

---

### Phase 2 — Core Fitness *(weeks 3–5)*
BMI calculator + history, exercise library (seed 100+ exercises), workout planner, active workout logger with rest timer, streak logic + notifications.

**Tags:** `BMI` · `Exercises` · `Planner` · `Streak`

---

### Phase 3 — Health Tracking *(weeks 6–8)*
Nutrition log + macro charts, water intake tracker, progress photos (camera + Firebase Storage), body measurements log, BMI trend charts.

**Tags:** `Nutrition` · `Photos` · `Measurements`

---

### Phase 4 — Advanced *(weeks 9–11)*
AI coach via Cloud Functions + Claude API, leaderboard with friend system, wearable sync (HealthKit & Health Connect), barcode scanning for food.

**Tags:** `AI coach` · `Leaderboard` · `Wearables`

---

### Phase 5 — Polish & Launch *(weeks 12–13)*
Animations, haptic feedback, offline support, App Store + Play Store submission via EAS Submit, Crashlytics, performance profiling.
