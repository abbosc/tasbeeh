// Points system for gamification
export const POINTS = {
  PER_COUNT: 1,
  MILESTONE_33: 33,
  MILESTONE_66: 66,
  MILESTONE_99: 99,
  GOAL_COMPLETED: 100,
  STREAK_BONUS: 50, // Daily streak bonus
}

export const LEVELS = [
  { level: 1, title: 'Beginner', minPoints: 0, icon: '🌱' },
  { level: 2, title: 'Learner', minPoints: 100, icon: '🌿' },
  { level: 3, title: 'Devoted', minPoints: 500, icon: '🍃' },
  { level: 4, title: 'Dedicated', minPoints: 1000, icon: '🌳' },
  { level: 5, title: 'Committed', minPoints: 2500, icon: '🌲' },
  { level: 6, title: 'Master', minPoints: 5000, icon: '⭐' },
  { level: 7, title: 'Expert', minPoints: 10000, icon: '✨' },
  { level: 8, title: 'Champion', minPoints: 25000, icon: '🏆' },
  { level: 9, title: 'Legend', minPoints: 50000, icon: '👑' },
  { level: 10, title: 'Enlightened', minPoints: 100000, icon: '💫' },
]

export const ACHIEVEMENTS = [
  {
    id: 'first_count',
    title: 'First Step',
    description: 'Complete your first count',
    points: 10,
    icon: '🎯',
  },
  {
    id: 'first_goal',
    title: 'Goal Setter',
    description: 'Complete your first goal',
    points: 50,
    icon: '🎪',
  },
  {
    id: 'milestone_33',
    title: 'SubhanAllah Master',
    description: 'Reach 33 counts in a session',
    points: 33,
    icon: '🌟',
  },
  {
    id: 'milestone_99',
    title: 'Dedicated Devotee',
    description: 'Reach 99 counts in a session',
    points: 99,
    icon: '💎',
  },
  {
    id: 'week_streak',
    title: 'Weekly Warrior',
    description: 'Count for 7 consecutive days',
    points: 200,
    icon: '🔥',
  },
  {
    id: 'month_streak',
    title: 'Monthly Master',
    description: 'Count for 30 consecutive days',
    points: 1000,
    icon: '🎆',
  },
  {
    id: 'total_1000',
    title: 'Thousand Strong',
    description: 'Reach 1000 total counts',
    points: 100,
    icon: '💪',
  },
  {
    id: 'total_10000',
    title: 'Ten Thousand',
    description: 'Reach 10,000 total counts',
    points: 500,
    icon: '🌈',
  },
]

export const calculateLevel = (points: number) => {
  let currentLevel = LEVELS[0]

  for (const level of LEVELS) {
    if (points >= level.minPoints) {
      currentLevel = level
    } else {
      break
    }
  }

  return currentLevel
}

export const getNextLevel = (points: number) => {
  const currentLevel = calculateLevel(points)
  const currentIndex = LEVELS.findIndex(l => l.level === currentLevel.level)

  if (currentIndex < LEVELS.length - 1) {
    return LEVELS[currentIndex + 1]
  }

  return null
}

export const getProgressToNextLevel = (points: number) => {
  const currentLevel = calculateLevel(points)
  const nextLevel = getNextLevel(points)

  if (!nextLevel) return 100

  const pointsIntoLevel = points - currentLevel.minPoints
  const pointsNeeded = nextLevel.minPoints - currentLevel.minPoints

  return (pointsIntoLevel / pointsNeeded) * 100
}

export const calculatePoints = (
  count: number,
  goalCompleted: boolean,
  previousHighCount: number
): number => {
  let points = count * POINTS.PER_COUNT

  // Milestone bonuses
  if (count >= 33 && previousHighCount < 33) points += POINTS.MILESTONE_33
  if (count >= 66 && previousHighCount < 66) points += POINTS.MILESTONE_66
  if (count >= 99 && previousHighCount < 99) points += POINTS.MILESTONE_99

  // Goal completion bonus
  if (goalCompleted) points += POINTS.GOAL_COMPLETED

  return points
}
