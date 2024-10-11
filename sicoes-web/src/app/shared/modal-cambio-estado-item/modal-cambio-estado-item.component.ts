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
import { ItemEstadoService } from 'src/app/service/item-estado.service';

@Component({
  selector: 'vex-modal-modal-cambio-estado-item',
  templateUrl: './modal-cambio-estado-item.component.html',
  styleUrls: ['./modal-cambio-estado-item.component.scss']
})
export class ModalCambioEstadoItemComponent extends BaseComponent implements OnInit {

  PROCESO: Proceso
  PROCESO_ITEM: any
  etapa: any
  data: any

  listEstado: ListadoDetalle[] = []

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false

  formGroup = this.fb.group({
    descripcion: [null as any, Validators.required],
    estado: [null as any, Validators.required]
  });

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalCambioEstadoItemComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private parametriaService: ParametriaService,
    private procesoEtapaService: ProcesoEtapaService,
    private itemEstadoService: ItemEstadoService,
  ) {
    super();

    this.data = data;
    if(data.accion == 'edit'){
      // this.formGroup.get('fechaInicio').disable();
    }
    this.PROCESO = data?.proceso;
    this.PROCESO_ITEM = data?.proceso_item;

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
      ListadoEnum.ESTADO_ITEM
    ]).subscribe(listRes => {
      //this.listEstado = listRes[0]

      listRes[0].forEach(element => {

        if(['DESIGNACION', 'CONSENTIDO', 'DESIERTO', 'NULO', 'SUSPENDIDO', 'CANCELADO'].includes(element.codigo)){
          this.listEstado.push(element)
        }

      });
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
      //this.formGroup.get('etapa').disable();
    }
    
  }

  cargarDatos(idProcesoEtapa) {

    this.procesoEtapaService.obtenerProcesoEtapa(idProcesoEtapa,this.PROCESO.procesoUuid).subscribe(res => {
      this.etapa = res;
      this.formGroup.patchValue(this.etapa)
    });

  }

  actualizar() {
    if (this.validarForm()) return;

    let estadoCambio = this.formGroup.controls.estado.value;
    let msj;
    if(estadoCambio?.codigo == 'DESIGNACION'){
      msj = '¿Esta seguro de generar un registro en la bitácora?'
    }else if(estadoCambio?.codigo == 'CONSENTIDO'){
      msj = '¿Esta seguro de generar un registro en la bitácora?. El sistema liberará a todo el personal que no sea parte de la propuesta ganadora del item seleccionado. <strong>Está acción no podrá revertirse</strong>'
    }else{
      msj = '¿Esta seguro de generar un registro en la bitácora?. El sistema liberará a todo el personal que haya participado en el proceso e Item seleccionado. <strong>Está acción no podrá revertirse</strong>'
    }
    
    functionsAlertMod2.preguntarSiNoIcono(msj).then((result)=>{
      if(result.isConfirmed){
        this.continuarActualizar();
      }
    })
    
  }

  continuarActualizar(){
    let itemTemp: any = {
      procesoItem: this.PROCESO_ITEM,
      ...this.formGroup.getRawValue()
    };

    this.itemEstadoService.registrar(itemTemp).subscribe(res => {
      functionsAlertMod2.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }
}
