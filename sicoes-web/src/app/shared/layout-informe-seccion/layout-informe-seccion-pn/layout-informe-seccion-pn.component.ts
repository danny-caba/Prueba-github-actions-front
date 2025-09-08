import { Component, ViewChild, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { LayoutInputComponent } from '../../layout-input/layout-input.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form?.submitted;
    return !!(control?.invalid && (control?.dirty || control?.touched || isSubmitted));
  }
}

@Component({
  selector: 'vex-layout-informe-seccion-pn',
  templateUrl: './layout-informe-seccion-pn.component.html',
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutInformeSeccionPNComponent {

  @Input() ordenSeccion: string;
  @Input() tituloSeccion: string;
  @Input() obligatorio: boolean;
  @ViewChild(LayoutInputComponent) inputComponent: LayoutInputComponent;

  constructor() {}

  obtenerContenidoSeccion(): string {
    return this.inputComponent?.obtenerContenidoInput() || '';
  }

}
