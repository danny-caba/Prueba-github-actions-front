import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { AprobadorAccion, AprobadorRequerimientoAccionEnum as accion, ListadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ModalFirmaDigitalComponent } from '../modal-firma-digital/modal-firma-digital.component';
import { RequerimientoService } from 'src/app/service/requerimiento.service';

@Component({
  selector: 'vex-modal-aprobador-supervisor-pn',
  templateUrl: './modal-aprobador-supervisor-pn.component.html',
  styleUrls: ['./modal-aprobador-supervisor-pn.component.scss']
})
export class ModalAprobadorSupervisorPnComponent extends BaseComponent implements OnInit {
  AprobadorAccion = AprobadorAccion
  listaSolicitudUuidSeleccionado = []
  errores: { uuid: string; error: any }[] = [];
  estadosAprobacion: ListadoDetalle[] = [];
  someResponsableSIAF = false;

  formGroup = this.fb.group({
    observacion: [null],
    nuSiaf: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorSupervisorPnComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private parametriaService: ParametriaService,
    private requerimientoService: RequerimientoService
  ) {
    super();
    this.listaSolicitudUuidSeleccionado = data.listaSolicitudUuidSeleccionado;

    if (this.listaSolicitudUuidSeleccionado.some(item => item.responsableSIAF)) {
      this.someResponsableSIAF = true;
      // Agregar validación requerida al campo nuSiaf si es responsable SIAF
      this.formGroup.get('nuSiaf')?.setValidators([Validators.required]);
      this.formGroup.get('nuSiaf')?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.cargarCombo();
  }

  cargarCombo() {
    const dataString = sessionStorage.getItem('ESTADO_APROBACION');
    if (dataString !== null) {
      this.estadosAprobacion = JSON.parse(dataString);
    } else {
      this.parametriaService.obtenerMultipleListadoDetalle([
        ListadoEnum.ESTADO_APROBACION
      ]).subscribe(res => {
        this.estadosAprobacion = res[0];
      });
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return true;
    }
    return false;
  }

  aprobadores: Observable<any>

  guardar(tipo) {
    this.errores = [];

    let msj = tipo == 'RECHAZADO' 
      ? '¿Está seguro de que desea rechazar la evaluación?' 
      : '¿Está seguro de que desea aprobar la evaluación?';

    if (this.validarForm()) return;

    functionsAlert.questionSiNo(msj).then(async (result) => {
      if (result.isConfirmed) {
        const estado = tipo === accion.APROBADO 
        ? this.estadosAprobacion.find(e => e.codigo === accion.APROBADO) 
        : this.estadosAprobacion.find(e => e.codigo === accion.DESAPROBADO);

        // Crear array de observables para procesar en paralelo
        const peticiones = this.listaSolicitudUuidSeleccionado.map(item => {
          const { idRequerimientoAprobacion } = item;
          let payload = {
            idRequerimientoAprobacion,
            estado,
            observacion: this.formGroup.get('observacion')?.value,
            idEstadoRevision: item.idEstadoRevision,
          };

          if (this.someResponsableSIAF) {
            payload = {
              ...payload,
              requerimiento: {
                nuSiaf: this.formGroup.get('nuSiaf')?.value
              }
            } as any;
          }

          // Retornar observable con manejo de errores
          return this.evaluadorService.requerimientosAprobar(item.requerimiento.requerimientoUuid, payload).pipe(
            map(() => ({ 
              success: true, 
              uuid: item.requerimiento.requerimientoUuid,
              expediente: item.requerimiento.nuExpediente 
            })),
            catchError(error => {
              console.error('Error en aprobación:', error);
              return of({ 
                success: false, 
                uuid: item.requerimiento.requerimientoUuid,
                expediente: item.requerimiento.nuExpediente,
                error: error?.message || error 
              });
            })
          );
        });

        // Procesar todas las peticiones en paralelo
        forkJoin(peticiones).subscribe(resultados => {
          // Separar éxitos y errores
          const exitosos = resultados.filter(r => r.success);
          const fallidos = resultados.filter(r => !r.success);

          // Actualizar array de errores
          this.errores = fallidos.map(f => ({
            uuid: f.uuid,
            error: (f as any).error
          }));

          // Mostrar mensaje final con resumen
          this.mostrarMensajeFinal(exitosos.length, fallidos);

          // Si hay al menos un éxito, activar firma digital
          if (exitosos.length > 0) {
            this.activarFirmaDigital(() => {
              this.dialogRef.close(true);
            });
          } else {
            this.dialogRef.close(true);
          }
        });
      }
    });
  }

  mostrarMensajeFinal(exitosos: number, fallidos: any[]) {
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
    });

    if (exitosos > 0 && fallidos.length === 0) {
      // Todos fueron exitosos
      Toast.fire({
        icon: 'success',
        title: `Proceso Completado`,
        html: `<strong>${exitosos}</strong> aprobación(es) procesada(s) exitosamente`,
        background: '#d4edda',
        iconColor: '#155724',
        color: '#155724'
      });
    } else if (exitosos > 0 && fallidos.length > 0) {
      // Algunos exitosos, algunos fallidos
      const expedientesFallidos = fallidos.map(f => f.expediente).join(', ');
      Toast.fire({
        icon: 'warning',
        title: `⚠️ Proceso Completado Parcialmente`,
        html: `
          <div style="text-align: left;">
            <p><strong>Éxitos:</strong> ${exitosos}</p>
            <p><strong>Errores:</strong> ${fallidos.length}</p>
            <p><strong>Expedientes con errores:</strong><br/>${expedientesFallidos}</p>
          </div>
        `,
        background: '#fff3cd',
        iconColor: '#856404',
        color: '#856404',
        timer: 12000 // Más tiempo para leer los detalles
      });
    } else {
      // Todos fallaron
      const expedientesFallidos = fallidos.map(f => f.expediente).join(', ');
      Toast.fire({
        icon: 'error',
        title: `Error en el Proceso`,
        html: `
          <div style="text-align: left;">
            <p>No se pudieron procesar las aprobaciones</p>
            <p><strong>Expedientes con errores:</strong><br/>${expedientesFallidos}</p>
          </div>
        `,
        background: '#f8d7da',
        iconColor: '#721c24',
        color: '#721c24',
        timer: 10000
      });
    }
  }

