import { HttpParams } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

export class functions{
    
    static invalidField(field:string, f:FormGroup, formSubmitted:boolean): boolean{
        if(formSubmitted && f.controls[field].invalid){
            return true;
        }
        return false;
    }

    static numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    }

    static decimalNumberOnly(event: Event): boolean {
        const input = event.target as HTMLInputElement;
        const charCode = (event as KeyboardEvent).which || (event as KeyboardEvent).keyCode;
        if (charCode > 31 && charCode !== 46 && (charCode < 48 || charCode > 57)) {
            return false;
        }

        if (charCode === 46 && input.value.length === 0) {
            return false;
        }

        if (charCode === 46 && input.value.split('.').length > 1) {
            return false;
        }

        const parts = input.value.split('.');
        if (parts.length === 2 && parts[1].length >= 2 && charCode !== 46) {
            return false;
        }
        return true;
    }
 
    static paramsAdd(params: HttpParams, label:string, value:any): HttpParams{
        if(value !== null){
            return params.append(label, value);
        }
        return params;
    }

    static esVacio(variable): boolean{
        return (typeof variable === 'undefined' || variable === null || variable === '')
    }

    static noEsVacio(variable): boolean{
        return !(typeof variable === 'undefined' || variable === null || variable === '')
    }

    static esCero(variable): boolean{
        return (variable === 0 || variable < 1 || variable === '0')
    }
    static obtenerParams(filtro: any): HttpParams{
        let params = new HttpParams()

        for(const property in filtro){
          if(filtro[property] instanceof Array){
            filtro[property].forEach((item) => {
                params = params.append(`${property.toString()}`, item);
            });
          }else 
          if(filtro[property] !== '' && filtro[property] !== undefined && filtro[property] !== null){        
            params = params.append(property,filtro[property])
          }      
        }
        return params;
    }
    

    static habilitarControles(formGroup: FormGroup, controlNames, active:boolean) {
        controlNames.forEach(name => {
          if (!active) formGroup.controls[name].disable({ emitEvent: false })
          else formGroup.controls[name].enable({ emitEvent: false })
        })
    }

    static getFecha(fecha){
        if(functions.noEsVacio(fecha)){
            let f = fecha.split('/');
            return new Date(f[2] + '-' + f[1] + '-' + f[0] + 'T00:00:00');
        }
        return null;
    }
    
    static getFechaString(fecha){
        if(functions.noEsVacio(fecha)){
            let f = fecha.split('/');
            if(f[1].length==1){
                f[1]='0'+f[1]
              }  
              if(f[0].length==1){
                f[0]='0'+f[0]
              } 
            return (f[2] + '-' + f[1] + '-' + f[0]);
        }
        return null;
    }

    static getDateParse(fecha:string){
        if(functions.noEsVacio(fecha)){
            let fec = new Date(fecha);
            return fec.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour:'2-digit', minute: '2-digit', hour12: true});
        }
        return null;
    }

    static error(errorMsg: string){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 8000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

        Toast.fire({
            icon: 'error',
            title: errorMsg,
            background: '#f27474',
            iconColor: 'white',
            color: 'white'
        })
    }
}