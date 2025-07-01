import { Directive } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Opcion } from 'src/helpers/constantes.options.';
import { functions } from 'src/helpers/functions';

@Directive()
export abstract class BaseComponent {

  opcion = Opcion
  dateHoy = new Date();

  compareSelecIdListadoDetalle(a, b){
    //if (functions.esVacio(a) || functions.esVacio(b)) return false;
    return a?.idListadoDetalle === b?.idListadoDetalle;
  }
  compareSelecIdArea(a, b){
    //if (functions.esVacio(a) || functions.esVacio(b)) return false;
    return a?.idUnidad === b?.idUnidad;
  }

  compareSelectIdSeccion(a, b){
    return a?.idSeccion === b?.idSeccion;
  }

  compareSelecIdPersonal(a, b){
    //if (functions.esVacio(a) || functions.esVacio(b)) return false;
    return a?.idPersona === b?.idPersona;
  }

  numberOnly(event): boolean {
    return functions.numberOnly(event);;
  }

  decimalNumberOnly(event): boolean {
    return functions.decimalNumberOnly(event);;
  }

  disableAllForm(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(ctrl => {
      formGroup.controls[ctrl].disable({ emitEvent: true })
    });
  }

  public disableControls(active: boolean, controls: string[], formGroup: FormGroup) {
    controls.forEach(name => {
      if (active) formGroup.controls[name]?.disable({ emitEvent: false })
      else formGroup.controls[name]?.enable({ emitEvent: false })
    })
  }

  public clearValidator(active: boolean, controls: string[], formGroup: FormGroup) {
    controls.forEach(name => {
      if (active){
        formGroup.controls[name].clearValidators();
      }else{
        formGroup.controls[name].setValidators([Validators.required]);
      }
      formGroup.controls[name].updateValueAndValidity();
    })
  }

  public findInvalidControls(formGroup: FormGroup) {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

  /*private clearValidator(active: boolean, controls: string[], formGroup: FormGroup) {
    ['nombreRazonSocial'].forEach(name => {
      if (active) this.formGroup.controls[name].disable({ emitEvent: false })
      else this.formGroup.controls[name].enable({ emitEvent: false })
    })
  }*/

  decimalOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      //Check if the text already contains the . character
      if (event.srcElement.value.split('.').length > 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    }
    if(event.srcElement.selectionStart === event.srcElement.value.length){
      const inputValue = event.srcElement.value + String.fromCharCode(charCode);
      const parts = inputValue.split('.');
      if (parts.length === 2 && parts[1].length > 2) {
        return false; // No permitir más de dos decimales
      }
    }
    return true;
  }
}
