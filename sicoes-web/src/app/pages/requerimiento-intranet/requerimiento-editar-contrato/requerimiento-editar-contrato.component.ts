import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { RequerimientoService } from 'src/app/service/requerimiento.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-requerimiento-editar-contrato',
  templateUrl: './requerimiento-editar-contrato.component.html',
  styleUrls: ['./requerimiento-editar-contrato.component.scss']
})
export class RequerimientoEditarContratoComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  contratoForm!: FormGroup;
  contratoSeleccionadoId: number | null = null;
  tipoRequisitoOptions: any[] = [
    { value: 'Acta de inicio', viewValue: 'Acta de inicio' },
    { value: 'Contrato', viewValue: 'Contrato' },
    { value: 'Adenda', viewValue: 'Adenda' },
    { value: 'Informe Final', viewValue: 'Informe Final' }
  ];
  archivosAdjuntosDataSource = new MatTableDataSource<any>([]);
  displayedAdjuntosColumns: string[] = ['requisito', 'nombreArchivo', 'acciones'];
  uuidContrato!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adjuntoService: AdjuntosService,
    private requerimientoService: RequerimientoService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.uuidContrato = this.route.snapshot.paramMap.get('requerimientoUuid')!;
    this.contratoForm = this.fb.group({
      fechaSuscripcion: [''],
      fechaInicio: [''],
      fechaFin: [''],
      numeroContrato: ['', Validators.required],
      tipoRequisito: ['']
    });
  }

  descargarContrato(): void { }
  adjuntarArchivo(): void {
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

      const newAttachment: any = {
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
  descargarArchivo(element: any): void { }
  eliminarArchivo(index: number): void { }
  guardarContrato(): void {
    if (this.contratoForm.invalid || !this.uuidContrato) return;

    const formValue = this.contratoForm.value;

    const payload = {
      fechaSuscripcion: this.formatDate(formValue.fechaSuscripcion),
      fechaInicio: this.formatDate(formValue.fechaInicio),
      fechaFin: this.formatDate(formValue.fechaFin),
      archivos: [{ idArchivo: 12345 }]
    };

    this.requerimientoService.editarContrato(this.uuidContrato, payload).subscribe({
      next: () => functionsAlert.success('Contrato actualizado correctamente.'),
      error: () => functionsAlert.error('Error al actualizar el contrato.')
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  regresar(): void {
    this.router.navigate(['/', Link.INTRANET, Link.CONTRATOS_LIST]);
  }

  get numeroContrato() {
    return this.contratoForm.get('numeroContrato');
  }

}
