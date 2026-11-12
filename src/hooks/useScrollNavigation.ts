import { useState, useEffect, useRef, useCallback } from 'react';
import { TOTAL_SLIDES } from '../data/glacierData';

export function useScrollNavigation() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [virtualProgress, setVirtualProgress] = useState(0.0);
  const targetProgressRef = useRef(0.0);
  const virtualProgressRef = useRef(0.0);
  const isLockedRef = useRef(false);

  // Initialize from URL parameter (?p=0.0..1.0) if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pParam = parseFloat(params.get('p') || '');
    if (!isNaN(pParam)) {
      const clamped = Math.max(0, Math.min(1, pParam));
      targetProgressRef.current = clamped;
      virtualProgressRef.current = clamped;
      const slide = Math.round(clamped * (TOTAL_SLIDES - 1));
      setCurrentSlideIndex(slide);
      setVirtualProgress(clamped);
    }
  }, []);

  const goToSlide = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
    setCurrentSlideIndex(clamped);
    targetProgressRef.current = clamped / (TOTAL_SLIDES - 1);
  }, []);

  // Responsive, fluid wheel listener with accumulated intent
  useEffect(() => {
    let accumulatedDelta = 0;
    let resetTimer: number | undefined;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 33;
      if (e.deltaMode === 2) delta *= 600;

      if (isLockedRef.current) return;

      accumulatedDelta += delta;

      // Intent threshold: 35px delta triggers slide transition cleanly
      if (Math.abs(accumulatedDelta) >= 35) {
        isLockedRef.current = true;
        const direction = accumulatedDelta > 0 ? 1 : -1;
        accumulatedDelta = 0;

        setCurrentSlideIndex((prev) => {
          const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, prev + direction));
          targetProgressRef.current = next / (TOTAL_SLIDES - 1);
          return next;
        });

        setTimeout(() => {
          isLockedRef.current = false;
        }, 450);
      }

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        accumulatedDelta = 0;
      }, 180);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.clearTimeout(resetTimer);
    };
  }, []);

  // Touch swipe listener
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches && e.changedTouches[0] && !isLockedRef.current) {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        if (Math.abs(diffY) >= 30) {
          isLockedRef.current = true;
          const direction = diffY > 0 ? 1 : -1;
          setCurrentSlideIndex((prev) => {
            const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, prev + direction));
            targetProgressRef.current = next / (TOTAL_SLIDES - 1);
            return next;
          });

          setTimeout(() => {
            isLockedRef.current = false;
          }, 450);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToSlide(currentSlideIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(currentSlideIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, goToSlide]);

  // Main 60 FPS tick loop with calm monotonic linear lerp (ZERO spring bounce)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const pDelta = targetProgressRef.current - virtualProgressRef.current;
      if (Math.abs(pDelta) > 0.0001) {
        virtualProgressRef.current += pDelta * 0.085;
        setVirtualProgress(virtualProgressRef.current);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return {
    currentSlideIndex,
    virtualProgress,
    goToSlide
  };
}
