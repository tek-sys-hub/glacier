import React, { useState, useEffect, useRef } from 'react';
import '../styles/preloader.css';

interface WaterDropPreloaderProps {
  isLoaded: boolean;
  loadedCount: number;
  totalKeyframes: number;
  onComplete: () => void;
}

export const WaterDropPreloader: React.FC<WaterDropPreloaderProps> = ({
  isLoaded,
  loadedCount,
  totalKeyframes,
  onComplete
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isBloom, setIsBloom] = useState(false);

  const currentProgressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    let animId: number;
    const MIN_DURATION = 2200; // 2.2s minimum smooth presentation

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const timeRatio = Math.min(1.0, elapsed / MIN_DURATION);
      const loadRatio = totalKeyframes > 0 ? Math.min(1.0, loadedCount / totalKeyframes) : 0;

      let target = Math.min(96, Math.max(timeRatio * 90, loadRatio * 85));

      // Once assets are ready and minimum time has elapsed, glide to 100%
      if (isLoaded && timeRatio >= 1.0) {
        target = 100;
      }

      const delta = target - currentProgressRef.current;
      if (delta > 0.01) {
        currentProgressRef.current += delta * 0.12;
      }

      if (currentProgressRef.current >= 99.6 && target === 100) {
        currentProgressRef.current = 100;
        setDisplayProgress(100);

        if (!completedRef.current) {
          completedRef.current = true;
          setIsBloom(true);

          setTimeout(() => {
            setIsFading(true);
          }, 450);

          setTimeout(() => {
            onComplete();
          }, 1300);
        }
        return;
      }

      setDisplayProgress(Math.min(100, Math.round(currentProgressRef.current)));
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isLoaded, loadedCount, totalKeyframes, onComplete]);

  // Teardrop viewBox 0 0 100 135: Apex at 12, bottom at 126
  const waterY = 126 - (displayProgress / 100) * 114;

  const getStatusText = (pct: number) => {
    if (pct < 30) return 'Extracting 50,000-Year Sub-Glacial Melt';
    if (pct < 65) return 'Filtering Through Prehistoric Basalt Strata';
    if (pct < 88) return 'Calibrating Alkaline Equilibrium (7.85 pH)';
    if (pct < 100) return 'Pressurizing Nordic Flint Vessel';
    return 'Purity Assured • 99.998% Isotopic Matrix';
  };

  return (
    <div
      className={`preloader-overlay ${isFading ? 'fade-out' : ''}`}
      aria-label="Loading Glacier Mineral Water Experience"
    >
      <div className="preloader-ambient-glow" aria-hidden="true" />

      <div className="preloader-content">
        {/* Brand Meta Top */}
        <div className="preloader-brand-strip">
          <span className="preloader-brand-title">GLACIER</span>
          <span className="preloader-brand-meta">
            Sub-Glacial Aquifer • 64.12° N
          </span>
        </div>

        {/* The Sculpted Water Drop */}
        <div className={`droplet-wrapper ${isBloom ? 'bloom' : ''}`}>
          <svg
            className="droplet-svg"
            viewBox="0 0 100 135"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Droplet Clipping Silhouette */}
              <clipPath id="dropClip">
                <path d="M 50,12 C 50,12 18,72 18,94 A 32,32 0 0,0 82,94 C 82,72 50,12 50,12 Z" />
              </clipPath>

              {/* Front Wave Gradient (Deep Glacial Azure) */}
              <linearGradient id="frontWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.98" />
              </linearGradient>

              {/* Back Wave Gradient (Luminous Glacial Cyan) */}
              <linearGradient id="backWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Droplet Background Glass Container */}
            <path
              d="M 50,12 C 50,12 18,72 18,94 A 32,32 0 0,0 82,94 C 82,72 50,12 50,12 Z"
              fill="#f8fafc"
              stroke="rgba(2, 132, 199, 0.35)"
              strokeWidth="1.5"
            />

            {/* Water Fill (Inside Droplet Clip) */}
            <g clipPath="url(#dropClip)">
              {/* Rising Liquid Waves */}
              <g transform={`translate(0, ${waterY.toFixed(2)})`}>
                {/* Back Liquid Wave */}
                <path
                  className="droplet-wave-back"
                  d="M -100,0 Q -75,-3.5 -50,0 T 0,0 T 50,0 T 100,0 T 150,0 T 200,0 V 140 H -100 Z"
                />
                {/* Front Liquid Wave */}
                <path
                  className="droplet-wave-front"
                  d="M -120,0 Q -90,4 -60,0 T 0,0 T 60,0 T 120,0 T 180,0 T 240,0 V 140 H -120 Z"
                />
              </g>

              {/* Rising Effervescent Micro-Bubbles */}
              {displayProgress > 15 && (
                <g style={{ opacity: Math.min(1, (displayProgress - 15) / 30) }}>
                  <circle className="effervescence-bubble b-1" cx="44" cy="112" r="1.5" />
                  <circle className="effervescence-bubble b-2" cx="56" cy="118" r="1.8" />
                  <circle className="effervescence-bubble b-3" cx="50" cy="108" r="1.2" />
                </g>
              )}
            </g>

            {/* Nordic Flint Glass Reflections & Caustics */}
            <path
              d="M 32,58 C 26,72 26,88 32,98"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />
            <path
              d="M 46,24 C 42,34 38,44 36,54"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />
            <path
              d="M 68,78 C 72,86 70,96 66,102"
              stroke="rgba(255, 255, 255, 0.20)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />
            <circle
              cx="48"
              cy="20"
              r="1.6"
              fill="rgba(255, 255, 255, 0.75)"
              pointerEvents="none"
            />
            <ellipse
              cx="50"
              cy="121"
              rx="15"
              ry="2.5"
              fill="rgba(255, 255, 255, 0.15)"
              pointerEvents="none"
            />
          </svg>
        </div>

        {/* Tabular Progress Counter & Status */}
        <div className="preloader-metrics">
          <div className="preloader-counter">
            {displayProgress}
            <span className="preloader-counter-pct">%</span>
          </div>

          <div
            className={`preloader-status ${
              displayProgress === 100 ? 'verified' : ''
            }`}
          >
            {getStatusText(displayProgress)}
          </div>

          <div className="preloader-hairline-track">
            <div
              className="preloader-hairline-fill"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