  activarFirmaDigital(onComplete?: () => void) {
    let listaIdArchivosSiged = [];
    let contadorProcesados = 0;
    
    // Filtrar elementos que requieren firma
    let listaRegistrosAFirmar = this.listaSolicitudUuidSeleccionado.filter(item => item.requerimiento.accionFirmar) || [];
    
    // Si no hay elementos para firmar, intenta con todos los elementos exitosos
    // if (listaRegistrosAFirmar.length === 0) {
    //   listaRegistrosAFirmar = this.listaSolicitudUuidSeleccionado;
    // }
    
    const totalElementos = listaRegistrosAFirmar.length;

    if (totalElementos === 0) {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    for (const item of listaRegistrosAFirmar) {
      
      this.requerimientoService.obtenerIdInformeSiged(item.requerimiento.nuExpediente).subscribe({
        next: (res) => {
          if (res != 0) {
            listaIdArchivosSiged.push(res);
          }
          contadorProcesados++;
          
          // Solo abrir modal cuando se hayan procesado todos los elementos
          if (contadorProcesados === totalElementos) {
            if (listaIdArchivosSiged.length > 0) {
              this.abrirModalFirmaDigital(listaIdArchivosSiged, onComplete);
            } else {
              if (onComplete) {
                onComplete();
              }
            }
          }
        },
        error: (error) => {
          contadorProcesados++;
          
          // Verificar si terminaron todos los procesos
          if (contadorProcesados === totalElementos) {
            if (listaIdArchivosSiged.length > 0) {
              this.abrirModalFirmaDigital(listaIdArchivosSiged, onComplete);
            } else {
              if (onComplete) {
                onComplete();
              }
            }
          }
        }
      });
    }
  }

  abrirModalFirmaDigital(listaIdArchivosSiged: number[], onComplete?: () => void) {
    let token = {
      usuario: sessionStorage.getItem("USUARIO")
    }
    this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe(parameter => {
      const modalRef = this.dialog.open(ModalFirmaDigitalComponent, {
        width: '605px',
        maxHeight: '100%',
        data: {
          action: parameter.action,
          loginUsuario: parameter.loginUsuario,
          passwordUsuario: parameter.passwordUsuario,
          archivosFirmar: listaIdArchivosSiged.toString()
        }, 
      });

      modalRef.afterClosed().subscribe(result => {
        if (result == 'OK') {
        } else {
        }
        
        // Ejecutar callback sin importar el resultado de la firma
        if (onComplete) {
          onComplete();
        }
      });
    });
  }

}
