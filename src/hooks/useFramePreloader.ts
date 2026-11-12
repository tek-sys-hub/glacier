import { useEffect, useRef, useState } from 'react';
import { TOTAL_FRAMES } from '../data/glacierData';

export function useFramePreloader() {
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload beginning frames (1-20) sequentially to guarantee zero initial jump,
  // plus milestone keyframes across the remaining 5 slides.
  const keyIndices = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    12, 15, 18, 20, 24, 30, 45, 60,
    75, 90, 105, 120
  ];

  useEffect(() => {
    let mounted = true;
    let count = 0;

    const getFramePath = (i: number) => `/assets/frames/frame_${String(i).padStart(4, '0')}.webp`;

    // 1. Load priority keyframes
    keyIndices.forEach((idx) => {
      const img = new Image();
      img.src = getFramePath(idx);
      img.onload = () => {
        if (!mounted) return;
        framesRef.current[idx - 1] = img;
        count++;
        setLoadedCount(count);

        // Frame 1 MUST be loaded and verified before isLoaded can trigger
        const frame1Ready = framesRef.current[0] && framesRef.current[0].complete && framesRef.current[0].naturalWidth > 0;
        if (frame1Ready && count >= 10) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        if (!mounted) return;
        count++;
        setLoadedCount(count);
        const frame1Ready = framesRef.current[0] && framesRef.current[0].complete && framesRef.current[0].naturalWidth > 0;
        if (frame1Ready && count >= 10) {
          setIsLoaded(true);
        }
      };
    });

    // 2. Stream all remaining frames asynchronously
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!framesRef.current[i - 1]) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          if (!mounted) return;
          framesRef.current[i - 1] = img;
        };
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  return {
    frames: framesRef.current,
    isLoaded,
    loadedCount,
    totalKeyframes: keyIndices.length
  };
}
