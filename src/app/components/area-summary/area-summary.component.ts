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

  exportToWhatsApp(): void {
    const w = this.calculatorService.width();
    const l = this.calculatorService.length();
    
    if (w === null || l === null) {
      return;
    }

    const gross = this.calculatorService.grossArea();
    const peri = this.calculatorService.perimeter();
    const totalDeductions = this.calculatorService.totalDeductionsArea();
    const net = this.calculatorService.netArea();
    const waste = this.calculatorService.wasteMargin() ?? 0;
    const totalWithWaste = this.calculatorService.totalAreaWithWaste();
    const deductions = this.calculatorService.deductions();

    let deductionsText = '';
    if (deductions.length > 0) {
      deductionsText = deductions.map(d => {
        const typeLabel = d.type === 'door' ? 'Porta' : d.type === 'window' ? 'Janela' : 'Recorte';
        return `- ${d.name} (${typeLabel}): ${d.width}x${d.length}m = ${(d.width * d.length).toFixed(2)} m²`;
      }).join('\n');
    } else {
      deductionsText = '- Nenhuma dedução adicionada';
    }

    const message = `*Calculadora Métrica - Resumo do Cálculo*
----------------------------------------
📐 *Dimensões Principais:*
- Largura: ${w.toFixed(2)} m
- Comprimento: ${l.toFixed(2)} m
- Área Bruta: ${gross.toFixed(2)} m²
- Perímetro: ${peri.toFixed(2)} m

🚪 *Deduções de Vãos:*
${deductionsText}
- Total Deduções: ${totalDeductions.toFixed(2)} m²

🎯 *Resultados:*
- Área Líquida: ${net.toFixed(2)} m²
- Margem de Sobra/Corte: ${waste}%
- *Total Requerido:* *${totalWithWaste.toFixed(2)} m²*`;

    const encodedText = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(url, '_blank');
  }
}
