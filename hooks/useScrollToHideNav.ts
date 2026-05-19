import { useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useUIStore } from '../stores/uiStore';

export function useScrollToHideNav() {
  const setTabBarVisible = useUIStore((s) => s.setTabBarVisible);
  const lastScrollY = useRef(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    
    // Always show at the very top (bounce effect on iOS can make it negative)
    if (currentY <= 10) {
      setTabBarVisible(true);
      lastScrollY.current = currentY;
      return;
    }

    const diff = currentY - lastScrollY.current;
    
    // Scrolling down (finger swiping up) -> Hide nav
    if (diff > 15) {
      setTabBarVisible(false);
      lastScrollY.current = currentY;
    } 
    // Scrolling up (finger swiping down) -> Show nav
    else if (diff < -15) {
      setTabBarVisible(true);
      lastScrollY.current = currentY;
    }
  };

  return { onScroll };
}
