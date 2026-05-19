export const MascotImages = {
  coach_light: require('../assets/images/chatbot-light.png'),
  coach_dark: require('../assets/images/chatbot-dark.png'),
  hero: require('../assets/images/welcome.png'),
  nutrition: require('../assets/images/nutrition-removebg.png'),
  progress: require('../assets/images/progress-removebg.png'),
  welcome: require('../assets/images/welcome.png'),
  workout: require('../assets/images/workout-removebg.png'),
  app_icon: require('../assets/images/mascot/bear-4/bear-4-4.png'),
} as const;

export type MascotKey = keyof typeof MascotImages;
