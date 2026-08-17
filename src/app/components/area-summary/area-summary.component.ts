import { Component, inject } from '@angular/core';
import { AreaCalculatorService } from '../../services/area-calculator.service';
import { SquareMetersPipe } from '../../pipes/square-meters.pipe';

@Component({
  selector: 'app-area-summary',
  standalone: true,
  imports: [SquareMetersPipe],
  templateUrl: './area-summary.component.html',
  styleUrl: './area-summary.component.scss'
})
export class AreaSummaryComponent {
  protected calculatorService = inject(AreaCalculatorService);

  resetAll(): void {
    this.calculatorService.reset();
  }

  formatLinearMeters(value: number): string {
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return `${formatted} m`;
  }
}
