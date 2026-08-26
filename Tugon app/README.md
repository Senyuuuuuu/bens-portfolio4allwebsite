# Tugon Service — React Native & Expo Mobile Application

A production-ready, cross-platform mobile application frontend for **Tugon Service** (On-Demand Home & Trade Services), built with **React Native**, **Expo (SDK 51)**, and **NativeWind (Tailwind CSS for React Native)**.

---

## 🎨 Design System & Color Palette

- **Primary Brand (Deep Trust-Blue)**: `#0A3D62` (Variants: `#072B46`, `#0E4F7D`, `#E0F2FE`)
- **Accent / Primary CTA (Vibrant Orange)**: `#F97316` (Variants: `#EA580C`, `#FB923C`, `#FFEDD5`)
- **Surfaces & Backgrounds**: Pure White (`#FFFFFF`), Cool Neutral Gray (`#F3F4F6`), Subtle Slate (`#F8FAFC`)
- **Typography Stack**: Clean Sans-Serif (Inter / System default) with calibrated weights (Bold, SemiBold, Medium, Regular)
- **Shapes & Elevation**: `rounded-2xl` (20px), `rounded-3xl` (28px), `rounded-4xl` (36px) with soft diffused drop shadows

---

## 📂 Project Architecture

```
Tugon app/
├── App.tsx                        # Root application entry with SafeAreaProvider
├── app.json                       # Expo configuration
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # NativeWind custom color & shadow design tokens
├── global.css                     # Tailwind CSS directives
├── babel.config.js                # NativeWind & Reanimated plugins
├── metro.config.js                # Metro bundler with NativeWind integration
├── tsconfig.json                  # TypeScript compiler settings
├── preview.html                   # Interactive browser phone simulator
│
└── src/
    ├── theme/
    │   └── colors.ts              # Exported color system
    ├── types/
    │   └── index.ts               # TypeScript interfaces & navigation types
    ├── data/
    │   └── mockData.ts            # Realistic, candid photographic mock dataset
    ├── components/
    │   ├── Header.tsx             # Location dropdown & notification badge
    │   ├── SearchBar.tsx          # Soft inner-shadow search input & filter trigger
    │   ├── CategoryFilter.tsx     # Horizontal scrollable category pill row
    │   ├── PromoBanner.tsx        # Wide aspect-ratio discount card with voucher code
    │   ├── ServiceCategoryCard.tsx# 2-column grid cards with pastel icon badges
    │   ├── StatCard.tsx           # Overlapping glassmorphism & soft-shadow stat boxes
    │   ├── ProviderCard.tsx       # Top-rated provider list cards with instant book CTA
    │   ├── ReviewCard.tsx         # Verified customer review cards with star ratings
    │   ├── TimeSlotPicker.tsx     # Period-based scheduling slot selector
    │   └── FloatingBottomNav.tsx  # Floating bottom bar with elevated orange circular CTA
    ├── screens/
    │   ├── HomeScreen.tsx         # Home Dashboard screen
    │   └── ProfileScreen.tsx      # Service Provider detail view with 4-tab switcher
    └── navigation/
        └── AppNavigator.tsx       # Native Stack Navigation
```

---

## 🚀 Quick Start & Running the App

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Launch Expo Development Server
```bash
npx expo start
```

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in Web Browser

### 3. Immediate Web Simulator Preview
You can directly open `preview.html` in any browser to interact with the full UI, toggle between Home and Profile views, test tabs, and select booking slots in a real-time mobile frame.
