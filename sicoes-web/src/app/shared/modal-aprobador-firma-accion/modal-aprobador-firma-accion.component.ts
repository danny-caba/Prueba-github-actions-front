import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { AprobadorAccion } from 'src/helpers/constantes.components';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { Asignacion } from 'src/app/interface/asignacion';
import { Observable } from 'rxjs';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { MatDialog } from '@angular/material/dialog';
import { ModalFirmaDigitalComponent } from 'src/app/shared/modal-firma-digital/modal-firma-digital.component';

@Component({
  selector: 'vex-modal-aprobador-firma-accion',
  templateUrl: './modal-aprobador-firma-accion.component.html',
  styleUrls: ['./modal-aprobador-firma-accion.component.scss']
})
export class ModalAprobadorFirmaAccionComponent extends BaseComponent implements OnInit {

  solicitud: Solicitud
  asignacion: Asignacion

  AprobadorAccion = AprobadorAccion

  //Borrar
  listaNroExpedienteSeleccionado = []
  listaSolicitudUuidSeleccionado = []
  usuario$ = this.authFacade.user$;
  usuario: AuthUser

  booleanAdd: boolean
  booleanEdit: boolean
  booleanView: boolean = false
  esPersonaNat: boolean = true;

  formGroup = this.fb.group({
    observacion: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorFirmaAccionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog
  ) {
    super();
    this.solicitud = data?.solicitud;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    //Borrar
    this.listaNroExpedienteSeleccionado = data.listaNroExpedienteSeleccionado;
    this.listaSolicitudUuidSeleccionado = data.listaSolicitudUuidSeleccionado;

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

    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    })
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

  aprobadores: Observable<any>

  guardar(tipo) {
    
    let msj = '¿Está seguro de que desea aprobar la evaluación?'

    if (tipo == 'RECHAZADO') {
      msj = '¿Está seguro de que desea desaprobar la evaluación?';
      if (this.validarForm()) return;
    }

    functionsAlert.questionSiNo(msj).then((result) => {

      if (result.isConfirmed) {
        
        for (let i = 0; i < this.listaNroExpedienteSeleccionado.length; i++) {
          
          let filtro = {
            codigoTipoAprobador: EvaluadorRol.APROBADOR_TECNICO_COD,
            solicitudUuid: this.listaSolicitudUuidSeleccionado[i]
          };
          
          this.evaluadorService.listarAsignacionesAprobadores(filtro).subscribe(res  => {

            for (let j = 0; j < res.content.length; j++) {
  
              let aprobacion: any = res.content[j];
              
              if (this.usuario?.idUsuario == aprobacion.usuario?.idUsuario && aprobacion.evaluacion?.codigo == 'ASIGNADO') {

                let obj = {
                  idAsignacion: aprobacion.idAsignacion,
                  evaluacion: {
                    codigo: tipo
                  },
                  observacion: this.formGroup.controls.observacion.getRawValue()
                }
                
                this.evaluadorService.evaluarAccion(obj).subscribe(res2 => {
                  if (i == (this.listaNroExpedienteSeleccionado.length - 1)) {
                    this.sleep(5000).then(any => {
                      this.dialogRef.close('OK');
                      functionsAlert.success('Guardado').then((result) => {
                        if (tipo == 'APROBADO') {
                          this.activarFirmaDigital();
                        }
                      });
                    })
                  }
                });
              }
            }
          });
        }     
      }
    });
  }

  activarFirmaDigital() {
    
    let listaIdArchivos = [];

    for (let j = 0; j < this.listaNroExpedienteSeleccionado.length; j++) {
      this.evaluadorService.obtenerIdArchivo(this.listaNroExpedienteSeleccionado[j]).subscribe(res => {
        if (res != 0) {
          listaIdArchivos.push(res);
        }

        //Firma digital
        if (j == (this.listaNroExpedienteSeleccionado.length - 1)) {
          if (listaIdArchivos.length > 0) {
            console.log(listaIdArchivos.toString());
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
                  archivosFirmar: listaIdArchivos.toString()
                },
              })
              .afterClosed().subscribe(result => {
                if (result == 'OK') {
                  
                }
              });
            })
          }
        }
      });
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
