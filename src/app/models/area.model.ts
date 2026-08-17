export type DeductionType = 'door' | 'window' | 'cutout';

export interface Deduction {
  id: string;
  name: string;
  width: number;
  length: number;
  x: number;
  y: number;
  type: DeductionType;
}

export interface AreaState {
  width: number;
  length: number;
  deductions: Deduction[];
  wasteMargin: number;
}
