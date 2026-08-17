import { Injectable, signal, computed, effect } from '@angular/core';
import { Deduction, AreaState } from '../models/area.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AreaCalculatorService {
  private readonly STORAGE_KEY = 'area_calculator_state';

  width = signal<number | null>(null);
  length = signal<number | null>(null);
  deductions = signal<Deduction[]>([]);
  wasteMargin = signal<number | null>(null);

  grossArea = computed(() => {
    const w = this.width();
    const l = this.length();
    return w !== null && l !== null ? w * l : 0;
  });

  perimeter = computed(() => {
    const w = this.width();
    const l = this.length();
    return w !== null && l !== null ? 2 * (w + l) : 0;
  });

  totalDeductionsArea = computed(() =>
    this.deductions().reduce((sum, d) => sum + (d.width * d.length), 0)
  );

  netArea = computed(() =>
    Math.max(0, this.grossArea() - this.totalDeductionsArea())
  );

  totalAreaWithWaste = computed(() => {
    const net = this.netArea();
    const waste = this.wasteMargin() ?? 0;
    return net * (1 + waste / 100);
  });

  constructor(private sessionStorage: SessionStorageService) {
    const saved = this.sessionStorage.getItem<AreaState>(this.STORAGE_KEY);
    if (saved) {
      this.width.set(saved.width);
      this.length.set(saved.length);
      this.deductions.set(saved.deductions);
      this.wasteMargin.set(saved.wasteMargin);
    }

    effect(() => {
      const state: AreaState = {
        width: this.width(),
        length: this.length(),
        deductions: this.deductions(),
        wasteMargin: this.wasteMargin()
      };
      this.sessionStorage.setItem(this.STORAGE_KEY, state);
    });
  }

  updateDimensions(width: number | null, length: number | null): void {
    this.width.set(width);
    this.length.set(length);
    this.validateAndAdjustDeductions();
  }

  updateWasteMargin(margin: number | null): void {
    this.wasteMargin.set(margin);
  }

  addDeduction(deduction: Omit<Deduction, 'id'>): void {
    const newDeduction: Deduction = {
      ...deduction,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)
    };
    this.deductions.update(list => [...list, newDeduction]);
  }

  removeDeduction(id: string): void {
    this.deductions.update(list => list.filter(d => d.id !== id));
  }

  clearDeductions(): void {
    this.deductions.set([]);
  }

  reset(): void {
    this.width.set(null);
    this.length.set(null);
    this.deductions.set([]);
    this.wasteMargin.set(null);
  }

  private validateAndAdjustDeductions(): void {
    const currentWidth = this.width() ?? 0;
    const currentLength = this.length() ?? 0;
    
    this.deductions.update(list => 
      list.filter(d => d.width <= currentWidth && d.length <= currentLength)
          .map(d => {
            const x = Math.min(d.x, currentWidth - d.width);
            const y = Math.min(d.y, currentLength - d.length);
            return { ...d, x: Math.max(0, x), y: Math.max(0, y) };
          })
    );
  }
}
