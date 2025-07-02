import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ContratoService } from 'src/app/service/contrato.service';
import { finalize } from 'rxjs/operators';
import { ContratoDetalle } from 'src/app/interface/contrato.model';
import { DatePipe } from '@angular/common';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { Contrato, FormatoLocal } from 'src/helpers/constantes.components';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { ArchivoAdjuntoBackendDTO } from 'src/app/interface/adjuntos.model';
import { Link } from 'src/helpers/internal-urls.components';

interface TipoRequisitoOption {
  value: string;
  viewValue: string;
}

interface AdjuntoTabla {
  idArchivo?: number;
  requisito: string;
  nombreArchivo: string
  codigo?: string;
  file?: File;
}

@Component({
  selector: 'app-bandeja-contratos-procesar',
  templateUrl: './bandeja-contratos-procesar.component.html',
  styleUrls: ['./bandeja-contratos-procesar.component.scss']
})
export class BandejaContratosProcesarComponent implements OnInit {
  contratoSeleccionadoId: number | null = null;
  contratoForm: FormGroup;

  displayedAdjuntosColumns: string[] = ['requisito', 'nombreArchivo', 'acciones'];
  archivosAdjuntosDataSource = new MatTableDataSource<AdjuntoTabla>([]);

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  isLoadingData = false;
  isSavingData = false;
  isUploadingAdjunto = false;

