import React from 'react';
import { HERO_SPECS } from '../data/glacierData';

interface SlideHeroProps {
  opacity: number;
  isActive: boolean;
}

export const SlideHero: React.FC<SlideHeroProps> = ({ opacity, isActive }) => {
  return (
    <div
      id="slide-0"
      className={`content-slide ${isActive ? 'active' : ''}`}
      style={{
        opacity,
        pointerEvents: opacity > 0.4 ? 'auto' : 'none'
      }}
    >
      <div className="slide-inner">
        <span className="slide-eyebrow">Pre-Industrial Glacial Water</span>
        <h1 className="slide-hero-title">GLACIER</h1>
        <p className="slide-caption">
          Subterranean ice melt filtered through 50,000 years of prehistoric basalt. Captured at natural sub-zero purity.
        </p>

        {/* Editorial Hairline Spec Strip (No Card Boxes, No Shadows) */}
        <div className="hero-quick-tabulate">
          {HERO_SPECS.map((spec) => (
            <div key={spec.label} className="tab-col">
              <span className="tab-label">{spec.label}</span>
              <span className={`tab-val ${spec.highlight ? 'highlight-val' : ''}`}>
                {spec.val}
              </span>
              <span className="tab-sub">{spec.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

