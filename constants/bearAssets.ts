export const BEAR = {
  // Positive / Motivational
  CONFIDENT:       require('../assets/images/mascot/bear-1/bear-1-1.png'),
  APPROVING:       require('../assets/images/mascot/bear-1/bear-1-2.png'),
  HYPED:           require('../assets/images/mascot/bear-1/bear-1-3.png'),
  READY:           require('../assets/images/mascot/bear-1/bear-1-4.png'),

  // Action / In-Motion
  FLEXING:         require('../assets/images/mascot/bear-2/bear-2-1.png'),
  LIFTING:         require('../assets/images/mascot/bear-2/bear-2-2.png'),
  RUNNING:         require('../assets/images/mascot/bear-2/bear-2-4.png'),

  // Reactive / Emotional
  SHOCKED:         require('../assets/images/mascot/bear-3/bear-3-1.png'),
  THINKING:        require('../assets/images/mascot/bear-3/bear-3-2.png'),
  LAUGHING:        require('../assets/images/mascot/bear-3/bear-3-3.png'),
  STERN:           require('../assets/images/mascot/bear-3/bear-3-4.png'),

  // Social / Interactive
  POINTING:        require('../assets/images/mascot/bear-4/bear-4-1.png'),
  HIGH_FIVE:       require('../assets/images/mascot/bear-4/bear-4-2.png'),
  SMUG:            require('../assets/images/mascot/bear-4/bear-4-3.png'),
  PROUD:           require('../assets/images/mascot/bear-4/bear-4-4.png'),
} as const;

export type BearKey = keyof typeof BEAR;
