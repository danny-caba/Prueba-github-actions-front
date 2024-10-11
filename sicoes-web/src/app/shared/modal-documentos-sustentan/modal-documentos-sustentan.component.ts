import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { BaseComponent } from '../components/base.component';
import { ListadoEnum, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { DocumentoService } from 'src/app/service/documento.service';
import { Documento } from 'src/app/interface/documento.model';
import { FormAdjuntosBtnComponent } from '../form-adjuntos-btn/form-adjuntos-btn.component';
import { DatePipe } from '@angular/common';
import { PidoService } from 'src/app/service/pido.service';
import { functions } from 'src/helpers/functions';
import { CmpOpcionEvaluadorComponent } from '../cmp-opcion/cmp-opcion-evaluador/cmp-opcion-evaluador.component';

@Component({
  selector: 'vex-modal-documentos-sustentan',
  templateUrl: './modal-documentos-sustentan.component.html',
  styleUrls: ['./modal-documentos-sustentan.component.scss']
})
export class ModalDocumentosSustentanComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('formAdjuntoBtn', { static: false }) formAdjuntoBtn: FormAdjuntosBtnComponent;
  @ViewChild('cmpOpcionEvaluar', { static: false }) cmpOpcionEvaluar: CmpOpcionEvaluadorComponent;

  flagTerminos: boolean = true;

  solicitud: Solicitud
  documento: Documento
  data: any

  booleanAdd: boolean
  booleanEdit: boolean
  booleanView: boolean = false
  booleanEvaluar: boolean = false
  booleanViewEval: boolean = false
  editableEvaluacion: boolean = true;
  cmpTipoRevisionEdit: boolean = false;

  flagVigente: boolean
  flagValidar: boolean = false;

  formGroup = this.fb.group({
    tipoDocumento: [null, Validators.required],
    pais: [null, Validators.required],
    tipoIdentificacion: [null as ListadoDetalle, Validators.required],
    numeroDocumento: [null, Validators.required],
    nombreEntidad: ['', Validators.required],
    descripcionContrato: [null, Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    flagVigente: [0, Validators.required],
    duracion: ['']
  });

  listTipoDocumento: ListadoDetalle[]
  listPais: ListadoDetalle[]
  listTipoidentificacion: any[]

  constructor(
    private dialogRef: MatDialogRef<ModalDocumentosSustentanComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private documentoService: DocumentoService,
    private datePipe: DatePipe,
    private pidoService: PidoService
  ) {
    super();

    this.data = data;
    this.solicitud = data?.solicitud;

    this.validarOpciones(data)

    if (data.documento) {
      this.cargarDatos(data.documento.idDocumento)
    }
  }

  validarOpciones(data) {
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    this.booleanEvaluar = data.accion == 'editEval';
    this.booleanViewEval = data.accion == 'viewEval';
    this.flagTerminos = data?.flagTerminos

    if (this.booleanView) {
      this.formGroup.disable();
    }

    if (this.booleanViewEval) {
      this.formGroup.disable();
      this.booleanEvaluar = true;
      this.editableEvaluacion = false;
    }

    if (this.booleanEvaluar) {
      this.formGroup.disable();
    }

    if (!this.booleanView && !this.booleanViewEval && !this.booleanEvaluar) {
      this.formGroup.controls['nombreEntidad'].disable({ emitEvent: false })
      this.formGroup.controls['duracion'].disable({ emitEvent: false })

      this.formGroup.controls.pais.valueChanges.subscribe(value => {
        this.onChangePais();
      })
      this.formGroup.controls.flagVigente.valueChanges.subscribe(value => {
        this.onChangeVigente();
      })
      this.formGroup.controls.fechaFin.valueChanges.subscribe(value => {
        this.onChangeFecha();
      })
      this.formGroup.controls.fechaInicio.valueChanges.subscribe(value => {
        this.onChangeFecha();
      })
      
    }
  }

  cargarDatos(idDocumento) {
    this.documentoService.obtenerDocumento(idDocumento).subscribe(res => {
      this.documento = res;
      this.documento.fechaFin = functions.getFechaString(this.documento.fechaFin);
      this.documento.fechaInicio = functions.getFechaString(this.documento.fechaInicio);
      this.formGroup.patchValue(res)
      if (res.flagVigente == 0) {
        this.formGroup.controls.flagVigente.setValue(0)
        this.formGroup.controls.fechaFin.setValue(res.fechaFin)
      }

      if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.documento.idDocumentoPadre)) {
        this.cmpTipoRevisionEdit = true;
      }

      if(this.booleanView || this.booleanViewEval || this.booleanEvaluar){
        this.onChangePaisView();
      }

    });

  }

  onChangePais() {
    let pais: any = this.formGroup.controls['pais'].value

    this.cargarTipoIdentificacionTrubutaria(pais.idListadoDetalle);

    if (pais.codigo == "PERU") {
      //this.formGroup.controls['tipoIdentificacion'].disable({ emitEvent: false })
      this.formGroup.controls['tipoIdentificacion'].clearValidators
      this.formGroup.controls['tipoIdentificacion'].updateValueAndValidity
      //this.formGroup.controls['tipoIdentificacion'].reset();
      this.formGroup.controls['nombreEntidad'].reset();
      //let resultado = this.listTipoidentificacion.find(ListadoDetalle => ListadoDetalle.codigo === "RUC")
      //this.formGroup.controls['tipoIdentificacion'].setValue(resultado);
      this.flagValidar = true
      this.formGroup.controls['nombreEntidad'].disable({ emitEvent: false })
    } else {
      //this.formGroup.controls['tipoIdentificacion'].enable({ emitEvent: false })
      this.formGroup.controls['tipoIdentificacion'].setValidators(Validators.required);
      this.formGroup.controls['tipoIdentificacion'].updateValueAndValidity
      this.flagValidar = false
      this.formGroup.controls['nombreEntidad'].enable()
    }
  }

  onChangePaisView() {
    let pais: any = this.formGroup.controls['pais'].value
    this.cargarTipoIdentificacionTrubutaria(pais.idListadoDetalle);
  }

  cargarTipoIdentificacionTrubutaria(idPais) {
    this.parametriaService.obtenerSubListado(ListadoEnum.TIPO_IDEN_TRIBUTARIA, idPais).subscribe(res => {
      this.listTipoidentificacion = res
    });
  }

  idDocumentoPrincipal;

  changeVersion(version: any) {
    if (version.codigo == 'V1') {
      let data = {
        accion: 'viewEval'
      }
      this.idDocumentoPrincipal = this.documento.idDocumento
      this.validarOpciones(data);
      this.cargarDatos(this.documento.idDocumentoPadre);
    } else {
      this.editableEvaluacion = true;
      this.validarOpciones(this.data)
      this.cargarDatos(this.idDocumentoPrincipal);
    }
  }

  consultaRuc() {
    let nroDocumento
    nroDocumento = this.formGroup.controls["numeroDocumento"].value;

    if (nroDocumento.length == 11) {
      this.pidoService.buscarSunat(nroDocumento).subscribe(res => {
        if (true) {
          this.formGroup.controls["nombreEntidad"].setValue(res?.nombres?.trim());
          this.formGroup.controls['nombreEntidad'].disable({ emitEvent: false })
        } else {
          functionsAlert.error(res?.message).then((result) => {
            this.formGroup.controls["nombreEntidad"].setValue('');
          })
          this.formGroup.controls['nombreEntidad'].enable({ emitEvent: true })  
        }
      }, error => {
        this.formGroup.controls["nombreEntidad"].setValue('');
        this.formGroup.controls['nombreEntidad'].enable({ emitEvent: false })
      })
    }
  }

  onChangeFecha() {
    const vigente = this.formGroup.controls['flagVigente'].value ? '1' : '0';
    let fecha1 = functions.getFecha(this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy'))
    let fecha2 = functions.getFecha(this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy'))
    let hoy = new Date();

    if (vigente == '0') {
      if (fecha1 < fecha2) {
        this.diferenciafechas(fecha1, fecha2)
      } else {
        this.formGroup.controls['duracion'].setValue(null)
      }
    } else {
      if (fecha1 < hoy) {
        this.diferenciafechas(fecha1, hoy)
      } else {
        this.formGroup.controls['duracion'].setValue(null)
      }
    }
  }


  diferenciafechas(fb, fa) {  //fa y fb dos fechas	

    let totalDias = Math.floor((Date.UTC(fa.getFullYear(), fa.getMonth(), fa.getDate()) - Date.UTC(fb.getFullYear(), fb.getMonth(), fb.getDate()) ) /(1000 * 60 * 60 * 24));
    totalDias = totalDias + 1;
    
    let duracion = '';

    let anio = Math.floor(totalDias / 365);
    let mes = Math.floor((totalDias - anio * 365) / 30);
    let dia = (totalDias-(anio*365)-(mes*30));

    if (anio > 0) {
      if (anio == 1) {
        duracion = (anio.toString() + " año ")
      } else {
        duracion = (anio.toString() + " años ")
      }

    } if (mes > 0) {
      if (mes == 1) {
        duracion = (duracion + mes.toString() + " mes ")
      } else {
        duracion = (duracion + mes.toString() + " meses ")
      }

    } if (dia > 0) {
      if (dia == 1) {
        duracion = (duracion + dia.toString() + " día")
      } else {
        duracion = (duracion + dia.toString() + " días")
      }

    }
    this.formGroup.controls['duracion'].setValue(duracion)
  }

  onChangeVigente() {
    const vigente = this.formGroup.controls['flagVigente'].value ? '1' : '0';
    if (vigente == "1") {
      this.flagVigente = true
      this.formGroup.controls['fechaFin'].disable({ emitEvent: false })
      this.formGroup.controls["fechaFin"].setValidators(Validators.nullValidator);
      this.formGroup.controls['fechaFin'].updateValueAndValidity();
      this.formGroup.controls['fechaFin'].reset();

      var hoy = new Date();
      let fecha1 = functions.getFecha(this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy'))
      if (fecha1 < hoy) {
        this.diferenciafechas(fecha1, hoy)
      } else {
        this.formGroup.controls['duracion'].setValue(null)
      }

    } else {
      this.flagVigente = false
      this.formGroup.controls['fechaFin'].enable({ emitEvent: false })
      this.formGroup.controls["fechaFin"].setValidators(Validators.required);
      this.formGroup.controls['fechaFin'].updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.cargarCombo();
  }

  evaluar() {
    let objEval = this.cmpOpcionEvaluar.getEvaluar()
    if(objEval == null) return;

    let obj = {
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ... this.cmpOpcionEvaluar.getEvaluar()
    };
    this.documentoService.evaluarDocumento(obj, this.documento.idDocumento).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal();
      });
    })
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_DOCUMENTO_PJ,
      ListadoEnum.PAIS
    ]).subscribe(listRes => {
      this.validarDocumentos(listRes[0]);
      this.listPais = listRes[1]
    })
  }

  validarDocumentos(lista){
    if(this.solicitud?.persona?.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO){
      this.listTipoDocumento = lista.filter(ele => (
        ele.codigo === 'CONTRATO' ||
        ele.codigo === 'ORDEN_SERVICIO'
      ))
    }
    if(this.solicitud?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PJ_EXTRANJERO){
      this.listTipoDocumento = lista.filter(ele => (
        ele.codigo === 'CONTRATO' ||
        ele.codigo === 'ORDEN_SERVICIO'
      ))
    }
    if(this.solicitud?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_POSTOR){
      this.listTipoDocumento = lista.filter(ele => (
        ele.codigo === 'CONTRATO' ||
        ele.codigo === 'ORDEN_SERVICIO'
      ))
    }
    if(this.solicitud?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_PERS_PROPUESTO){
      this.listTipoDocumento = lista.filter(ele => (
        ele.codigo === 'CONTRATO' ||
        ele.codigo === 'ORDEN_SERVICIO' ||
        ele.codigo === 'CONSTANCIA' ||
        ele.codigo === 'CERTIFICADO' ||
        ele.codigo === 'OTROS'
      ))
    }
  }

  ngOnDestroy() {

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

  actualizar() {
    if (this.validarForm()) return;

    let documento: any = {
      idDocumento: this.documento.idDocumento,
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ...this.formGroup.getRawValue()
    };
    documento.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
    documento.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');
    documento.flagVigente = this.formGroup.controls['flagVigente'].value ? '1' : '0';

    let archivo = this.formAdjuntoBtn.obtenerAdjuntos();
    if (archivo) {
      documento.archivo = archivo;
    }

    this.documentoService.actualizar(documento).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }

  guardar() {
    if (this.validarForm()) return;

    let documento: any = {
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ...this.formGroup.getRawValue()
    };

    documento.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
    documento.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');

    documento.flagVigente = this.formGroup.controls['flagVigente'].value ? '1' : '0';

    let archivo = this.formAdjuntoBtn.obtenerAdjuntos();
    if (archivo) {
      documento.archivo = archivo;
    }

    this.documentoService.registrar(documento).subscribe(res => {
      functionsAlert.success('Registrado').then((result) => {
        this.closeModal()
      });
    });
  }

  entendido() {
    this.flagTerminos = false;
  }

}