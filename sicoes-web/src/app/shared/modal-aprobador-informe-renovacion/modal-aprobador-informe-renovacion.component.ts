import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { firstValueFrom } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { InformeRenovacionService } from 'src/app/service/informe-renovacion.service';
import { FirmaDigitalService } from 'src/app/service/firma-digital.service';
import { SolicitudService } from 'src/app/service/solicitud.service';

@Component({
  selector: 'app-modal-aprobador-informe-renovacion',
  templateUrl: './modal-aprobador-informe-renovacion.component.html',
  styleUrls: ['./modal-aprobador-informe-renovacion.component.scss']
})
export class ModalAprobadorInformeRenovacionComponent extends BaseComponent implements OnInit {

  observacionControl = new FormControl('', [Validators.maxLength(500)]);

  progreso: number = 0;
  loadingAccion: boolean = false;
  errores: string[] = [];

  usuario$: any;
  
  // Información del tipo de aprobador obtenida del backend
  tipoAprobadorInfo: any = null;
  esAprobadorG1 = false;
  esAprobadorG2 = false;
  esAprobadorG3 = false;
  usuario: AuthUser;
  archivoSeleccionado: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorInformeRenovacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      tipo: string;
      accion: string;
      elementosSeleccionados: any[];
    },
    private informeRenovacionService: InformeRenovacionService,
    private authFacade: AuthFacade,
    private firmaDigitalService: FirmaDigitalService,
    private solicitudService: SolicitudService
  ) {
    super();
  }

  ngOnInit(): void {
    this.usuario$ = this.authFacade.user$;
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
      
      // Obtener tipo de aprobador del backend
      this.obtenerTipoAprobadorDelBackend();
    });

    if (this.data.elementosSeleccionados.length === 0) {
      this.observacionControl.disable();
    }
  }

  obtenerTextoModalSegunCantidad(): string {
    const cantidadInformes = this.data.elementosSeleccionados.length;
    return cantidadInformes === 1 
      ? '¿Qué acción desea realizar sobre el siguiente informe de renovación seleccionado?'
      : '¿Qué acción desea realizar sobre los siguientes informes de renovación seleccionados?';
  }

  obtenerTextoListaSegunCantidad(): string {
    const cantidadInformes = this.data.elementosSeleccionados.length;
    return cantidadInformes === 1 
      ? 'Informe de renovación a afectar:'
      : 'Informes de renovación a afectar:';
  }

  cancelar(): void {
    this.dialogRef.close('cancel');
  }

  validarObservacion(): boolean {
    if (!this.observacionControl.valid) {
      this.observacionControl.markAsTouched();
      return true;
    }
    return false;
  }

  esRolG1(): boolean {
    if (this.usuario?.roles) {
      // G1 - Aprobador técnico (Jefe de Línea) - CO_ROL = "05"
      return this.usuario.roles.some(rol => 
        rol.codigo === '05' && (rol.descripcion?.includes('Jefe') || rol.descripcion?.includes('G1'))
      );
    }
    return false;
  }

  esRolG1OG2(): boolean {
    if (this.usuario?.roles) {
      // Debug: Log para ver los roles del usuario
      console.log('Roles del usuario:', this.usuario.roles.map(r => ({ codigo: r.codigo, descripcion: r.descripcion })));
      
      // Verificar si tiene roles de aprobador técnico (G1/G2) - CO_ROL = "05"
      return this.usuario.roles.some(rol => 
        rol.codigo === '05' // Aprobador Técnico (tanto G1 como G2 usan este código)
      );
    }
    return false;
  }

  esRolG2(): boolean {
    console.log('esRolG2() - Usuario:', this.usuario);
    console.log('esRolG2() - Roles:', this.usuario?.roles?.map(r => ({ codigo: r.codigo, descripcion: r.descripcion })));
    if (this.usuario?.roles) {
      // G2 - Aprobador técnico (Gerente de División) - CO_ROL = "05"
      // Distinguir G2 de G1 por descripción o contexto adicional
      const esG2 = this.usuario.roles.some(rol => 
        rol.codigo === '05' && (
          rol.descripcion?.includes('Gerente') || 
          rol.descripcion?.includes('G2') ||
          rol.descripcion?.includes('División')
        )
      );
      console.log('esRolG2() - ¿Es G2?:', esG2);
      return esG2;
    }
    console.log('esRolG2() - No hay roles, retornando false');
    return false;
  }

  esRolG3(): boolean {
    if (this.usuario?.roles) {
      // G3 - Responsable Aprobador GSE - CO_ROL = "14"
      return this.usuario.roles.some(rol => 
        rol.codigo === '14' || (rol.codigo === '05' && rol.descripcion?.includes('GSE'))
      );
    }
    return false;
  }

  esEvaluadorTecnico(): boolean {
    if (this.usuario?.roles) {
      // Evaluador Técnico - CO_ROL = "04"
      return this.usuario.roles.some(rol => 
        rol.codigo === '04'
      );
    }
    return false;
  }

  esUsuarioExterno(): boolean {
    if (this.usuario?.roles) {
      // Usuario Externo (Empresa Supervisora) - CO_ROL = "06"
      return this.usuario.roles.some(rol => 
        rol.codigo === '06'
      );
    }
    return false;
  }
  async adjuntarArchivo (): Promise<void> {

    console.log("adjuntarArchivo");
  }

  onFileSelectedPersonal(ev: any): void {
    const file = ev.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('tipoRequisito', 'name');

  }
  descargar(): void {
    console.log('Descargando archivo:');
  }
  eliminarPersonalDoc(): void {
    console.log('Eliminando archivo:');
  }

  async realizarAccion(tipoAccion: string): Promise<void> {
    this.errores = [];
    const cantidadInformes = this.data.elementosSeleccionados.length;
    const informeTexto = cantidadInformes === 1 ? 'el informe de renovación seleccionado' : 'los informes de renovación seleccionados';
    let msj = `¿Está seguro de que desea ${tipoAccion.toLowerCase()} ${informeTexto}?`;

    // Observación es opcional para todas las acciones

    functionsAlert.questionSiNo(msj).then(async (result) => {
      if (result.isConfirmed) {
        this.loadingAccion = true;
        this.progreso = 0;

        try {
          if (tipoAccion === 'APROBAR') {
            // Determinar si es aprobador G2
            const esG2 = this.esAprobadorG2 || this.esRolG2();
            console.log('¿Es aprobador G2?:', esG2);
            
            if (esG2) {
              console.log('Usuario ES G2 - Solo firma, aprobación después');
              // Para G2: Solo mostrar firma, NO llamar endpoint aún
              this.progreso = 50;
              this.activarFirmaDigitalG2();
            } else {
              console.log('Usuario NO es G2 - Aprobación inmediata');
              // Para no-G2: Llamar endpoint inmediatamente
              const idRequerimientosAprobacion = this.data.elementosSeleccionados.map(informe => 
                informe.idRequermientoAprobacion || informe.idInformeRenovacion
              );

              const requestPayload = {
                idRequerimientosAprobacion: idRequerimientosAprobacion,
                observacion: this.observacionControl.value || ''
              };

              console.log('Llamando al endpoint de aprobación inmediata con payload:', requestPayload);
              
              await firstValueFrom(
                this.solicitudService.aprobarInformesRenovacionBandeja(requestPayload)
              );
              
              console.log('Endpoint de aprobación llamado exitosamente');

              this.progreso = 100;
              const cantidadInformes = this.data.elementosSeleccionados.length;
              const mensajeExito = cantidadInformes === 1 
                ? 'El informe ha sido aprobado exitosamente.'
                : 'Los informes han sido aprobados exitosamente.';
                
              functionsAlert.success(mensajeExito).then(() => {
                // Enviar notificación para no-G2
                this.enviarNotificacion(1); // ID para aprobación
                this.dialogRef.close('OK');
              });
            }

          } else if (tipoAccion === 'RECHAZAR') {
            // Para rechazar, continuar con el proceso individual por ahora
            const totalInformes = this.data.elementosSeleccionados.length;
            let informesProcesados = 0;

            for (const informe of this.data.elementosSeleccionados) {
              const requestPayload = {
                idInformeRenovacion: informe.idInformeRenovacion,
                motivoRechazo: this.observacionControl.value || '',
                idUsuario: this.usuario?.idUsuario,
                observacion: this.observacionControl.value || '',
                idGrupoAprobador: 3
              };

              try {
                await firstValueFrom(
                  this.informeRenovacionService.rechazarInformeRenovacion(requestPayload)
                );
              } catch (error) {
                console.error(`Error al rechazar el informe ${informe.numeroExpedienteR}:`, error);
                this.errores.push(informe.numeroExpedienteR);
              }

              informesProcesados++;
              this.progreso = Math.round((informesProcesados / totalInformes) * 100);
            }

            this.finalizarProceso(tipoAccion);
          }

        } catch (error: any) {
          console.error('Error al procesar informes:', error);
          
          // Manejar errores de validación del backend
          if (error?.error?.meta?.mensajes) {
            const mensajesError = error.error.meta.mensajes
              .filter(m => m.tipo === 'ERROR')
              .map(m => m.message)
              .join('\n');
            functionsAlert.error(mensajesError || 'Error al procesar los informes');
          } else {
            functionsAlert.error('Error al procesar los informes. Por favor, intente nuevamente.');
          }
          
          this.loadingAccion = false;
        }
      }
    });
  }

  private finalizarProceso(tipoAccion: string): void {
    this.loadingAccion = false;

    if (this.errores.length > 0) {
      let errorMessage = 'Hubo errores al procesar los siguientes expedientes: ' + this.errores.join(', ');
      if (this.errores.length === this.data.elementosSeleccionados.length && this.data.elementosSeleccionados.length === 1) {
        errorMessage = 'Error al procesar el expediente: ' + this.errores[0];
      }
      functionsAlert.error(errorMessage);
      this.dialogRef.close('OK');
    } else {
      if (tipoAccion === 'RECHAZAR') {
        // Para rechazo, mostrar modal personalizado
        this.mostrarModalRechazoExitoso();
      } else {
        // Para otras acciones, usar alert normal
        functionsAlert.success('Acción completada con éxito.').then(() => {
          this.dialogRef.close('OK');
        });
      }
    }
  }

  private mostrarModalRechazoExitoso(): void {
    functionsAlert.info('Se ha registrado el rechazo del informe').then(() => {
      this.enviarNotificacion(2); // ID para rechazo
      this.dialogRef.close('OK');
    });
  }



  /**
   * Activar firma digital para G2 - SIN llamar endpoint primero
   * El endpoint de aprobación se llama DESPUÉS de la firma exitosa
   */
  private async activarFirmaDigitalG2(): Promise<void> {
    try {
      console.log('G2: Iniciando SOLO firma digital, sin aprobación previa...');
      const result = await this.firmaDigitalService.firmarInformesRenovacion(
        this.data.elementosSeleccionados
      );
      
      result.subscribe({
        next: async (resultado) => {
          if (resultado === 'success') {
            console.log('G2: Firma exitosa, AHORA sí llamando endpoint de aprobación...');
            this.progreso = 75;
            
            // AHORA SÍ llamar al endpoint de aprobación
            await this.procesarAprobacionPostFirma();
          } else {
            console.log('G2: Firma cancelada o falló');
            this.loadingAccion = false;
            functionsAlert.info('El proceso fue cancelado.');
            this.dialogRef.close('cancel');
          }
        },
        error: (error) => {
          console.error('G2: Error en firma digital:', error);
          this.loadingAccion = false;
          functionsAlert.error('Error en el proceso de firma digital: ' + (error?.message || 'Error desconocido'));
          this.dialogRef.close('cancel');
        }
      });
    } catch (error) {
      console.error('G2: Error iniciando firma digital:', error);
      this.loadingAccion = false;
      functionsAlert.error('No se pudo iniciar la firma digital: ' + (error?.message || error?.toString() || 'Error desconocido'));
      this.dialogRef.close('cancel');
    }
  }

  /**
   * Procesa la aprobación después de que la firma fue exitosa (para G2)
   */
  private async procesarAprobacionPostFirma(): Promise<void> {
    try {
      console.log('Procesando aprobación post-firma para G2...');
      
      const idRequerimientosAprobacion = this.data.elementosSeleccionados.map(informe => 
        informe.idRequermientoAprobacion || informe.idInformeRenovacion
      );

      const requestPayload = {
        idRequerimientosAprobacion: idRequerimientosAprobacion,
        observacion: this.observacionControl.value || ''
      };

      console.log('Llamando al endpoint de aprobación post-firma con payload:', requestPayload);
      
      await firstValueFrom(
        this.solicitudService.aprobarInformesRenovacionBandeja(requestPayload)
      );
      
      console.log('Aprobación post-firma completada exitosamente');

      this.progreso = 100;
      this.loadingAccion = false;
      
      const cantidadInformes = this.data.elementosSeleccionados.length;
      const mensajeExito = cantidadInformes === 1 
        ? 'El informe ha sido firmado y aprobado exitosamente.'
        : 'Los informes han sido firmados y aprobados exitosamente.';
        
      functionsAlert.success(mensajeExito).then(() => {
        // Enviar notificación para G2
        this.enviarNotificacion(1); // ID para aprobación
        this.dialogRef.close('OK');
      });
      
    } catch (error) {
      console.error('Error en aprobación post-firma:', error);
      this.loadingAccion = false;
      functionsAlert.error('La firma fue exitosa, pero hubo un error en la aprobación: ' + (error?.message || 'Error desconocido'));
      this.dialogRef.close('cancel');
    }
  }

  private async activarFirmaDigital(): Promise<void> {
    try {
      const result = await this.firmaDigitalService.firmarInformesRenovacion(
        this.data.elementosSeleccionados
      );
      
      result.subscribe({
        next: (resultado) => {
          if (resultado === 'success') {
            console.log('Firma digital completada exitosamente');
            // Registrar firma completada en base de datos
            this.registrarFirmaCompletada();
          } else {
            console.log('Firma digital cancelada o falló');
            // Aún así enviar notificación porque la aprobación ya se completó
            this.enviarNotificacion(1); // ID para aprobación
            this.dialogRef.close('OK');
          }
        },
        error: (error) => {
          console.error('Error en firma digital:', error);
          functionsAlert.info('La aprobación se completó, pero hubo un problema con la firma digital.');
          // Enviar notificación aunque la firma haya fallado, porque la aprobación ya se completó
          this.enviarNotificacion(1); // ID para aprobación
          this.dialogRef.close('OK');
        }
      });
    } catch (error) {
      console.error('Error iniciando firma digital:', error);
      functionsAlert.info('La aprobación se completó, pero no se pudo iniciar la firma digital: ' + (error?.message || error?.toString() || 'Error desconocido'));
      // Enviar notificación aunque la firma no se haya podido iniciar
      this.enviarNotificacion(1); // ID para aprobación
      this.dialogRef.close('OK');
    }
  }

  private enviarNotificacion(idTipoNotifica: number): void {
    this.informeRenovacionService.notificarRenovacionInforme(idTipoNotifica).subscribe({
      next: (response) => {
        console.log('Notificación enviada exitosamente:', response);
      },
      error: (error) => {
        console.error('Error al enviar notificación:', error);
        // No mostramos error al usuario ya que es un proceso secundario
      }
    });
  }

  async solicitarPerfeccionamientoContrato(): Promise<void> {
    if (this.data.elementosSeleccionados.length === 0) {
      functionsAlert.info('Debe seleccionar al menos un informe para procesar la solicitud.');
      return;
    }

    const mensajeConfirmacion = '¿Está seguro de que desea generar la solicitud de perfeccionamiento de contrato?';

    functionsAlert.questionSiNo(mensajeConfirmacion).then(async (result) => {
      if (result.isConfirmed) {
        this.loadingAccion = true;

        try {
          const requestPayload = {
            informesIds: this.data.elementosSeleccionados.map(informe => informe.idInformeRenovacion),
            idUsuario: this.usuario?.idUsuario,
            observacion: this.observacionControl.value || '',
            fechaSolicitud: new Date().toISOString()
          };

          await firstValueFrom(
            this.informeRenovacionService.solicitudPerfeccionamientoContrato(requestPayload)
          );

          this.loadingAccion = false;
          functionsAlert.success('Solicitud de perfeccionamiento de contrato generada exitosamente.').then(() => {
            // Enviar notificación específica para perfeccionamiento de contrato
            this.enviarNotificacion(3); // ID para perfeccionamiento de contrato
            this.dialogRef.close('OK');
          });

        } catch (error) {
          this.loadingAccion = false;
          console.error('Error al generar solicitud de perfeccionamiento:', error);
          
          let mensajeError = 'Error al generar la solicitud de perfeccionamiento de contrato.';
          if (error?.error?.message) {
            mensajeError = error.error.message;
          }
          
          functionsAlert.error(mensajeError);
        }
      }
    });
  }

  /**
   * Obtiene el tipo de aprobador del backend y actualiza las propiedades del componente
   */
  private obtenerTipoAprobadorDelBackend(): void {
    this.solicitudService.obtenerTipoAprobadorBackend().subscribe({
      next: (response) => {
        console.log('Tipo de aprobador obtenido del backend:', response);
        this.tipoAprobadorInfo = response;
        this.esAprobadorG1 = response.esAprobadorG1 || false;
        this.esAprobadorG2 = response.esAprobadorG2 || false;
        this.esAprobadorG3 = response.esAprobadorG3 || false;
      },
      error: (error) => {
        console.error('Error al obtener tipo de aprobador del backend:', error);
        // Mantener identificación por roles como fallback
        this.esAprobadorG1 = this.esRolG1();
        this.esAprobadorG2 = this.esRolG2();
        this.esAprobadorG3 = false; // Fallback básico
      }
    });
  }

  /**
   * Registra en base de datos que la firma digital fue completada exitosamente
   */
  private registrarFirmaCompletada(): void {
    console.log('Registrando firma completada en base de datos...');
    
    // Procesar cada informe firmado
    const promises = this.data.elementosSeleccionados.map(informe => {
      const requestPayload = {
        idInformeRenovacion: informe.idInformeRenovacion,
        idUsuario: this.usuario?.idUsuario,
        observacion: this.observacionControl.value || '',
        firmaCompletada: true,
        fechaFirma: new Date().toISOString()
      };

      console.log('Registrando firma para informe:', requestPayload);
      
      return firstValueFrom(
        this.informeRenovacionService.aprobarInformeRenovacion(requestPayload)
      );
    });

    Promise.all(promises).then(() => {
      console.log('Firma registrada exitosamente en base de datos');
      // Después de registrar la firma, enviar notificación
      this.enviarNotificacion(1); // ID para aprobación
      this.dialogRef.close('OK');
    }).catch(error => {
      console.error('Error al registrar firma en base de datos:', error);
      // Aún así enviar notificación
      this.enviarNotificacion(1); // ID para aprobación
      this.dialogRef.close('OK');
    });
  }
}