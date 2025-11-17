# 🚀 Quick Setup Instructions

Get your Tasbeeh app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- A code editor (VS Code recommended)
- Terminal/Command Prompt

## Setup Steps

### 1. Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (React, Vite, Tailwind, Supabase, etc.)

### 2. Configure Environment Variables

You have two options:

#### Option A: Run Without Supabase (Offline Mode - Recommended for Testing)

The app works perfectly with just localStorage! Simply run:

```bash
npm run dev
```

All your data will be stored locally in your browser.

#### Option B: Use Supabase (For Cloud Sync)

1. Create a `.env` file in the project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://zovfpaujeqgvsuobtrtx.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**To get your Supabase credentials:**
1. Go to your Supabase project: https://zovfpaujeqgvsuobtrtx.supabase.co
2. Click Settings → API
3. Copy the "Project URL" and "anon public" key

### 3. Set Up Database (If Using Supabase)

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Copy the contents of `supabase-schema.sql`
4. Paste and run it in the SQL editor

### 4. Start Development Server

```bash
npm run dev
```

The app will open at: `http://localhost:5173`

## Testing the App

1. **Tap the counter** - The big circular button to count
2. **Set a goal** - Click "Set Goal" and choose 33, 99, or custom
3. **Switch counters** - Tap the tabs at the top to switch between different dhikr
4. **View stats** - Click "Statistics" to see your progress
5. **Customize** - Click the settings icon to add custom counters

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Common Issues & Solutions

### Issue: "npm: command not found"

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Port 5173 already in use

**Solution**:
```bash
# Kill the process using the port or use a different port
npm run dev -- --port 3000
```

### Issue: White screen / Build errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Supabase credentials not found"

**Solution**: This is just a warning. The app works fine without Supabase using localStorage. If you want to use Supabase, add the credentials to `.env` file.

## Project Structure

```
tasbeeh-app/
├── src/
│   ├── components/        # React components
│   │   ├── Counter.tsx    # Main counter component
│   │   ├── CounterTabs.tsx
│   │   ├── Statistics.tsx
│   │   └── ...
│   ├── context/          # React context (app state)
│   ├── lib/              # Utilities (Supabase, localStorage, sounds)
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── supabase-schema.sql  # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features to Test

- ✅ Counter increments on tap
- ✅ Sound effects (click the volume icon to toggle)
- ✅ Haptic feedback on mobile devices
- ✅ Set goals (33, 66, 99, 100, custom)
- ✅ Progress tracking with visual ring
- ✅ Complete sessions and save to history
- ✅ View statistics and charts
- ✅ Add custom counters
- ✅ Switch between different dhikr
- ✅ Works offline

## Next Steps

1. ✅ Test the app locally
2. 📚 Read the `README.md` for full documentation
3. 🚀 Check `DEPLOYMENT_GUIDE.md` to deploy to Vercel
4. 🎨 Customize colors in `tailwind.config.js`
5. 🌙 Add more Islamic features!

## Need Help?

- Check the browser console (F12) for errors
- Read the full `README.md` for detailed information
- See `DEPLOYMENT_GUIDE.md` for deployment issues

---

**May Allah make this app a means of continuous dhikr and reward! 🤲**

*"Remember Me, I will remember you." (Quran 2:152)*
