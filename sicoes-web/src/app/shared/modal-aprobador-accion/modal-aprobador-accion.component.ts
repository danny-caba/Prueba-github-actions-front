import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { AprobadorAccion } from 'src/helpers/constantes.components';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { Asignacion } from 'src/app/interface/asignacion';
import { MatDialog } from '@angular/material/dialog';
import { ModalFirmaDigitalComponent } from 'src/app/shared/modal-firma-digital/modal-firma-digital.component';

@Component({
  selector: 'vex-modal-aprobador-accion',
  templateUrl: './modal-aprobador-accion.component.html',
  styleUrls: ['./modal-aprobador-accion.component.scss']
})
export class ModalAprobadorAccionComponent extends BaseComponent implements OnInit {

  solicitud: Solicitud
  asignacion: Asignacion

  AprobadorAccion = AprobadorAccion

  booleanAdd: boolean
  booleanEdit: boolean
  booleanView: boolean = false
  esPersonaNat: boolean = true;

  formGroup = this.fb.group({
    observacion: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorAccionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private dialog: MatDialog,
  ) {
    super();
    this.solicitud = data?.solicitud;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';

    this.esPersonaNat = data.esPersonaNat;

    if (this.booleanView) {
      this.formGroup.disable();
    }

    if(this.booleanView == true){
      this.formGroup.patchValue(data.asignacion)
    }else{
      if (data.asignacion) {
        this.evaluadorService.obtenerAsignacion(data.asignacion.idAsignacion).subscribe(res => {
          this.asignacion = res;
          this.formGroup.patchValue(res)
        });
      }
    }
  }

  ngOnInit() {

  }

  closeModal() {
    this.dialogRef.close("close");
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  guardar(tipo) {
    let msj = '¿Está seguro de que desea aprobar la evaluación?'
    if (tipo == 'RECHAZADO') {
      msj = '¿Está seguro de que desea desaprobar la evaluación?';
      if (this.validarForm()) return;
    }

    functionsAlert.questionSiNo(msj).then((result) => {
      if (result.isConfirmed) {
        let obj = {
          idAsignacion: this.asignacion.idAsignacion,
          evaluacion: {
            codigo: tipo
          },
          observacion: this.formGroup.controls.observacion.getRawValue()
        }
    
        this.evaluadorService.evaluarAccion(obj).subscribe(res => {
          functionsAlert.success('Guardado').then((result) => {
            this.dialogRef.close("OK");

            if (tipo == 'APROBADO') {
              //Firma digital
              this.evaluadorService.obtenerIdArchivo(this.solicitud.numeroExpediente).subscribe(res => {
                if (res != 0) {
                  let token = {
                    usuario: sessionStorage.getItem("USUARIO")
                  }
                  this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe(parameter => {
                    this.dialog.open(ModalFirmaDigitalComponent, {
                      width: '605px',
                      maxHeight: '100%',
                      data: {
                        action: parameter.action,
                        loginUsuario: parameter.loginUsuario,
                        passwordUsuario: parameter.passwordUsuario,
                        archivosFirmar: res.toString()
                      },
                    })
                    .afterClosed().subscribe(result => {
                      if(result == 'OK'){
                      
                      }else{
                      
                      }
                    });
                  });
                }
              });
              //Fin firma digital
            }
          });
        });
      }
    });
    
  }

}
