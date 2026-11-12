export interface QuickSpec {
  label: string;
  val: string;
  sub: string;
  highlight?: boolean;
}

export interface MatrixRow {
  primary: string;
  sub: string;
  assay: string;
  mechanism: string;
  color?: 'cyan' | 'pure' | 'gold';
}

export interface AllocationProduct {
  id: string;
  name: string;
  sub: string;
  format: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  format: string;
  price: number;
  quantity: number;
  image?: string;
}
