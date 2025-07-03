import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource }           from '@angular/material/table';
import { Asignacion }                   from 'src/app/interface/asignacion';
import { EvaluadorService }             from 'src/app/service/evaluador.service';

@Component({
  selector: 'vex-modal-aprobador-historial-contrato',
  templateUrl: './modal-aprobador-historial-contrato.component.html',
  styleUrls: ['./modal-aprobador-historial-contrato.component.scss']
})
export class ModalAprobadorHistorialContratoComponent implements OnInit {
  dataSource = new MatTableDataSource<Asignacion>();
  displayedColumns = [
    'tipo',
    'fechaRegistro',
    'usuario',
    'fechaAprobacion',
    'resultado',
    'observacion'
  ];
  isLoading = true;
  error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorHistorialContratoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idContrato: number },
    private evaluadorService: EvaluadorService
  ) {}

  ngOnInit(): void {
    
  }

  cerrar() {
    this.dialogRef.close();
  }
}