  tipoRequisitoOptions: TipoRequisitoOption[] = [
    { value: 'Acta de inicio', viewValue: 'Acta de inicio' },
    { value: 'Contrato', viewValue: 'Contrato' },
    { value: 'Adenda', viewValue: 'Adenda' },
    { value: 'Informe Final', viewValue: 'Informe Final' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private datePipe: DatePipe,
    private adjuntoService: AdjuntosService,
    private snackBar: MatSnackBar
  ) {
    this.contratoForm = this.fb.group({
      fechaSuscripcion: [null, Validators.required],
      fechaInicio: [null],
      fechaFin: [null],
      numeroContrato: [null, [Validators.pattern('^[0-9]*$')]],
      tipoRequisito: [null],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.contratoSeleccionadoId = +idParam;
        this.cargarDatosContrato(this.contratoSeleccionadoId);
        this.cargarAdjuntosExistentes(this.contratoSeleccionadoId);
      } else {
        console.warn('No se encontró ID de contrato en la URL.');
        this.snackBar.open('No se pudo determinar el contrato. Por favor, intente de nuevo.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  get numeroContrato() {
    return this.contratoForm.get('numeroContrato');
  }

  allowNumbers(event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  cargarDatosContrato(id: number) {
    this.isLoadingData = true;
    this.contratoService.obtenerContratoDetallePorId(id)
      .pipe(
        finalize(() => this.isLoadingData = false)
      )
      .subscribe({
        next: (contrato: ContratoDetalle) => {
          this.contratoForm.patchValue({
            fechaSuscripcion: this.parseDDMMYYYYtoDate(contrato.fechaSuscripcionContrato),
            fechaInicio: this.parseDDMMYYYYtoDate(contrato.fechaInicioContrato),
            fechaFin: this.parseDDMMYYYYtoDate(contrato.fechaFinalContrato),
            numeroContrato: contrato.numeroContratoSap
          });
          console.log('Datos del contrato cargados:', contrato);
        },
        error: (err) => {
          console.error('Error al cargar los datos del contrato:', err);
          this.snackBar.open('Error al cargar los datos del contrato.', 'Cerrar', { duration: 3000 });
        }
      });
  }

  private parseDDMMYYYYtoDate(dateString: string): Date | null {
    if (!dateString) {
      return null;
    }
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year) || parts.length !== 3) {
      console.warn(`Formato de cadena de fecha inválido recibido: ${dateString}`);
      return null;
    }

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      console.warn(`Creación de objeto Date no coincide para: ${dateString}. Resultado: ${date}`);
      return null;
    }

    return date;
  }

  cargarAdjuntosExistentes(idContrato: number) {
    if (idContrato === null) {
      console.warn('No se puede cargar adjuntos: ID de contrato no definido.');
      return;
    }

    this.isLoadingData = true;
    this.adjuntoService.obtenerAdjuntosPorContrato(idContrato)
      .pipe(
        finalize(() => this.isLoadingData = false)
      )
      .subscribe({
        next: (adjuntos: ArchivoAdjuntoBackendDTO[]) => {
          this.archivosAdjuntosDataSource.data = adjuntos.map(adj => ({
            idArchivo: adj.idArchivo,
            requisito: adj.nombre,
            nombreArchivo: adj.nombreReal,
            codigo: adj.codigo
          }));
          console.log('Adjuntos existentes cargados:', this.archivosAdjuntosDataSource.data);
        },
        error: (err) => {
          console.error('Error al cargar adjuntos existentes:', err);
          this.snackBar.open('Error al cargar los adjuntos existentes.', 'Cerrar', { duration: 3000 });
        }
      });
  }

  guardarContrato() {

    if (this.contratoForm.invalid) {
      console.error('Formulario principal inválido. Revise los campos de fechas y número de contrato.');
      this.contratoForm.markAllAsTouched();
      this.snackBar.open('Por favor, complete la fecha de suscripción de contrato.', 'Cerrar', { duration: 3000 });
      return;
    }

    const formValue = this.contratoForm.value;
    const formattedDates: any = {};

    if (formValue.fechaSuscripcion) {
      formattedDates.fechaSuscripcionContrato = this.datePipe.transform(formValue.fechaSuscripcion, 'dd/MM/yyyy');
    }
    if (formValue.fechaInicio) {
      formattedDates.fechaInicioContrato = this.datePipe.transform(formValue.fechaInicio, 'dd/MM/yyyy');
    }
    if (formValue.fechaFin) {
      formattedDates.fechaFinalContrato = this.datePipe.transform(formValue.fechaFin, 'dd/MM/yyyy');
    }

    const contratoParaActualizar: ContratoDetalle = {
      idContrato: this.contratoSeleccionadoId,
      numeroContratoSap: formValue.numeroContrato,
      fechaSuscripcionContrato: formattedDates.fechaSuscripcionContrato,
      fechaInicioContrato: formattedDates.fechaInicioContrato,
      fechaFinalContrato: formattedDates.fechaFinalContrato,
    };

    this.isSavingData = true;
    this.contratoService.actualizarContratoDetalle(contratoParaActualizar)
      .pipe(
        finalize(() => this.isSavingData = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Contrato principal actualizado exitosamente:', response);
          this.snackBar.open('Contrato principal actualizado exitosamente.', 'Cerrar', { duration: 3000 });
          const archivosParaSubir = this.archivosAdjuntosDataSource.data.filter(adj => adj.file);

          if (!(archivosParaSubir.length === 0)) {
            this.subirArchivosAdjuntosPendientes();
          }

        },
        error: (err) => {
          console.error('Error al actualizar el contrato:', err);
          this.snackBar.open('Error al actualizar el contrato.', 'Cerrar', { duration: 3000 });
        }
      });
  }

  subirArchivosAdjuntosPendientes() {
    if (this.contratoSeleccionadoId === null) {
      this.snackBar.open('No se puede subir adjuntos sin un ID de contrato válido.', 'Cerrar', { duration: 3000 });
      return;
    }

    const archivosParaSubir = this.archivosAdjuntosDataSource.data.filter(adj => adj.file);

    if (archivosParaSubir.length === 0) {
      this.snackBar.open('No hay nuevos archivos adjuntos para subir.', 'Cerrar', { duration: 2000 });
      // Después de guardar el contrato y si no hay adjuntos nuevos, puedes navegar
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

    this.isUploadingAdjunto = true;
    const uploadObservables = archivosParaSubir.map(adjunto => {
      const formData = new FormData();
      formData.append('file', adjunto.file);
      formData.append('tipoRequisito', adjunto.requisito);
      return this.adjuntoService.subirAdjuntoContratos(this.contratoSeleccionadoId!, formData);
    });

    forkJoin(uploadObservables)
      .pipe(
        finalize(() => this.isUploadingAdjunto = false)
      )
      .subscribe({
        next: (responses: ArchivoAdjuntoBackendDTO[]) => {
          console.log('Todos los adjuntos subidos exitosamente:', responses);
          this.snackBar.open('Todos los adjuntos se subieron exitosamente.', 'Cerrar', { duration: 3000 });

          this.archivosAdjuntosDataSource.data = this.archivosAdjuntosDataSource.data.map(adj => {
            const uploadedResponse = responses.find(res => res.nombreReal === adj.nombreArchivo && res.nombre === adj.requisito);
            if (uploadedResponse) {
              return {
                ...adj,
                idArchivo: uploadedResponse.idArchivo,
                codigo: uploadedResponse.codigo,
                file: undefined
              };
            }
            return adj;
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Error al subir uno o más adjuntos:', err);
          this.snackBar.open('Error al subir algunos adjuntos.', 'Cerrar', { duration: 4000 });
        }
      });
  }

  descargarContrato() {
    let nombre = 'CONTRATO.docx';
    this.adjuntoService.downloadFormato(Contrato.CONTRATO, nombre);
  }

  adjuntarArchivo() {
    if (this.contratoSeleccionadoId === null) {
      this.snackBar.open('Primero debe guardar el contrato para poder adjuntar archivos.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.contratoForm.get('tipoRequisito')?.invalid) {
      this.contratoForm.get('tipoRequisito')?.markAsTouched();
      this.snackBar.open('Debe seleccionar un tipo de requisito antes de adjuntar un archivo.', 'Cerrar', { duration: 3000 });
      return;
    }
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const tipoRequisito = this.contratoForm.get('tipoRequisito')?.value;

      const exts = ["pdf", "doc", "docx", "xls", "xlsx"];
      const fileName = file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

      if (!exts.includes(fileExtension)) {
        this.snackBar.open("El tipo o formato de archivo no es válido. Solo se permiten: PDF, Word y Excel.", 'Cerrar', { duration: 4000 });
        this.fileInput.nativeElement.value = "";
        return;
      }

      const maxSizeInBytes = 40 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.snackBar.open(`El archivo excede el peso permitido (${maxSizeInBytes / (1024 * 1024)} MB).`, 'Cerrar', { duration: 4000 });
        this.fileInput.nativeElement.value = "";
        return;
      }

      console.log('Archivo seleccionado:', file.name);

      const newAttachment: AdjuntoTabla = {
        requisito: tipoRequisito,
        nombreArchivo: file.name,
        file: file
      };

      const currentData = this.archivosAdjuntosDataSource.data;
      this.archivosAdjuntosDataSource.data = [...currentData, newAttachment];

      this.snackBar.open(`Archivo "${file.name}" adjuntado a la lista.`, 'Cerrar', { duration: 2000 });

      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  eliminarArchivo(index: number) {
    const currentData = this.archivosAdjuntosDataSource.data;
    const adjuntoToDelete = currentData[index];

    if (adjuntoToDelete.idArchivo && this.contratoSeleccionadoId) {
      this.adjuntoService.eliminarAdjuntoContrato(this.contratoSeleccionadoId, adjuntoToDelete.idArchivo)
        .subscribe({
          next: () => {
            console.log('Archivo eliminado del backend:', adjuntoToDelete.nombreArchivo);
            this.snackBar.open(`"${adjuntoToDelete.nombreArchivo}" eliminado exitosamente.`, 'Cerrar', { duration: 2000 });
            currentData.splice(index, 1);
            this.archivosAdjuntosDataSource.data = [...currentData];
          },
          error: (err) => {
            console.error('Error al eliminar archivo del backend:', err);
            this.snackBar.open('Error al eliminar el archivo.', 'Cerrar', { duration: 3000 });
          }
        });
    } else {
      const deletedFileName = adjuntoToDelete.nombreArchivo;
      currentData.splice(index, 1);
      this.archivosAdjuntosDataSource.data = [...currentData];
      this.snackBar.open(`"${deletedFileName}" eliminado de la lista local.`, 'Cerrar', { duration: 2000 });
      console.log('Archivo eliminado de la tabla en índice (local):', index);
    }
  }

  descargarArchivo(element: AdjuntoTabla) {
    if (element.codigo && element.nombreArchivo) {
      this.adjuntoService.descargarWindowsJWT(element.codigo, element.nombreArchivo);
    } else {
      this.snackBar.open('No se puede descargar el archivo: información incompleta (UUID o nombre faltante).', 'Cerrar', { duration: 3000 });
      console.warn('Intento de descarga con información incompleta:', element);
    }
  }

 regresar() {
    console.log('Intentando regresar a la bandeja de contratos (usando ruta absoluta confirmada)...');
    this.router.navigate(['/', Link.INTRANET, Link.BANDEJA_CONTRATOS_LIST])
      .then(success => {
        if (success) {
          console.log('Navegación a la bandeja de contratos exitosa!');
        } else {
          console.log('La navegación a la bandeja de contratos no fue exitosa (posiblemente la URL ya era la de destino).');
        }
      })
      .catch(err => {
        console.error('Error durante la navegación al regresar:', err);
        this.snackBar.open('Error al intentar regresar a la bandeja. Por favor, intente de nuevo.', 'Cerrar', { duration: 3000 });
      });
  }
}