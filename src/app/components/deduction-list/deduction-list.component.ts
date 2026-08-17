import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AreaCalculatorService } from '../../services/area-calculator.service';
import { DeductionType } from '../../models/area.model';
import { SquareMetersPipe } from '../../pipes/square-meters.pipe';

@Component({
  selector: 'app-deduction-list',
  standalone: true,
  imports: [ReactiveFormsModule, SquareMetersPipe],
  templateUrl: './deduction-list.component.html',
  styleUrl: './deduction-list.component.scss'
})
export class DeductionListComponent {
  private fb = inject(NonNullableFormBuilder);
  protected calculatorService = inject(AreaCalculatorService);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    type: ['door' as DeductionType, [Validators.required]],
    width: [1.0, [Validators.required, Validators.min(0.01)]],
    length: [2.0, [Validators.required, Validators.min(0.01)]],
    x: [0.0, [Validators.required, Validators.min(0)]],
    y: [0.0, [Validators.required, Validators.min(0)]]
  }, {
    validators: [this.fitValidator()]
  });

  addDeduction(): void {
    if (this.form.valid) {
      const val = this.form.getRawValue();
      this.calculatorService.addDeduction(val);
      this.form.reset({
        name: '',
        type: 'door',
        width: 1.0,
        length: 2.0,
        x: 0.0,
        y: 0.0
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  removeDeduction(id: string): void {
    this.calculatorService.removeDeduction(id);
  }

  getDeductionLabel(type: DeductionType): string {
    switch (type) {
      case 'door': return 'Porta';
      case 'window': return 'Janela';
      case 'cutout': return 'Recorte';
    }
  }

  private fitValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const width = control.get('width')?.value ?? 0;
      const length = control.get('length')?.value ?? 0;
      const x = control.get('x')?.value ?? 0;
      const y = control.get('y')?.value ?? 0;

      const mainW = this.calculatorService.width() ?? 0;
      const mainL = this.calculatorService.length() ?? 0;

      const errors: ValidationErrors = {};

      if (width > mainW) {
        errors['widthExceedsMain'] = true;
      }
      if (length > mainL) {
        errors['lengthExceedsMain'] = true;
      }
      if (x + width > mainW) {
        errors['xExceedsMain'] = true;
      }
      if (y + length > mainL) {
        errors['yExceedsMain'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
}
