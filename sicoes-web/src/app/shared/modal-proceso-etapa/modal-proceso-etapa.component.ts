import { Component, Inject, OnInit, ViewChild ,OnChanges,SimpleChanges} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BaseComponent } from '../components/base.component';
import { ParametriaService } from 'src/app/service/parametria.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { DatePipe } from '@angular/common';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { ProcesoEtapaService } from 'src/app/service/proceso-etapa.service';
import { functions } from 'src/helpers/functions';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-modal-proceso-etapa',
  templateUrl: './modal-proceso-etapa.component.html',
  styleUrls: ['./modal-proceso-etapa.component.scss']
})
export class ModalProcesoEtapaComponent extends BaseComponent implements OnInit {

  PROCESO: Proceso
  etapa: any
  data: any

  listGrupos: ListadoDetalle[]

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false

  formGroup = this.fb.group({
    fechaInicio: [null as any, Validators.required],
    fechaFin: [null as any, Validators.required],
    etapa: [null as any, Validators.required]
  });

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalProcesoEtapaComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private parametriaService: ParametriaService,
    private procesoEtapaService: ProcesoEtapaService,
    private datePipe: DatePipe
  ) {
    super();

    this.data = data;
    if(data.accion == 'edit'){
      // this.formGroup.get('fechaInicio').disable();
     }
    this.PROCESO = data?.proceso;

    this.validarOpciones(data)

    if (data.etapa) {
      this.cargarDatos(data.etapa.idProcesoEtapa)
    }

  }

  ngOnInit(): void {
    this.cargarCombo();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ETAPA_PROCESO,
      ListadoEnum.ESTADO_ITEM
    ]).subscribe(listRes => {
      this.listGrupos = listRes[0]
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  validarOpciones(data) {
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    
    if (this.booleanView) {
      this.formGroup.disable();
    }
    if( this.booleanEdit = data.accion == 'edit'){
      this.formGroup.get('etapa').disable();
    }
    
  }

  cargarDatos(idProcesoEtapa) {

    this.procesoEtapaService.obtenerProcesoEtapa(idProcesoEtapa,this.PROCESO.procesoUuid).subscribe(res => {
      this.etapa = res;
      this.etapa.fechaInicio = functions.getFechaString(this.etapa.fechaInicio);
      this.etapa.fechaFin = functions.getFechaString(this.etapa.fechaFin);
      const codigoEstadoProceso = this.PROCESO?.estado?.codigo;
      if( codigoEstadoProceso == "CONVOCATORIA" || codigoEstadoProceso == "EN_ELABORACION"){
        this.formGroup.get('fechaInicio').enable();
      }else{
        this.formGroup.get('fechaInicio').disable();
      }
      if(res.etapa?.codigo == 'ETAPA_PRESENTADO' && (codigoEstadoProceso == 'DESIGNACION' || codigoEstadoProceso == 'CERRADO' || codigoEstadoProceso == 'ADMISION_CALIFICACION')){
       this.formGroup.get('fechaFin').disable();
      }
      this.formGroup.patchValue(this.etapa)
    });

  }

  actualizar() {
    if (this.validarForm()) return;

    let itemTemp: any = {
      idProcesoEtapa: this.etapa.idProcesoEtapa,
      proceso: {
        procesoUuid: this.PROCESO.procesoUuid,
      },
      ...this.formGroup.getRawValue()
    };

    itemTemp.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
    itemTemp.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');

    this.procesoEtapaService.actualizarProcesoEtapa(itemTemp).subscribe(res => {
      functionsAlertMod2.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }

}
