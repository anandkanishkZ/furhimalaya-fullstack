import { useEffect, useRef } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function useScrollReveal({
  threshold = 0.1,
  rootMargin = '0px',
  delay = 0,
  direction = 'up'
}: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Add initial styles
    element.style.opacity = '0';
    element.style.transition = 'all 0.6s ease-out';

    switch (direction) {
      case 'up':
        element.style.transform = 'translateY(30px)';
        break;
      case 'down':
        element.style.transform = 'translateY(-30px)';
        break;
      case 'left':
        element.style.transform = 'translateX(30px)';
        break;
      case 'right':
        element.style.transform = 'translateX(-30px)';
        break;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0)';
          }, delay);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, delay, direction]);

  return ref;
}