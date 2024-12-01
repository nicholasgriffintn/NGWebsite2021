export const COLORS = [
  // Grayscale
  '#030712', // Black
  '#4b5563', // Gray
  '#f9fafb', // White
  // Primary colors
  '#ef4444', // Red
  '#f59e0b', // Orange
  '#fbbf24', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  // Pastel colors
  '#fecaca', // Light Red
  '#fed7aa', // Light Orange
  '#fef08a', // Light Yellow
  '#bbf7d0', // Light Green
  '#bfdbfe', // Light Blue
  '#c7d2fe', // Light Indigo
  '#e9d5ff', // Light Purple
  // Additional colors
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#8b5cf6', // Violet
];

export const LINE_WIDTHS = [2, 4, 6, 8, 12, 16];

export const GAME_WORDS = [
  // Food & Drinks
  'grape',
  'coconut',
  'strawberry',
  'pineapple',
  'watermelon',
  'orange',
  'noodles',
  'rice',
  'hamburger',
  'soup',
  'ketchup',
  'waffles',
  'lemon',
  'cupcake',
  'crust',

  // Animals & Nature
  'dolphin',
  'eagle',
  'frog',
  'giraffe',
  'koala',
  'lion',
  'meerkat',
  'panda',
  'platypus',
  'salamander',
  'scorpion',
  't-rex',
  'tiger',
  'wasp',
  'beehive',
  'rainbow',
  'summer',
  'fog',

  // Places & Structures
  'cinema',
  'hospital',
  'factory',
  'school',
  'supermarket',
  'bathroom',
  'library',
  'bedroom',
  'airport',
  'restaurant',
  'igloo',

  // Transportation
  'aircraft',
  'train',
  'ferry',
  'bicycle',
  'bus',
  'car',
  'helicopter',
  'motorcycle',
  'taxi',
  'truck',
  'lawnmower',

  // Actions & Activities
  'quarrel',
  'fight',
  'embrace',
  'smoking',
  'walk',
  'dancing',
  'fitness',
  'drink',
  'sing',
  'boxing',

  // Objects & Items
  'chandelier',
  'toothpaste',
  'boardgame',
  'wreath',
  'whistle',
  'headphones',
  'whisk',
  'battery',

  // Natural Phenomena & Effects
  'eclipse',
  'fireworks',
  'snowball',
  'bruise',

  // Miscellaneous
  'bubble',
  'bouquet',

  // Events & Activities
  'olympics',
  'applause',
  'recycle',

  // Time & Concepts
  'monday',
  'century',

  // Nature & Weather
  'black hole',
  'blizzard',
  'sunburn',
  'swamp',
  'sandcastle',

  // Places & Landmarks
  'atlantis',

  // Objects & Items
  'dictionary',
  'lace',
  'sunscreen',
  'vanilla',
];

export const GAME_DURATION = 120; // 2 minutes in seconds

// Optional: Add difficulty ratings
export const WORD_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const WORD_DIFFICULTY_MAP: Record<
  string,
  (typeof WORD_DIFFICULTIES)[keyof typeof WORD_DIFFICULTIES]
> = {
  // Add your word difficulty mappings here
};