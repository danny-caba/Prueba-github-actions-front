import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { functionsAlert } from 'src/helpers/functionsAlert';

export interface ArchivoFirma {
  id: string;
  nombre?: string;
}

export interface ResultadoFirma {
  idArchivoOriginal: string;
  idArchivoFirmado: string;
}

export interface ParametrosFirma {
  action: string;
  loginUsuario: string;
  passwordUsuario: string;
}

type EstadoProceso = 'preparando' | 'listo' | 'firmando' | 'exitoso' | 'error' | 'cancelado';

@Component({
  selector: 'vex-modal-firma-digital-enhanced',
  templateUrl: './modal-firma-digital-enhanced.component.html',
  styleUrls: ['./modal-firma-digital-enhanced.component.scss']
})
export class ModalFirmaDigitalEnhancedComponent implements OnInit, OnDestroy {

  estado: EstadoProceso = 'preparando';
  archivosParaFirmar: ArchivoFirma[] = [];
  parametrosFirma: ParametrosFirma;
  resultadosFirma: ResultadoFirma[] = [];
  mensajeError: string = '';
  
  archivosProcesados: number = 0;
  totalArchivos: number = 0;

  private messageListener: (event: MessageEvent) => void;

  constructor(
    private dialogRef: MatDialogRef<ModalFirmaDigitalEnhancedComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      archivos: string[] | ArchivoFirma[];  // Lista de IDs o objetos con ID y nombre
      parametros: ParametrosFirma;
    }
  ) {
    this.parametrosFirma = data.parametros;
    this.procesarArchivos();
    
    // Bind del listener para mantener el contexto
    this.messageListener = this.onReceiveResultCallback.bind(this);
  }

  ngOnInit(): void {
    this.prepararDocumentos();
  }

  ngOnDestroy(): void {
    // Limpiar el listener al destruir el componente
    window.removeEventListener('message', this.messageListener, false);
  }

  private procesarArchivos(): void {
    if (!this.data.archivos || this.data.archivos.length === 0) {
      this.estado = 'error';
      this.mensajeError = 'No se proporcionaron archivos para firmar.';
      return;
    }

    this.totalArchivos = this.data.archivos.length;
    
    this.archivosParaFirmar = this.data.archivos.map(archivo => {
      if (typeof archivo === 'string') {
        return { id: archivo };
      }
      return archivo;
    });
  }

  private async prepararDocumentos(): Promise<void> {
    try {
      // Simular preparación de documentos
      for (let i = 0; i < this.archivosParaFirmar.length; i++) {
        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 300));
        this.archivosProcesados = i + 1;
      }
      
      this.estado = 'listo';
    } catch (error) {
      this.estado = 'error';
      this.mensajeError = 'Error al preparar los documentos para firma.';
      console.error('Error preparando documentos:', error);
    }
  }

  iniciarProceso(): void {
    if (!this.parametrosFirma?.action) {
      this.estado = 'error';
      this.mensajeError = 'No se encontraron los parámetros de configuración para la firma digital.';
      return;
    }

    this.estado = 'firmando';
    
    // Configurar el listener para recibir mensajes del iframe
    window.addEventListener('message', this.messageListener, false);
    
    // Configurar y enviar el formulario
    this.configurarFormulario();
    
    setTimeout(() => {
      this.enviarFormulario();
    }, 500);
  }

  private configurarFormulario(): void {
    const formulario = document.querySelector('#formulario') as HTMLFormElement;
    const loginInput = document.querySelector('#loginUsuario') as HTMLInputElement;
    const passwordInput = document.querySelector('#passwordUsuario') as HTMLInputElement;
    
    if (!formulario || !loginInput || !passwordInput) {
      this.estado = 'error';
      this.mensajeError = 'Error interno: no se pudo configurar el formulario.';
      return;
    }

    // Configurar la acción del formulario
    formulario.setAttribute('action', this.parametrosFirma.action);
    
    // Configurar credenciales
    loginInput.value = this.parametrosFirma.loginUsuario;
    passwordInput.value = this.parametrosFirma.passwordUsuario;
    
    // Limpiar inputs de archivos existentes
    const existingFileInputs = formulario.querySelectorAll('input[name="archivosFirmar"]');
    existingFileInputs.forEach(input => input.remove());
    
    // Agregar inputs para cada archivo
    this.archivosParaFirmar.forEach(archivo => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'archivosFirmar';
      input.value = archivo.id;
      formulario.appendChild(input);
    });
  }

  private enviarFormulario(): void {
    try {
      const formulario = document.querySelector('#formulario') as HTMLFormElement;
      if (formulario) {
        formulario.submit();
      } else {
        throw new Error('Formulario no encontrado');
      }
    } catch (error) {
      this.estado = 'error';
      this.mensajeError = 'Error al enviar el formulario de firma digital.';
      console.error('Error enviando formulario:', error);
    }
  }

  private onReceiveResultCallback(event: MessageEvent): void {
    // Validar origen del mensaje por seguridad
    if (!event.origin || event.origin === 'null') {
      return;
    }

    try {
      const respuesta = JSON.parse(event.data);
      
      switch (respuesta.resultado) {
        case 0: // Éxito
          this.estado = 'exitoso';
          this.resultadosFirma = respuesta.mensaje || [];
          this.mostrarMensajeExito();
          break;
          
        case 1: // Cancelación
          this.estado = 'cancelado';
          break;
          
        case -1: // Error
        default:
          this.estado = 'error';
          this.mensajeError = respuesta.mensaje || 'Error desconocido en el proceso de firma.';
          break;
      }
    } catch (error) {
      this.estado = 'error';
      this.mensajeError = 'Error al procesar la respuesta del sistema de firma: ' + event.data;
      console.error('Error procesando respuesta:', error);
    }
    
    // Limpiar el listener después de recibir la respuesta
    window.removeEventListener('message', this.messageListener, false);
  }

  private mostrarMensajeExito(): void {
    const totalFirmados = this.resultadosFirma.length;
    const mensaje = `Se ${totalFirmados === 1 ? 'firmó' : 'firmaron'} exitosamente ${totalFirmados} ${totalFirmados === 1 ? 'documento' : 'documentos'}.`;
    
    functionsAlert.success(mensaje);
  }

  cancelar(): void {
    if (this.estado === 'firmando') {
      functionsAlert.info('No se puede cancelar el proceso mientras se está firmando. Por favor, complete o cancele el proceso en la ventana de firma.');
      return;
    }
    
    this.dialogRef.close('cancel');
  }

  cerrar(): void {
    const resultado = this.estado === 'exitoso' ? 'success' : this.estado;
    this.dialogRef.close(resultado);
  }
}