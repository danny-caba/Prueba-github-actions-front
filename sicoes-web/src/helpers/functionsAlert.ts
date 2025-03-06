import { HttpParams } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

export class functionsAlert{

    static question(title:string): any{
        return Swal.fire({
            //title: title,
            text:title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C',
        })
    }

    static addQuestion(title:string): any{
        return Swal.fire({
            //title: title,
            text:title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, agregar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C',
        })
    }

    static deleteQuestion(title:string): any{
        return Swal.fire({
            //title: title,
            text:title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C',
        })
    }

    static successDescargar(title:string): any{
        return Swal.fire({
            //title: title,
            html:title,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#000090'
        })
    }
    static successHtml(title:string): any{
        return Swal.fire({
            //title: title,
            html:title,
            icon: 'success',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C'
        })
    }
    static success(title:string): any{
        return Swal.fire({
            //title: title,
            text:title,
            icon: 'success',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C'
        })
    }
    static error(title:string): any{
        return Swal.fire({
            //title: title,
            text:title,
            icon: 'error',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C'
        })
    }

    static questionSiNo(title:string): any{
        return Swal.fire({
            //title: title,
            //text:title,
            html:title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            confirmButtonColor: '#C00F1C',
        })
    }

    static questionSiNoEval(html: string): any{
        return Swal.fire({
            title: 'Finalizar Evaluación',
            html:html,
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            confirmButtonColor: '#C00F1C',
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

    static preguntarSiNo(title:string, txtBotonConfirmar:string): any{
        return Swal.fire({
            customClass: {
                cancelButton: 'bg-white text-primary '
              },
            html:title,
            showCancelButton: true,
            confirmButtonText: txtBotonConfirmar,
            cancelButtonText: 'No, volver',
            confirmButtonColor: '#000090',
            reverseButtons: true
        })
    }

    static info(title:string): any{
        return Swal.fire({
            text: title,
            icon: 'info',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C'
        })
    }

    static vigente(title:string, text:string): any{
        return Swal.fire({
            title:title,
            text: text,
            icon: 'warning',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C00F1C'
        })
    }
}
