import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { MovimientoService } from 'src/app/service/movimiento.service';
import { BaseComponent } from '../components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-modal-desbloquear-profesional',
  templateUrl: './modal-desbloquear-profesional.component.html',
  styleUrls: ['./modal-desbloquear-profesional.component.scss']
})
export class ModalDesbloquearProfesionalComponent extends BaseComponent implements OnInit {

  PROCESO: Proceso
  MOVIMIENTO: any
  procesoItem: any
  data: any

  idPropuestaProfesional:number;
  
  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false
  booleanViewPerfil: boolean = false

  formGroup = this.fb.group({
    motivoDescripcion: ['', Validators.required]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalDesbloquearProfesionalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private procesoItemsService: ProcesoItemsService,
    private movimiento: MovimientoService
  ) {
    super();

    this.data = data;
    this.MOVIMIENTO = data?.movimiento;

    if (data.movimiento) {
      this.idPropuestaProfesional = data.movimiento.movimiento.propuestaProfesional.idPropuestaProfesional;
    }else{
      this.booleanViewPerfil = false;
    }

  }

  serviceTable(filtro) {
    return this.movimiento.buscarHistorial(this.idPropuestaProfesional,filtro);
  }

  obtenerFiltro() {
    let filtro: any = {
      
    }
    return filtro;
  }

  ngOnInit(): void {
    
  }

  closeModal() {
    this.dialogRef.close();
  }

  guardar(){
    if (this.validarForm()) return;
    this.MOVIMIENTO.movimiento.motivoDescripcion = this.formGroup.controls.motivoDescripcion.value;
    this.MOVIMIENTO.movimiento.supervisora ={
      idSupervisora: this.MOVIMIENTO.idSupervisora
    }
    this.MOVIMIENTO.movimiento.sector = this.MOVIMIENTO.perfil.sector;
    this.MOVIMIENTO.movimiento.subsector = this.MOVIMIENTO.perfil.subsector; 
    this.movimiento.registrarMovimiento(this.MOVIMIENTO.movimiento).subscribe(listRes => {
      functionsAlertMod2.success('Desbloqueado').then((result) => {
        //this.closeModal()
        this.closeModal()
      });
    })

  }
  
  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }


}
