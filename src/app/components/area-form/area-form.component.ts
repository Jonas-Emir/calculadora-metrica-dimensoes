import { Component, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaCalculatorService } from '../../services/area-calculator.service';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './area-form.component.html',
  styleUrl: './area-form.component.scss'
})
export class AreaFormComponent {
  private fb = inject(FormBuilder);
  protected calculatorService = inject(AreaCalculatorService);

  form = this.fb.group({
    width: [this.calculatorService.width() as number | null, [Validators.required, Validators.min(0.1)]],
    length: [this.calculatorService.length() as number | null, [Validators.required, Validators.min(0.1)]],
    wasteMargin: [this.calculatorService.wasteMargin() as number | null, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  constructor() {
    this.form.valueChanges.subscribe(value => {
      const w = typeof value.width === 'number' ? value.width : null;
      const l = typeof value.length === 'number' ? value.length : null;
      const m = typeof value.wasteMargin === 'number' ? value.wasteMargin : null;
      
      this.calculatorService.updateDimensions(w, l);
      this.calculatorService.updateWasteMargin(m);
    });

    effect(() => {
      const w = this.calculatorService.width();
      const l = this.calculatorService.length();
      const m = this.calculatorService.wasteMargin();

      const current = this.form.value;
      if (current.width !== w || current.length !== l || current.wasteMargin !== m) {
        this.form.patchValue({ width: w, length: l, wasteMargin: m }, { emitEvent: false });
        if (w === null && l === null && m === null) {
          this.form.markAsPristine();
          this.form.markAsUntouched();
        }
      }
    });
  }
}
