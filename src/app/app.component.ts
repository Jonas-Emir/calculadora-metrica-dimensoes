import { Component } from '@angular/core';
import { AreaFormComponent } from './components/area-form/area-form.component';
import { DeductionListComponent } from './components/deduction-list/deduction-list.component';
import { AreaPreviewComponent } from './components/area-preview/area-preview.component';
import { AreaSummaryComponent } from './components/area-summary/area-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AreaFormComponent,
    DeductionListComponent,
    AreaPreviewComponent,
    AreaSummaryComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
