import {
  Component,
  input,
  ViewContainerRef,
  inject,
  ElementRef,
  viewChild,
  AfterViewInit,
  signal,
  OnDestroy,
} from '@angular/core';
import { IFormControl } from './utility/form-control';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import {
  firstValueFrom,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-form-generator',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './form-generator.component.html',
  styleUrl: './form-generator.component.scss',
})
export class FormGeneratorComponent implements AfterViewInit, OnDestroy {
  private _httpClient = inject(HttpClient);

  private _formValue: Record<string, any> = {};
  private _destroy$ = new Subject<void>();

  controlsContainerElem = viewChild.required<ElementRef<HTMLElement>>('controlsContainer');
  saveUrl = input.required<string>();
  formControlList = input.required<IFormControl[]>();

  formControlList$ = toObservable(this.formControlList);

  constructor() {
  }

  private _getFormControlGenerator(formControl: IFormControl): HTMLElement {
    if (formControl.type === 'input') {
      const inputElem = document.createElement('input');

      function validate() {
        const isValid = formControl.validators?.every(validator => !validator(inputElem.value)) ?? true;
        const INVALID_CLASS = 'invalid';
        isValid ? inputElem.classList.remove(INVALID_CLASS) : inputElem.classList.add(INVALID_CLASS);
      }

      inputElem.addEventListener('input', () => {
        this._formValue[formControl.id] = inputElem.value;
        validate();
      });
      validate();
      return inputElem;
    }

    throw new Error(`Unknown form control type: ${formControl.type}`);
  }

  private _startFormBuilder(): void {
    const controlsContainerElem: HTMLElement = this.controlsContainerElem().nativeElement;
    this.formControlList$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((formControlList) => {
        controlsContainerElem.innerHTML = '';
        this._formValue = {};
        for (const formControl of formControlList) {
          const fcElem = this._getFormControlGenerator(formControl);
          controlsContainerElem.append(fcElem);
        }
      });
  }

  protected _save(): void {
    const isFormValid = !this.controlsContainerElem().nativeElement.querySelector('.invalid');
    if (!isFormValid) {
      alert('Form is invalid');
      return;
    }

    firstValueFrom(this._httpClient.post(this.saveUrl(), this._formValue));
  }

  ngAfterViewInit(): void {
    this._startFormBuilder();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
