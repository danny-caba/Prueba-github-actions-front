import { HttpParams } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

export class functionsAlertMod2{
    static success(title:string): any{
        return Swal.fire({
            html:"<h2 class='pt-2 text-primary font-bold'>"+title+"</h2>",
            icon: 'success',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#000090',
            focusConfirm: true,
            returnFocus: false
        })
    }

    static preguntarSiNoIcono(title:string){
        return Swal.fire({
            html:"<h2 class='pt-2 text-primary font-bold'>"+title+"</h2>",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            confirmButtonColor: '#000090',
            width: '60em',
            customClass: {
                cancelButton: 'btn-cancelar-alerta'
            },
            focusCancel: true,
            returnFocus: false,
        })
    }

    static preguntarSiNoIconoWarning(title:string){
        return Swal.fire({
            html:"<h2 class='pt-2 text-primary font-bold'>"+title+"</h2>",
            icon: 'warning',
            showCancelButton: false,
            //confirmButtonText: 'Sí',
            //cancelButtonText: 'No',
            confirmButtonColor: '#000090',
            width: '60em',
            customClass: {
                cancelButton: 'btn-cancelar-alerta'
            },
            focusCancel: true,
            returnFocus: false,
        })
    }

    static preguntarSiNo(title:string, txtBotonConfirmar:string): any{
        return Swal.fire({
            customClass: {
                cancelButton: 'btn-cancelar-alerta'
              },
            html:"<h2 class='pt-2 text-primary font-bold'>"+title+"</h2>",
            showCancelButton: true,
            confirmButtonText: txtBotonConfirmar,
            cancelButtonText: 'No, volver',
            confirmButtonColor: '#000090',
            returnFocus: false,
            focusCancel: true,
            reverseButtons: true
        })
    }

    static successButtonDistinto(title:string, textButton:string){
        return Swal.fire({
            html:"<h2 class='pt-2 text-primary font-bold'>"+title+"</h2>",
            icon: 'success',
            confirmButtonColor: '#000090',
            confirmButtonText: textButton,
            focusConfirm: true,
            returnFocus: false
        })
    }
    static warningMensage(title:string){
        return Swal.fire({
            html:"<h2 class='pt-2 text-primary font-bold'>"+title+"</h2>",
            icon: 'warning',
            confirmButtonColor: '#000090',
            focusConfirm: true,
            returnFocus: false
        })
    }

    static alertaConfigurable(title:string, textButton:string, icono:any){
        return Swal.fire({
            html:"<h2 class='pt-2 text-primary font-bold'>"+title+"</h2>",
            icon: icono,
            confirmButtonColor: '#000090',
            confirmButtonText: textButton,
            focusConfirm: true,
            returnFocus: false
        })
    }

    static alertArribaDerrecha(mensaje:string){
        Swal.fire({
            position: 'top-end',
            html: '<p class="text-primary font-bold text-xl">'+mensaje+'</p>',
            showConfirmButton: false,
            timer: 1500
          })
    }

    static loadProceso(){
        return Swal.fire({
        //title: 'Auto close alert!',
        html: 'Procesando Documento',
        timer: 2000,
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        }
      })
    }

    static loadProcesoDownload(){
        return Swal.fire({
        //title: 'Auto close alert!',
        html: 'Procesando Documento',
        //timer: 2000,
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        }
      })
    }
}
