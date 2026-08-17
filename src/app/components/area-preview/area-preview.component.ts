import { Component, inject, computed } from '@angular/core';
import { AreaCalculatorService } from '../../services/area-calculator.service';
import { Deduction } from '../../models/area.model';

@Component({
  selector: 'app-area-preview',
  standalone: true,
  imports: [],
  templateUrl: './area-preview.component.html',
  styleUrl: './area-preview.component.scss'
})
export class AreaPreviewComponent {
  protected calculatorService = inject(AreaCalculatorService);

  viewBox = computed(() => {
    const w = this.calculatorService.width();
    const l = this.calculatorService.length();
    const margin = 0.6;
    return `${-margin} ${-margin} ${w + margin * 2} ${l + margin * 2}`;
  });

  gridStrokeWidth = computed(() => {
    const w = this.calculatorService.width();
    return Math.max(0.01, w * 0.005);
  });

  fontSize = computed(() => {
    const w = this.calculatorService.width();
    return Math.max(0.12, w * 0.04);
  });

  arrowSize = computed(() => {
    const w = this.calculatorService.width();
    return Math.max(0.05, w * 0.015);
  });

  getDeductionColor(type: string): string {
    switch (type) {
      case 'door': return '#f59e0b';
      case 'window': return '#3b82f6';
      case 'cutout': return '#ec4899';
      default: return '#9ca3af';
    }
  }

  getDeductionLabel(d: Deduction): string {
    return `${d.name} (${d.width}x${d.length}m)`;
  }
}
