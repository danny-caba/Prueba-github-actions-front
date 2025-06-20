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
import { ListadoDetalle } from 'src/app/interface/listado.model';
import {
  ListadoEnum,
  TipoPersonaEnum,
} from "src/helpers/constantes.components";
import { ParametriaService } from 'src/app/service/parametria.service';
import { PerfilService } from 'src/app/service/perfil.service';
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';

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
  mostrarPerfiles: boolean = false;
  esPrimerRechazo: boolean = true;

  // Lista de perfiles con checkboxes
  listPerfiles: any[] = [];
  listOpcion: ListadoDetalle[] = [];

  formGroup = this.fb.group({
    observacion: [null]
  });

  //aprobadorPerfilIds: number[] = []; // Array para almacenar los IDs de perfil del aprobador
  private destroy$ = new Subject<void>(); // Subject para desuscribirse de observables

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorAccionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private dialog: MatDialog,
    private parametriaService: ParametriaService,
    private perfilService: PerfilService,
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
        this.evaluadorService.obtenerAsignacion(data.asignacion.idAsignacion).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this.asignacion = res;
          this.formGroup.patchValue(res)
        });
      }
    }
  }
  
  ngOnInit() {
    console.log('Solicitud UUID:', this.solicitud?.solicitudUuid); // Verifica si el UUID está definido

    this.cargarCombo();
    //this.obtenerPerfilesAprobador('85'); // Llama a la función para obtener los IDs de perfil del aprobador
    this.listarPerfiles();
    this.mostrarPerfiles = false; 
    this.esPrimerRechazo = true;
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

  // Función para seleccionar/deseleccionar todos los perfiles
  toggleSelectAll(event: any): void {
    const isChecked = event.checked;
    this.listPerfiles.forEach(perfil => perfil.seleccionado = isChecked);
  }

  // Función para seleccionar/deseleccionar un perfil individual
  togglePerfil(perfil: any): void {
    perfil.seleccionado = !perfil.seleccionado;
  }

  // Función para verificar si hay perfiles seleccionados
  hayPerfilesSeleccionados(): boolean {
    return this.listPerfiles.some(perfil => perfil.seleccionado);
  }

  // Obtener el nombre del perfil
  obtenerNombrePerfil(perf: any): string {
    if (
      [
        TipoPersonaEnum.JURIDICO.valueOf(),
        TipoPersonaEnum.PN_POSTOR.valueOf(),
        TipoPersonaEnum.PJ_EXTRANJERO.valueOf(),
      ].includes(this.solicitud.persona.tipoPersona.codigo)
    ) {
      return perf.sector?.nombre + " / " + perf.subsector?.nombre + " / " + (perf.actividadArea?.codigo.split('_')[0] || '');
    } else {
      return (
        perf.perfil?.nombre
      );
    }
  }

  // Cargar combo de opciones
  cargarCombo() {
    this.parametriaService
      .obtenerMultipleListadoDetalle([ListadoEnum.RESULTADO_EVALUACION_ADM])
      .pipe(takeUntil(this.destroy$)) // Desuscribirse
      .subscribe((listRes) => {
        this.listOpcion = listRes[0];
      });
  }

  // Nueva función para obtener los IDs de perfil del aprobador
 /* obtenerPerfilesAprobador(idAprobador: string) {
    this.evaluadorService.obtenerIdsPerfiles(idAprobador)
        .pipe(takeUntil(this.destroy$)) // Desuscribirse
        .subscribe(ids => {
            this.aprobadorPerfilIds = ids;
            this.listarPerfiles(); // Llama a listarPerfiles después de obtener los IDs del aprobador
        });
}*/

  // Modificación de la función listarPerfiles para filtrar
  listarPerfiles() {
    if (this.solicitud?.solicitudUuid) {
        this.perfilService
            .buscarPerfiles({ solicitudUuid: this.solicitud.solicitudUuid, size: 1000 })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (listPerf) => {
                    this.listPerfiles = listPerf.content || [];
                    console.log('Perfiles cargados:', this.listPerfiles.map(p => ({
                        idOtroRequisito: p.idOtroRequisito,
                        nombre: p.perfil?.nombre,
                        seleccionado: false
                    })));
                    
                    // Inicializar selección
                    this.listPerfiles.forEach(p => p.seleccionado = false);
                },
                error: (err) => {
                    console.error('Error cargando perfiles:', err);
                    functionsAlert.error('Error al cargar los perfiles');
                }
            });
    }
  }

  evalAdmin(tipoAsignacion: ListadoDetalle): boolean {
    return tipoAsignacion?.idListadoDetalle === 562;
  }

  guardar(tipo) {
    const esRechazoEspecial = this.solicitud?.persona?.tipoPersona?.codigo === 'PN_PERS_PROPUESTO';
    const esRechazoAdministrativo = this.evalAdmin(this.asignacion?.tipo);
    console.log(esRechazoAdministrativo + "......." + tipo.idListadoDetalle)
    console.log("El objeto tipo antes de guardar:", tipo);

    let msj = '¿Está seguro de que desea aprobar la evaluación?';

    if (tipo === 'RECHAZADO') {
        // 1. Para PN_PERS_PROPUESTO (rechazo con perfiles)
        if (!esRechazoAdministrativo) {
          if (esRechazoEspecial) {
            if (this.esPrimerRechazo) {
                this.mostrarPerfiles = true;
                this.esPrimerRechazo = false;
                return;
            }

            const perfilesSeleccionados = this.listPerfiles.filter(p => p.seleccionado && p.idOtroRequisito);
            if (perfilesSeleccionados.length === 0) {
                functionsAlert.error('Debe seleccionar al menos un perfil para rechazar');
                return;
            }

            msj = `¿Rechazar ${perfilesSeleccionados.length} perfil(es)?`;
            
            functionsAlert.questionSiNo(msj).then((result) => {
              if (result.isConfirmed) {
                  // **Mover la llamada a crearHistorial aquí**
                  this.evaluadorService.crearHistorialAsignacionBackend( // Asegúrate de tener este método en tu servicio
                      this.asignacion.idAsignacion,
                      AprobadorAccion.RECHAZADO, // O el texto que corresponda a "RECHAZO"
                      this.formGroup.controls.observacion.value
                  ).pipe(takeUntil(this.destroy$)).subscribe(() => {
                      // Crear array de observables para rechazar perfiles
                      const rechazos$ = perfilesSeleccionados.map(perfil =>
                          this.evaluadorService.rechazarPerfil(
                              this.asignacion.idAsignacion,
                              perfil.idOtroRequisito,
                              this.formGroup.controls.observacion.value
                          ).pipe(
                              catchError(error => {
                                  console.error('Error rechazando perfil:', perfil.idOtroRequisito, error);
                                  return of({
                                      success: false,
                                      message: `Error en perfil ${perfil.idOtroRequisito}`
                                  });
                              })
                          )
                      );

                      forkJoin(rechazos$).subscribe({
                          next: (resultados) => {
                              const exitosos = resultados.filter(r => r.success).length;
                              if (exitosos > 0) {
                                  functionsAlert.success(`${exitosos} perfil(es) rechazado(s)`);
                                  this.dialogRef.close("OK");
                              } else {
                                  functionsAlert.error('No se pudo rechazar ningún perfil');
                              }
                          },
                          error: (err) => {
                              console.error('Error en forkJoin:', err);
                              functionsAlert.error('Error al procesar los rechazos');
                          }
                      });
                  }, (error) => {
                      console.error('Error al crear el historial de asignación:', error);
                      functionsAlert.error('Error al registrar la acción de rechazo');
                  });
              }
          });
          return;
          }
        }
        // 2. Para otros tipos (rechazo normal)
        msj = '¿Está seguro de que desea desaprobar la evaluación?';
        if (this.validarForm()) return;
    }

    // Lógica aprobación
    functionsAlert.questionSiNo(msj).then((result) => {
        if (result.isConfirmed) {
            const obj = {
                idAsignacion: this.asignacion.idAsignacion,
                evaluacion: { codigo: tipo },
                observacion: this.formGroup.controls.observacion.value
            };

            this.evaluadorService.evaluarAccion(obj).subscribe({
                next: (res) => {
                    functionsAlert.success('Guardado').then(() => {
                        this.dialogRef.close("OK");
                        
                        if (tipo === 'APROBADO') {
                            this.evaluadorService.obtenerIdArchivo(this.solicitud.numeroExpediente).subscribe({
                                next: (res) => {
                                    if (res != 0) {
                                        const token = { usuario: sessionStorage.getItem("USUARIO") };
                                        this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe({
                                            next: (parameter) => {
                                                this.dialog.open(ModalFirmaDigitalComponent, {
                                                    width: '605px',
                                                    data: {
                                                        action: parameter.action,
                                                        loginUsuario: parameter.loginUsuario,
                                                        passwordUsuario: parameter.passwordUsuario,
                                                        archivosFirmar: res.toString()
                                                    }
                                                });
                                            },
                                            error: (err) => console.error('Error obteniendo parámetros de firma:', err)
                                        });
                                    }
                                },
                                error: (err) => console.error('Error obteniendo ID archivo:', err)
                            });
                        }
                    });
                },
                error: (err) => {
                    functionsAlert.error('Error al procesar la acción');
                }
            });
        }
    });
}

}
