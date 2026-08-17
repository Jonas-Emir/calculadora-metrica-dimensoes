import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'squareMeters',
  standalone: true
})
export class SquareMetersPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    const numericValue = value ?? 0;
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
    return `${formatted} m²`;
  }
}
