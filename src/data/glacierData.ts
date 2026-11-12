import { QuickSpec, MatrixRow, AllocationProduct } from '../types';

export const HERO_SPECS: QuickSpec[] = [
  { label: 'Origin Coordinates', val: '64.12° N', sub: 'Sub-glacial aquifer' },
  { label: 'Catchment Elevation', val: '1,450 m', sub: 'Ice shelf catchment' },
  { label: 'Alkaline pH', val: '7.85 pH', sub: 'Basalt equilibrium', highlight: true },
  { label: 'Isotopic Purity', val: '99.998%', sub: 'Zero microplastics', highlight: true }
];

export const ORIGIN_ROWS: MatrixRow[] = [
  {
    primary: 'Alkaline Equilibrium',
    sub: 'Subterranean pressure balance',
    assay: '7.85 pH',
    mechanism: 'Natural basalt ion exchange',
    color: 'cyan'
  },
  {
    primary: 'Total Dissolved Solids',
    sub: 'Featherweight mineral matrix',
    assay: '112 mg/L',
    mechanism: 'Velvet palatal texture'
  },
  {
    primary: 'Capture Temperature',
    sub: 'Sub-zero borehole extraction',
    assay: '1.4°C',
    mechanism: 'Shielded from atmospheric warmth'
  },
  {
    primary: 'Anthropogenic Purity',
    sub: 'Nitrates, nitrites & microplastics',
    assay: '0.000 Undetected',
    mechanism: 'Pre-industrial late Pleistocene origin',
    color: 'pure'
  }
];

export const COMPOSITION_ROWS: MatrixRow[] = [
  {
    primary: 'Bio-Active Silica (SiO₂)',
    sub: 'Volcanic quartz dissolution',
    assay: '42.4 mg/L',
    mechanism: 'Collagen synthesis & cellular resilience',
    color: 'cyan'
  },
  {
    primary: 'Calcium (Ca²⁺)',
    sub: 'Prehistoric calcite dissolution',
    assay: '18.2 mg/L',
    mechanism: 'Neuro-muscular conductivity'
  },
  {
    primary: 'Magnesium (Mg²⁺)',
    sub: 'Dolomite strata filtration',
    assay: '8.6 mg/L (2:1)',
    mechanism: 'Cardiovascular electrolyte balance',
    color: 'gold'
  },
  {
    primary: 'Bicarbonates (HCO₃⁻)',
    sub: 'Natural metabolic buffer',
    assay: '68.0 mg/L',
    mechanism: 'Maintains systemic alkalinity'
  }
];

export const VESSEL_ROWS: MatrixRow[] = [
  {
    primary: 'Vessel Architecture',
    sub: 'Cold-press flint glass mold',
    assay: 'Nordic Flint Glass',
    mechanism: '100% Infinitely recyclable • Chemically inert'
  },
  {
    primary: 'Hermetic Seal',
    sub: 'Precision-machined crown closure',
    assay: 'Aerospace Aluminum',
    mechanism: 'Hermetic airtight sub-zero lock'
  },
  {
    primary: 'Chemical Leaching Assays',
    sub: 'Endocrine disrupter testing',
    assay: '0.0 ppm Antimony/BPA',
    mechanism: 'Certified food contact safety standard',
    color: 'pure'
  },
  {
    primary: 'Optical Faceting',
    sub: 'Glacial crevasse refractive cuts',
    assay: 'Ice-Prism Cut',
    mechanism: 'Shields dissolved minerals from UV decay',
    color: 'cyan'
  }
];

export const ALLOCATION_PRODUCTS: AllocationProduct[] = [
  {
    id: 'glacier-still',
    name: 'Glacier Still Reserve',
    sub: 'Natural artesian capture',
    format: '6 × 750ml Flint',
    price: 48,
    image: '/assets/frames/frame_0060.webp'
  },
  {
    id: 'glacier-sparkling',
    name: 'Glacier Effervescent',
    sub: 'Micro-carbonated fine bead',
    format: '6 × 750ml Carbonated',
    price: 56,
    image: '/assets/frames/frame_0120.webp'
  },
  {
    id: 'glacier-suite',
    name: 'The Tasting Suite',
    sub: '12 Btls + 2 Mouthblown Tumblers',
    format: 'Cellar Edition',
    price: 120,
    image: '/assets/frames/frame_0090.webp'
  }
];

export const TOTAL_SLIDES = 5;
export const TOTAL_FRAMES = 120;
