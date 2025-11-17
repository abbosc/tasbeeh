# Supabase Authentication Setup Guide

## Quick Setup Steps

### 1. Run the Database Schema

You've already added your Supabase credentials to the `.env` file. Now you need to set up the database:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: **zovfpaujeqgvsuobtrtx**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-schema.sql` from your project
6. Paste it into the SQL editor
7. Click **Run** (or press Ctrl+Enter)

You should see success messages for:
- ✅ Tables created (counters, sessions, daily_stats)
- ✅ Indexes created
- ✅ Row Level Security enabled
- ✅ RLS Policies created

### 2. Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Configure email settings:
   - **Enable Email Confirmations**: Toggle ON (recommended) or OFF for testing
   - **Secure Email Change**: Toggle ON (recommended)

### 3. (Optional) Configure Email Templates

1. Go to **Authentication** > **Email Templates**
2. Customize the confirmation email template if desired
3. You can use custom SMTP or the default Supabase email service

### 4. Test the Authentication

The app is now ready to test! Visit: **http://localhost:5175**

## Testing the App

### Testing Sign Up

1. You should see the login/registration screen
2. Click on **Sign Up** tab
3. Enter:
   - **Name**: Your name
   - **Email**: A valid email address
   - **Password**: At least 6 characters
4. Click **Create Account**
5. Check your email for verification link (if email confirmation is enabled)
6. If email confirmation is disabled, you'll be logged in immediately

### Testing Guest Mode

1. On the login screen, click **Continue as Guest**
2. You'll have full access to the app
3. Data is saved locally in your browser
4. No cloud sync, but fully functional

### Testing Sign In

1. After creating an account, you can sign out
2. Return to the app and click **Sign In**
3. Enter your email and password
4. Click **Sign In**

### Testing Data Sync

1. **Create a session** while logged in:
   - Tap the counter a few times
   - Set a goal
   - Complete the session
2. **Sign out** from Settings
3. **Sign in again** - your data should still be there!
4. Try on a different device/browser - data syncs across devices!

## Features Available

### ✅ Guest Mode
- Works without authentication
- Data saved in localStorage
- No registration required
- Perfect for quick use

### ✅ Authenticated Mode
- Email/password authentication
- Data synced to Supabase
- Access from any device
- Secure cloud storage

### ✅ User Interface
- Beautiful Islamic-themed login screen
- Easy toggle between Sign In/Sign Up
- Guest mode option
- Account info in Settings
- Sign out functionality

## Troubleshooting

### "Invalid login credentials"
- Make sure you're using the correct email and password
- If you just signed up, check if email confirmation is required
- Try resetting your password

### "User already registered"
- This email is already in use
- Try signing in instead of signing up
- Or use a different email

### Database Errors
- Make sure you ran the `supabase-schema.sql` script
- Check that RLS policies are created
- Verify your Supabase URL and anon key in `.env`

### Email Not Received
- Check spam folder
- Wait a few minutes (can take 5-10 minutes sometimes)
- For testing, you can disable email confirmation:
  - Go to Authentication > Providers > Email
  - Toggle OFF "Confirm Email"

## Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **Policies** ensure users can only see their own data
✅ **Password hashing** handled by Supabase
✅ **JWT tokens** for secure authentication
✅ **HTTPS** enforced by Supabase

## Next Steps

Once authentication is working:

1. ✅ Test creating counters (synced to Supabase)
2. ✅ Test completing sessions (synced to Supabase)
3. ✅ Test statistics tracking (synced to Supabase)
4. ✅ Test signing out and signing back in
5. ✅ Test on multiple devices (data syncs!)

## Database Structure

Your Supabase database has 3 main tables:

### `counters`
- Stores user's dhikr counters
- Linked to `user_id` (or null for guest mode)
- Syncs: name, color, icon

### `sessions`
- Stores completed counting sessions
- Linked to `counter_id`
- Syncs: count, goal, completion status, date

### `daily_stats`
- Aggregates daily dhikr counts
- Linked to `user_id`
- Syncs: total count per day

## API Endpoints Used

The app uses these Supabase features:

- `supabase.auth.signUp()` - Create new account
- `supabase.auth.signInWithPassword()` - Sign in
- `supabase.auth.signOut()` - Sign out
- `supabase.auth.onAuthStateChange()` - Listen for auth changes
- `supabase.from('counters')` - CRUD operations on counters
- `supabase.from('sessions')` - CRUD operations on sessions
- `supabase.from('daily_stats')` - CRUD operations on stats

---

**Your Tasbeeh app now has full authentication and cloud sync! 🎉**

May Allah accept this work. Ameen.
