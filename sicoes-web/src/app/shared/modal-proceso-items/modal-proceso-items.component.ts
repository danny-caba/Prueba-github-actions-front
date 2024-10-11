import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { MatTable } from '@angular/material/table';
import { ProcesoItemsPerfilService } from 'src/app/service/proceso-items-perfil.service';
import { functions } from 'src/helpers/functions';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-modal-proceso-items',
  templateUrl: './modal-proceso-items.component.html',
  styleUrls: ['./modal-proceso-items.component.scss']
})
export class ModalProcesoItemsComponent extends BaseComponent implements OnInit {

  PROCESO: Proceso
  procesoItem: any
  data: any

  listTipoCambio: ListadoDetalle[]
  listEstadoItem: ListadoDetalle[]
  listProcesoItemPerfil: any[] = []
  @ViewChild(MatTable) table: MatTable<any>;
  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false
  booleanViewPerfil: boolean = false

  formGroup = this.fb.group({
    numeroItem: ['', Validators.required],
    divisa: [null as ListadoDetalle, Validators.required],
    montoReferencial: ['', Validators.required],
    montoTipoCambio: [''],
    montoReferencialSoles: ['', Validators.required],
    facturacionMinima: ['', Validators.required],
    estado: [null as ListadoDetalle],
    descripcionItem: ['', Validators.required],
  });

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalProcesoItemsComponent>,
    private procesoItemsPerfilService: ProcesoItemsPerfilService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private parametriaService: ParametriaService,
    private procesoItemsService: ProcesoItemsService,
    private datePipe: DatePipe
  ) {
    super();

    this.data = data;
    this.PROCESO = data?.proceso;

    this.validarOpciones(data)

    if (data.item) {
      this.cargarDatos(data.item.procesoItemUuid)
    }else{
      this.booleanViewPerfil = false;
    }

  }

  ngOnInit(): void {
    this.cargarCombo();
    
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.MONEDA,
      ListadoEnum.ESTADO_ITEM
    ]).subscribe(listRes => {
      this.listTipoCambio = listRes[0]
      this.listEstadoItem = listRes[1]

      this.listEstadoItem.forEach(element => {
        //console.info(element.codigo, element.nombre)

        if(['DESIGNACION', 'ADJUDICADO', 'CONSENTIDO', 'DESIERTO', 'NULO', 'SUSPENDIDO', 'CANCELADO'].includes(element.codigo)){
          element.disabled = false;
        }else{
          element.disabled = true;
        }

        /*Designación (manual) DESIGNACION
        Adjudicado (manual) ADJUDICADO
        Consentido (manual) CONSENTIDO
        Desierto (manual) DESIERTO
        Nulo (manual) NULO
        Suspendido (manual) SUSPENDIDO
        Cancelado .(manual) CANCELADO
        */

      });

      if(!this.data.item){
        const defaultValueObj = this.listEstadoItem.find(obj => obj.codigo === "EN_ELABORACION");
        if(defaultValueObj){
          this.formGroup.controls.estado.setValue(defaultValueObj);
          this.formGroup.controls.estado.disable();
        }
      }
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
    
    if(this.booleanAdd || this.booleanEdit){
      this.cargarValoresDefecto();
      this.eventoTipoCambio();
    }

    if(this.booleanView == true){
      this.booleanViewPerfil = true;
    }
  }

  
  
  realizarCalculos(){
    let valueFactor = 0.5;
    let tipoDivisa = this.formGroup.controls.divisa.value;
    let montoRef = this.formGroup.controls.montoReferencial.value;
    let tipoCam = this.formGroup.controls.montoTipoCambio.value;
    if(tipoDivisa?.codigo == 'SOLES'){
      this.formGroup.controls.montoReferencialSoles.setValue(montoRef);
      if(!isNaN(Number(montoRef))){
        this.formGroup.controls.facturacionMinima.setValue((Number(montoRef) * valueFactor).toFixed(2) + '');
      }else{
        this.formGroup.controls.facturacionMinima.reset();
      }
    }else{
      if(!isNaN(Number(montoRef)) && !isNaN(Number(tipoCam))){
        let montRefSol = (Number(montoRef) * Number(tipoCam));
        this.formGroup.controls.montoReferencialSoles.setValue(montRefSol.toFixed(2) + '');
        this.formGroup.controls.facturacionMinima.setValue((montRefSol * valueFactor).toFixed(2) + '');
      }else{
        this.formGroup.controls.montoReferencialSoles.reset();
        this.formGroup.controls.facturacionMinima.reset();
      }
    }
  }


  eventoTipoCambio(){
    this.formGroup.controls.divisa.valueChanges.subscribe(value => {
      if(value.codigo != 'SOLES'){
        if((functions.esVacio(this.procesoItem) || this.procesoItem?.estado?.codigo == "EN_ELABORACION") && this.booleanView == false){
          this.disableControls(false, ['montoTipoCambio'], this.formGroup);
        }
        this.clearValidator(false, ['montoTipoCambio'], this.formGroup)
      }else{
        if((functions.esVacio(this.procesoItem) || this.procesoItem?.estado?.codigo == "EN_ELABORACION") && this.booleanView == false){
          this.disableControls(true, ['montoTipoCambio'], this.formGroup);
        }
        this.clearValidator(true, ['montoTipoCambio'], this.formGroup);
        this.formGroup.controls.montoTipoCambio.reset();
      }
      this.realizarCalculos();
    })
    this.formGroup.controls.montoReferencial.valueChanges.subscribe(value => {
      this.realizarCalculos();
    })
    this.formGroup.controls.montoTipoCambio.valueChanges.subscribe(value => {
      this.realizarCalculos();
    })
  }

  cargarValoresDefecto(){
    this.disableControls(true, ['montoTipoCambio', 'montoReferencialSoles', 'facturacionMinima', 'estado'], this.formGroup);
  }

  cargarDatos(idProcesoItem) {
    this.procesoItemsService.obtenerProcesoItems(idProcesoItem).subscribe(res => {
    this.procesoItem = res;
    if (this.procesoItem?.estado?.codigo != "EN_ELABORACION" && this.booleanEdit == true) {
      this.booleanViewPerfil = true;
      this.formGroup.disable();
    }else{
      this.formGroup.controls.estado.disable();
    }
    this.formGroup.patchValue(this.procesoItem)
    this.actualizarTabla();
    });

  }
  actualizarTabla(){
    this.procesoItemsPerfilService.buscarItemsPerfiles({size: 1000}, this.procesoItem?.procesoItemUuid).subscribe(res => {
      this.listProcesoItemPerfil = res.content;
      //this.table.renderRows();
    });
  }

  guardar() {
    if (this.validarForm()) return;
    if (functions.esCero(this.formGroup.controls.montoReferencial.value)){
      this.formGroup.controls.montoReferencial.setErrors({ valorEstimadoInvalido: true }); 
      return;
    }
    if(!this.validarInputNombre(this.formGroup.controls.descripcionItem)){
      functionsAlertMod2.warningMensage('No puede ingresar más de 200 caracteres al nombre del ítem');
      return;
    }
    let itemTemp: any = {
      proceso: {
        idProceso: this.PROCESO.idProceso,
      },
      ...this.formGroup.getRawValue(),
      listProcesoItemPerfil: this.listProcesoItemPerfil
    };
    
    this.procesoItemsService.registrarProcesoItems(itemTemp).subscribe(res => {
      functionsAlertMod2.success('Registrado').then((result) => {
        //this.closeModal()
        this.booleanEdit = true;
        this.booleanAdd = false;
        this.procesoItem = res;
        this.closeModal()
        this.actualizarTabla();
      });
    });
  }

  validarInputNombre(valor){
    if(length > 200){    
      return false; 
    }
    return true;
  }

  actualizar() {
    if (this.validarForm()) return;
    if (functions.esCero(this.formGroup.controls.montoReferencial.value)){
      this.formGroup.controls.montoReferencial.setErrors({ valorEstimadoInvalido: true }); 
      return;
    }
    if(!this.validarInputNombre(this.formGroup.controls.descripcionItem)){
      functionsAlertMod2.warningMensage('No puede ingresar más de 200 caracteres al nombre del ítem');
      return;
    }
    let itemTemp: any = {
      procesoItemUuid: this.procesoItem.procesoItemUuid,
      proceso: {
        idProceso: this.PROCESO.idProceso,
      },
      ...this.formGroup.getRawValue(),
      listProcesoItemPerfil: this.listProcesoItemPerfil
    };

    this.procesoItemsService.actualizarProcesoItems(itemTemp).subscribe(res => {
      functionsAlertMod2.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }

  pegarSoloNumeros(event: any) {
    const pastedText = event.clipboardData.getData('text/plain');
    if (!(/^\d+$/.test(pastedText))) {
      event.preventDefault();
    }
  }
}
