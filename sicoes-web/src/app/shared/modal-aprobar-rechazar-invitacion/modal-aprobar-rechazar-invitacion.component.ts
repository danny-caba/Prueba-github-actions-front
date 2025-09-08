import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { InvitacionRenovacionService } from 'src/app/service/invitacion-renovacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'vex-modal-aprobar-rechazar-invitacion',
  templateUrl: './modal-aprobar-rechazar-invitacion.component.html',
  styleUrls: ['./modal-aprobar-rechazar-invitacion.component.scss']
})
export class ModalAprobarRechazarInvitacionComponent extends BaseComponent implements OnInit {

  invitacion: any;
  isLoading: boolean = false;
  mostrarErrorObservacion: boolean = false;
  accionSeleccionada: string = '';

  formGroup = this.fb.group({
    observacion: ['', []]
  });

  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<ModalAprobarRechazarInvitacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private invitacionRenovacionService: InvitacionRenovacionService,
  ) {
    super();
    this.invitacion = data?.invitacion;
  }

  ngOnInit() {
    console.log('Invitación recibida:', this.invitacion);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal() {
    this.dialogRef.close('close');
  }

  evaluarInvitacion(accion: 'ACEPTAR' | 'RECHAZAR') {
    this.accionSeleccionada = accion;
    this.mostrarErrorObservacion = false;

    // Validar observación requerida para rechazo
    if (accion === 'RECHAZAR' && (!this.formGroup.controls.observacion.value || this.formGroup.controls.observacion.value.trim() === '')) {
      this.mostrarErrorObservacion = true;
      this.formGroup.controls.observacion.markAsTouched();
      return;
    }

    const mensaje = accion === 'ACEPTAR' 
      ? '¿Está seguro de que desea aprobar esta invitación?' 
      : '¿Está seguro de que desea rechazar esta invitación?';

    functionsAlert.questionSiNo(mensaje).then((result) => {
      if (result.isConfirmed) {
        this.procesarEvaluacion(accion);
      }
    });
  }

  private procesarEvaluacion(accion: 'ACEPTAR' | 'RECHAZAR') {
    this.isLoading = true;

    // Preparar el objeto de datos para enviar
    const requestData = {
      idReqInvitacion: this.invitacion?.idReqInvitacion,
      idRequerimientoRenovacion: this.invitacion?.idRequerimientoRenovacion,
      observacion: this.formGroup.controls.observacion.value || '',
      ...this.invitacion
    };

    console.log(`${accion} invitación con datos:`, requestData);

    const serviceCall = accion === 'ACEPTAR' 
      ? this.invitacionRenovacionService.aceptarInvitacion(requestData)
      : this.invitacionRenovacionService.rechazarInvitacion(requestData);

    serviceCall
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          const mensaje = accion === 'ACEPTAR' 
            ? 'Invitación aprobada exitosamente' 
            : 'Invitación rechazada exitosamente';
          
          functionsAlert.success(mensaje).then(() => {
            this.dialogRef.close('OK');
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error(`Error al ${accion.toLowerCase()} invitación:`, error);
          
          let mensajeError = `Error al ${accion.toLowerCase()} la invitación`;
          if (error?.error?.message) {
            mensajeError = error.error.message;
          } else if (error?.message) {
            mensajeError = error.message;
          }
          
          functionsAlert.error(mensajeError);
        }
      });
  }

  // Método para enviar notificación (si es necesario)
  private enviarNotificacion(idTipoNotifica: number) {
    this.invitacionRenovacionService.notificarRenovacion(idTipoNotifica)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Notificación enviada exitosamente:', response);
        },
        error: (error) => {
          console.error('Error al enviar notificación:', error);
          // No mostramos error al usuario ya que es un proceso secundario
        }
      });
  }
}