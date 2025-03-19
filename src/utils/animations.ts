
import { useEffect, useState } from 'react';

/**
 * Custom hook to apply entrance animations to elements
 * @param delay - Delay before animation starts (ms)
 */
export const useEntrance = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  };
};

/**
 * Custom hook to stagger animations for lists of items
 * @param itemCount - Number of items to animate
 * @param baseDelay - Base delay before starting animations (ms)
 * @param staggerDelay - Delay between each item's animation (ms)
 */
export const useStaggeredEntrance = (
  itemCount: number,
  baseDelay = 100,
  staggerDelay = 50
) => {
  return (index: number) => useEntrance(baseDelay + index * staggerDelay);
};

/**
 * Creates a sequence of fading elements
 * @param duration - Animation duration in ms
 */
export const useFadeSequence = (duration = 300) => {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration / 1000 } // convert to seconds
  };
};
