# FitApp Feature Matrix & UI Blueprint

*This document catalogs all the highly-dynamic, data-driven features built into the FitApp Native ecosystem. It is structured to provide exact context for Figma AI to generate pixel-perfect, adaptive Light/Dark Mode UI components.*

---

## 1. Authentication & Onboarding
**State Management:** Zustand + Firebase Auth
*   **Sign Up / Log In:** Standard Email & Password authentication.
*   **Onboarding Flow:** Multi-step wizard collecting Age, Height, Weight, and Fitness Goals. (Data persists to a `users` Firestore collection).

---

## 2. The Dashboard (Home Hub)
**Theme:** "Neon Data Console"
*   **Dynamic Greeting:** Renders User Avatar and Name.
*   **Streak Widget:** Calculates and displays current daily login/activity streak with a Neon Flame icon.
*   **Interactive AI Coach Widget:** A prominent card displaying a generated motivational tip. Includes a "TAP TO CHAT ↗" action.
*   **Macro SVG Rings:** Circular data visualizations tracking active caloric intake vs. daily goal, and water consumption in Liters.

---

## 3. Gemini 2.5 AI Coach (Chatbot Modal)
**Engine:** Google Generative AI with Native Function Calling
*   **Conversational Interface:** Full-screen chat modal with AI and User chat bubbles.
*   **Actionable Intelligence:** Users can type natural language (e.g., "I walked 15km").
*   **Database Tool Execution:** The AI automatically detects the intent, extracts the data (Activity: Walk, Time: 150m), and seamlessly logs it directly to the user's Firestore Database in real-time.

---

## 4. Workout Planner & Library
**State Management:** React Query (TanStack)
*   **Weekly Date Strip:** Horizontal, scrollable calendar showing the current week. Tapping a day dynamically filters the UI.
*   **Scheduled Routines State:** If a workout is scheduled for the selected day, it renders an elevated card showing the Routine Title, Muscle Group, and total exercises.
*   **Rest Day State:** If no workout exists, it renders a minimalist card prompting the user to "+ ADD WORKOUT".

---

## 5. Active Workout Logger
**Engine:** Dynamic Route Parameters
*   **Data Grid:** A dense UI table containing rows for Sets, Reps, and Weight (lbs/kg).
*   **Circular Rest Timer:** A floating countdown timer with glowing active states.
*   **Completion Flow:** A heavy primary button that calculates the total volume and commits the completed routine to Firebase.

---

## 6. Nutrition & Meal Log
**Architecture:** Real-time array aggregation
*   **Meal Categories:** Distinct sections for Breakfast, Lunch, Dinner, and Snacks.
*   **Add Meal Modal:** A slide-up form capturing Food Name, Calories, Protein (g), Carbs (g), and Fats (g).
*   **Live Math:** Saving a meal instantly updates the Total Calories and macronutrient split across the entire app.

---

## 7. Progress & Transformation Hub
**Engine:** React Native Gifted Charts & Expo Image Picker
*   **Weight Trend Analytics:** A glowing line chart mapping historical weight data. Includes timeframe toggles (7D, 1M, 3M, YTD) and an automatic "+/- lbs" difference calculator badge.
*   **Transformation Grid:** A split view showing the "BEFORE" photo (first log) and "CURRENT" photo (latest log) pulled dynamically from Firebase Storage.
*   **Native Camera Integration:** A dedicated button triggering the device camera to take and upload new progress photos.
*   **Body Measurements Tracker:** A 2x2 grid displaying the latest Chest, Waist, Arms, and Legs circumferences, with an "UPDATE" modal for logging new inches.

---

## Up Next (Phase 4 Additions for Design Consideration)
*   **Community Leaderboard:** A ranking system displaying friends' streaks and total volume lifted.
*   **Barcode Scanner:** A camera overlay UI specifically engineered for scanning nutritional labels.
