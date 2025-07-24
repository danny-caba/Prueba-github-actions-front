import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'vex-requerimiento-editar-contrato',
  templateUrl: './requerimiento-editar-contrato.component.html',
  styleUrls: ['./requerimiento-editar-contrato.component.scss']
})
export class RequerimientoEditarContratoComponent implements OnInit {


  contratoForm!: FormGroup;
  contratoSeleccionadoId: number | null = null;
  tipoRequisitoOptions = [];

  archivosAdjuntosDataSource = new MatTableDataSource<any>([]);
  displayedAdjuntosColumns: string[] = ['requisito', 'nombreArchivo', 'acciones'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.contratoForm = this.fb.group({
      fechaSuscripcion: [''],
      fechaInicio: [''],
      fechaFin: [''],
      numeroContrato: [''],
      tipoRequisito: ['']
    });
  }

  descargarContrato(): void { }
  adjuntarArchivo(): void { }
  onFileSelected(event: any): void { }
  descargarArchivo(element: any): void { }
  eliminarArchivo(index: number): void { }
  guardarContrato(): void { }
  regresar(): void { }

  get numeroContrato() {
    return this.contratoForm.get('numeroContrato');
  }

}
