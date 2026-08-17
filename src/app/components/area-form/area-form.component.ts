import { Component, inject, effect } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaCalculatorService } from '../../services/area-calculator.service';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './area-form.component.html',
  styleUrl: './area-form.component.scss'
})
export class AreaFormComponent {
  private fb = inject(NonNullableFormBuilder);
  protected calculatorService = inject(AreaCalculatorService);

  form = this.fb.group({
    width: [this.calculatorService.width(), [Validators.required, Validators.min(0.1)]],
    length: [this.calculatorService.length(), [Validators.required, Validators.min(0.1)]],
    wasteMargin: [this.calculatorService.wasteMargin(), [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  constructor() {
    this.form.valueChanges.subscribe(value => {
      if (this.form.valid) {
        const w = value.width ?? this.calculatorService.width();
        const l = value.length ?? this.calculatorService.length();
        const m = value.wasteMargin ?? this.calculatorService.wasteMargin();
        
        this.calculatorService.updateDimensions(w, l);
        this.calculatorService.updateWasteMargin(m);
      }
    });

    effect(() => {
      const w = this.calculatorService.width();
      const l = this.calculatorService.length();
      const m = this.calculatorService.wasteMargin();

      const current = this.form.getRawValue();
      if (current.width !== w || current.length !== l || current.wasteMargin !== m) {
        this.form.patchValue({ width: w, length: l, wasteMargin: m }, { emitEvent: false });
      }
    });
  }
}
