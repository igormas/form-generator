import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGeneratorComponent } from './shared/form-generator/components/form-generator/form-generator.component';
import { IFormControl } from './shared/form-generator/components/form-generator/utility/form-control';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'form-generator';
  formControlList: IFormControl[] = [
    {
      type: 'input',
      id: 'name',
      validators: [(value: any) => value === 'Allen' ? null : 'invalid'],
    },
  ];
}
