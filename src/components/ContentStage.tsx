import React from 'react';
import { SlideHero } from './SlideHero';
import { SlideTable } from './SlideTable';
import { SlideAllocations } from './SlideAllocations';
import { ORIGIN_ROWS, COMPOSITION_ROWS, VESSEL_ROWS, TOTAL_SLIDES } from '../data/glacierData';
import { AllocationProduct } from '../types';

interface ContentStageProps {
  virtualProgress: number;
  onReserve: (product: AllocationProduct) => void;
}

export const ContentStage: React.FC<ContentStageProps> = ({ virtualProgress, onReserve }) => {
  const currentPos = virtualProgress * (TOTAL_SLIDES - 1);
  const trackY = -currentPos * 100;

  const getSlideState = (idx: number) => {
    const absDist = Math.abs(currentPos - idx);
    let opacity = 1.0;
    if (absDist > 0.25) {
      opacity = Math.max(0, 1.0 - (absDist - 0.25) / 0.75);
    }
    const isActive = absDist < 0.2;
    return { opacity, isActive };
  };

  const slide0 = getSlideState(0);
  const slide1 = getSlideState(1);
  const slide2 = getSlideState(2);
  const slide3 = getSlideState(3);
  const slide4 = getSlideState(4);

  return (
    <div className="in-place-content-stage">
      <div
        className="scroll-track"
        id="scroll-track"
        style={{
          transform: `translate3d(0, ${trackY.toFixed(2)}vh, 0)`
        }}
      >
        {/* Slide 0: Hero */}
        <SlideHero opacity={slide0.opacity} isActive={slide0.isActive} />

        {/* Slide 1: Source Origin */}
        <SlideTable
          id="slide-1"
          opacity={slide1.opacity}
          isActive={slide1.isActive}
          tag="01 / Geological Source"
          meta="Subterranean Aquifer"
          title="50,000-Year Glacial Source"
          text="Drawn under strict conservation quotas from subterranean aquifers pressurized beneath prehistoric ice shelves."
          colHeaders={['Hydro Parameter', 'Certified Assay', 'Geological Mechanism']}
          rows={ORIGIN_ROWS}
        />

        {/* Slide 2: Mineral Composition */}
        <SlideTable
          id="slide-2"
          opacity={slide2.opacity}
          isActive={slide2.isActive}
          tag="02 / Laboratory Assay"
          meta="Ion Matrix"
          title="Bio-Available Electrolytes"
          text="Naturally enriched through miles of subterranean volcanic basalt for cellular hydration and systemic conductivity."
          colHeaders={['Bio-Active Element', 'Concentration', 'Physiological Role']}
          rows={COMPOSITION_ROWS}
        />

        {/* Slide 3: The Vessel */}
        <SlideTable
          id="slide-3"
          opacity={slide3.opacity}
          isActive={slide3.isActive}
          tag="03 / Vessel Architecture"
          meta="Nordic Glass"
          title="Artisanal Flint Glass"
          text="Engineered from heavy Nordic flint glass to preserve sub-zero freshness without chemical leaching or micro-fissuring."
          colHeaders={['Vessel Specification', 'Material Matrix', 'Purity Guarantee']}
          rows={VESSEL_ROWS}
        />

        {/* Slide 4: Cellar Allocations */}
        <SlideAllocations
          opacity={slide4.opacity}
          isActive={slide4.isActive}
          onReserve={onReserve}
        />
      </div>
    </div>
  );
};

