# 📿 Tasbeeh - Digital Islamic Counter

A beautiful, modern web application for tracking your dhikr (Islamic remembrance) with an elegant Islamic-inspired design.

## ✨ Features

- **Multiple Counters**: Create and manage multiple counters for different types of dhikr (سبحان الله, الحمد لله, الله أكبر, etc.)
- **Goal Setting**: Set custom goals (33, 66, 99, 100, or any custom number) with visual progress tracking
- **Statistics Dashboard**: View your daily, weekly, and total dhikr counts with beautiful charts
- **History Tracking**: Keep track of all your completed sessions
- **Sound & Haptic Feedback**: Get audio and vibration feedback on every count
- **Offline Support**: Works offline with localStorage fallback
- **Responsive Design**: Beautiful on all devices - mobile, tablet, and desktop
- **Islamic Design**: Gorgeous Islamic geometric patterns, Arabic typography, and traditional color schemes

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom Islamic color palette
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend**: Supabase (optional - works offline without it)
- **Deployment**: Vercel

## 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "tasbeeh app"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://zovfpaujeqgvsuobtrtx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note**: The app works perfectly fine without Supabase using localStorage. Supabase is optional for syncing data across devices.

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🗄️ Supabase Setup (Optional)

If you want to use Supabase for data persistence and sync:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` and run it
4. Get your project URL and anon key from Project Settings > API
5. Update the `.env` file with your credentials

## 🚀 Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Option 3: Deploy Button

Click the button below to deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## 🎨 Customization

### Adding New Counters

Users can add custom counters directly from the Settings menu in the app. Each counter can have:
- Custom name (in any language, including Arabic)
- Icon (Leaf, Heart, Star, Sparkles)
- Color theme (Green, Teal, Gold)

### Modifying Colors

The Islamic color palette can be customized in `tailwind.config.js`:

```javascript
colors: {
  islamic: {
    gold: { /* your gold shades */ },
    green: { /* your green shades */ },
    teal: { /* your teal shades */ },
  }
}
```

## 📱 Usage

1. **Select a Counter**: Tap on one of the counter tabs at the top
2. **Start Counting**: Tap the large circular button to increment
3. **Set a Goal**: Click "Set Goal" to choose a target count
4. **View Progress**: Your progress ring will fill up as you count
5. **Complete Session**: Click "Complete" to save your session to history
6. **View Statistics**: Switch to the Statistics tab to see your progress over time

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🌟 Features in Detail

### Sound Feedback
- Click sound on every count
- Milestone sounds at 33, 66, and 99
- Success celebration when goal is reached

### Haptic Feedback
- Light vibration on every count
- Stronger vibration at milestones
- Success vibration pattern on goal completion

### Offline Support
All data is stored locally in the browser's localStorage, so the app works perfectly without an internet connection. If you connect Supabase, data will sync across devices.

## 🤲 Islamic Design Elements

- Traditional Islamic color palette (greens, golds, ivory)
- Arabic typography using Amiri font
- Geometric patterns inspired by Islamic art
- Ornate borders and decorative elements
- Respectful and beautiful presentation

## 📄 License

This project is open source and available for the Muslim community to use freely.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 💝 Made with Love

Built with ♥ for the Muslim Ummah

May Allah accept our dhikr and make it easy for us to remember Him. Ameen.

---

**Remember**: "Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured." (Quran 13:28)
