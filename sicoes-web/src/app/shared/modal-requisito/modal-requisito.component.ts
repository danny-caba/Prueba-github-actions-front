import { Component, Inject, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { SeccionService } from 'src/app/service/seccion.service';
import { map } from 'rxjs';
import { RequisitoService } from 'src/app/service/requisito.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { Requisito } from 'src/app/interface/seccion.model';

@Component({
  selector: 'vex-modal-requisito',
  templateUrl: './modal-requisito.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalRequisitoComponent extends BaseComponent implements OnInit {

  title: string;
  listTipoSeccion: any[];
  listTipoDato: any[];
  listTipoDatoEntrada: any[];
  listTipoContrato: any[];

  ACC_REGISTRAR = 'Registrar';
  ACC_ACTUALIZAR = 'Actualizar';
  btnValue: string;
  requisitoRef: any;
  MONTO_FIJO: any = 0;

  formGroup = this.fb.group({
    seccion: ['', Validators.required],
    tipoDato: ['', Validators.required],
    deSeccionRequisito: ['', Validators.required],
    tipoDatoEntrada: ['', Validators.required],
    tipoContrato: ['', Validators.required],
    esSeccionRequisito: [false],
    flagConformaConsorcio: [false],
    flagRemype: [false],
    flagVisibleFielCumplimiento: [true],
    flagVisibleRetencion: [true],
    flagVisibleSuperaPropuesta: [true]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalRequisitoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private seccionService: SeccionService,
    private requisitoService: RequisitoService
  ) {
    super();

    this.btnValue = data.accion;
    this.title = data.accion == this.ACC_REGISTRAR ? 'REGISTRO' : 'ACTUALIZACIÓN';
    this.requisitoRef = data.requisito;

    if (data.accion === this.ACC_ACTUALIZAR) {
      this.formGroup.patchValue({
        seccion: data.requisito.seccion,
        tipoDato: data.requisito.tipoDato,
        deSeccionRequisito: data.requisito.deSeccionRequisito,
        tipoDatoEntrada: data.requisito.tipoDatoEntrada,
        tipoContrato: data.requisito.tipoContrato,
        esSeccionRequisito: data.requisito.esSeccionRequisito === '1' ? true : false,
        flagConformaConsorcio: data.requisito.flagConformaConsorcio === '1' ? true : false,
        flagRemype: data.requisito.flagRemype === '1' ? true : false,
        flagVisibleFielCumplimiento: data.requisito.flagVisibleFielCumplimiento === '1' ? true : false,
        flagVisibleRetencion: data.requisito.flagVisibleRetencion === '1' ? true : false,
        flagVisibleSuperaPropuesta: data.requisito.flagVisibleSuperaPropuesta === '1' ? true : false
      });
    }
  }

  ngOnInit(): void {
    this.cargarCombos();
    this.cargarAdjudicacionSimplificada();
  }

  cargarAdjudicacionSimplificada() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ADJUDICACION_SIMPLIFICADA
    ]).subscribe(listRes => {
      this.MONTO_FIJO = listRes[0].filter((element) => element.orden === 1);
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  accion(acc) {
    if ( acc === 'GUARDAR' ) {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.invalid) {
        return;
      }

      let requisito: any = {
        ...this.formGroup.getRawValue()
      };
      
      if (this.btnValue === this.ACC_REGISTRAR) {
        this.registrarConsulta(requisito);
      } else {
        this.actualizarConsulta(requisito);
      }
      
    } else {
      this.closeModal();
    }
  }

  registrarConsulta(requisito: any) {
    const time = new Date().getTime();
    const newRequisito: Requisito = {
      seccion: requisito.seccion,
      coRequisito: time.toString().substring(0, 6),
      tipoDato: requisito.tipoDato,
      tipoDatoEntrada: requisito.tipoDatoEntrada,
      tipoContrato: requisito.tipoContrato,
      deSeccionRequisito: requisito.deSeccionRequisito,
      esSeccionRequisito: requisito.esSeccionRequisito ? '1' : '0',
      flagConformaConsorcio: requisito.flagConformaConsorcio ? '1' : '0',
      flagRemype: requisito.flagRemype ? '1' : '0',
      flagVisibleFielCumplimiento: requisito.flagVisibleFielCumplimiento ? '1' : '0',
      flagVisibleRetencion: requisito.flagVisibleRetencion ? '1' : '0',
      flagVisibleSuperaPropuesta: requisito.flagVisibleSuperaPropuesta ? '1' : '0'
    };

    this.requisitoService.registrar(newRequisito).subscribe(res => {
      if (res === null) {
        functionsAlertMod2.warningMensage('No se puede registrar el requisito');
      } else {
        functionsAlertMod2.success('Registrado').then((result) => {
          this.dialogRef.close(res);
        });
      }
    });
  }

  actualizarConsulta(requisito: any) {
    const updRequisito: Requisito = {
      idSeccionRequisito: this.requisitoRef.idSeccionRequisito,
      seccion: requisito.seccion,
      tipoDato: requisito.tipoDato,
      tipoDatoEntrada: requisito.tipoDatoEntrada,
      tipoContrato: requisito.tipoContrato,
      deSeccionRequisito: requisito.deSeccionRequisito,
      esSeccionRequisito: requisito.esSeccionRequisito ? '1' : '0',
      flagConformaConsorcio: requisito.flagConformaConsorcio ? '1' : '0',
      flagRemype: requisito.flagRemype ? '1' : '0',
      flagVisibleFielCumplimiento: requisito.flagVisibleFielCumplimiento ? '1' : '0',
      flagVisibleRetencion: requisito.flagVisibleRetencion ? '1' : '0',
      flagVisibleSuperaPropuesta: requisito.flagVisibleSuperaPropuesta ? '1' : '0'
    };
    
    this.requisitoService.actualizar(updRequisito).subscribe(res => {
      if (res === null) {
        functionsAlertMod2.warningMensage('No se puede actualizar la sección');
      } else {
        functionsAlertMod2.success('Actualizado').then((result) => {
          this.dialogRef.close(res);
        });
      }
    });
  }

  cargarCombos() {
    const filtro = {};

    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_DATO
    ]).subscribe(listRes => {
      this.listTipoDato = listRes[0];
    });

    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ENTRADA_DATO
    ]).subscribe(listRes => {
      this.listTipoDatoEntrada = listRes[0];
    });

    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_CONTRATO,
    ]).subscribe(listRes => {
      this.listTipoContrato = listRes[0];
    });

    this.seccionService.obtenerSeccion(filtro)
    .pipe(
      map((res: any) => res.content),
      map(content => content.filter(item => item.esSeccion === '1'))
    )
    .subscribe(filteredContent => {
      this.listTipoSeccion = filteredContent;
    });
  }

}
