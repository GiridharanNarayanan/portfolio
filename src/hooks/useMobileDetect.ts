import { useState, useEffect, useCallback } from 'react';

/** Breakpoint for mobile detection (matches Tailwind's sm breakpoint) */
const MOBILE_BREAKPOINT = 640;

interface UseMobileDetectResult {
  isMobile: boolean;
  isTouch: boolean;
  width: number;
  height: number;
}

/**
 * Hook for detecting mobile/touch devices
 * 
 * Uses viewport width and touch capability detection
 */
export function useMobileDetect(): UseMobileDetectResult {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // Initial check
    handleResize();

    // Update touch capability (in case of hybrid devices)
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const isMobile = dimensions.width < MOBILE_BREAKPOINT;

  return {
    isMobile,
    isTouch,
    width: dimensions.width,
    height: dimensions.height,
  };
}

export default useMobileDetect;
