import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-layout-input',
  templateUrl: './layout-input.component.html',
  styleUrls: ['./layout-input.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutInputComponent {

  @Input() label: string = ''
  @Input() obligatorio: boolean = false;

  formGroup = this.fb.group({
    ctrlInput: ['', this.obligatorio ? Validators.required : null]
  });


  constructor(
    private readonly fb: FormBuilder
  ) { }

  obtenerContenidoInput(): string {
    return this.formGroup.get('ctrlInput')?.value ?? '';
  }

}
