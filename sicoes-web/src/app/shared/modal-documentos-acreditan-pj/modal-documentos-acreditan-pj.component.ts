import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { Documento } from 'src/app/interface/documento.model';
import { DocumentoService } from 'src/app/service/documento.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { BaseComponent } from '../components/base.component';
import { FormAdjuntosBtnComponent } from '../form-adjuntos-btn/form-adjuntos-btn.component';
import { PidoService } from 'src/app/service/pido.service';
import { ParametriaService } from 'src/app/service/parametria.service';
import { flagEnum, ListadoEnum, SolicitudEstadoEnum, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { DatePipe } from '@angular/common';
import { functions } from 'src/helpers/functions';
import { CmpOpcionEvaluadorComponent } from '../cmp-opcion/cmp-opcion-evaluador/cmp-opcion-evaluador.component';
import { PerfilService } from 'src/app/service/perfil.service';



@Component({
  selector: 'vex-modal-documentos-acreditan-pj',
  templateUrl: './modal-documentos-acreditan-pj.component.html',
  styleUrls: ['./modal-documentos-acreditan-pj.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalDocumentosAcreditanPJComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('formAdjuntoBtn', { static: false }) formAdjuntoBtn: FormAdjuntosBtnComponent;
  @ViewChild('cmpOpcionEvaluar', { static: false }) cmpOpcionEvaluar: CmpOpcionEvaluadorComponent;

  flagTerminos: boolean = true;

  solicitud: Solicitud
  documento: Documento
  data: any
  originalDuracion: string;

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false
  booleanEvaluar: boolean = false
  booleanViewEval: boolean = false
  editableEvaluacion: boolean = true;
  cmpTipoRevisionEdit: boolean = false;
  booleanEditFile = false;

  flagValidar: boolean = false;
  flagConformidad: boolean = false;
  flagVigente: boolean;
  enableDateEditing: boolean = false;
  isEditableDate: boolean = false;
  flagVigenteSubscription: any;
  fechaFinSubscription: any;

  formGroup = this.fb.group({
    tipoDocumento: [null, Validators.required],
    pais: [null, Validators.required],
    tipoIdentificacion: [null as ListadoDetalle, Validators.required],
    numeroDocumento: [null as string, Validators.required],
    nombreEntidad: ['', Validators.required],
    codigoContrato: [null, Validators.required],
    descripcionContrato: [null, Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    flagVigente: [0, Validators.required],
    duracion: [''],
    cuentaConformidad: [{}, Validators.required],
    montoContrato: [null, Validators.required],
    tipoCambio: [null, Validators.required],
    montoTipoCambio: [null, Validators.required],
    montoContratoSol: [null, Validators.required],
    subSectorDoc: [null, Validators.required],
    actividadArea: [null, Validators.required],
  });

  listTipoDocumento: ListadoDetalle[]
  listPais: ListadoDetalle[]
  listTipoidentificacion: any[]
  listTipoCambio: ListadoDetalle[]
  listCuentaConformidad: ListadoDetalle[]
  listSubSectorDoc: ListadoDetalle[]
  listActividadArea: ListadoDetalle[]



  constructor(
    private dialogRef: MatDialogRef<ModalDocumentosAcreditanPJComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private documentoService: DocumentoService,
    private datePipe: DatePipe,
    private pidoService: PidoService,
    private snackbar: MatSnackBar,
    private perfilService: PerfilService,
  ) {
    super();
    this.data = data;
    this.solicitud = data?.solicitud;

    this.validarOpciones(data)

    if (data.documento) {
      this.cargarDatos(data.documento.idDocumento)
    }
  }

  cargarsubSectorDoc(){
    let filtro = {
      solicitudUuid: this.solicitud?.solicitudUuid
    };
    this.perfilService.buscarPerfiles(filtro).subscribe(res => {
      let lista: ListadoDetalle[] = [];
      res.content.forEach(item => {
          let detalle = new ListadoDetalle();
          detalle.codigo = item.subsector.codigo;
          detalle.descripcion = item.subsector.nombre;
          detalle.idListadoDetalle = item.subsector.idListadoDetalle;
          lista.push(detalle);
      });
      this.listSubSectorDoc = lista;
    })
  }

  validarOpciones(data) {
    
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    this.booleanEvaluar = data.accion == 'editEval';
    this.booleanViewEval = data.accion == 'viewEval';
    this.booleanEditFile = data.accion == 'editFile';
    this.flagTerminos = data?.flagTerminos;

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
    
    if (this.booleanEditFile) {
      this.formGroup.disable();
      if (this.data?.documento?.flagVigente === flagEnum.VIGENTE) {
        this.isEditableDate = true;
      }
    }
    
    if (!this.booleanView && !this.booleanViewEval && !this.booleanEvaluar && !this.booleanEditFile) {
      this.formGroup.controls['nombreEntidad'].disable({ emitEvent: false })
      this.formGroup.controls['duracion'].disable({ emitEvent: false })

      this.formGroup.controls.flagVigente.valueChanges.subscribe(value => {
        this.onChangeVigente();
      })
      this.formGroup.controls.fechaFin.valueChanges.subscribe(value => {
        this.onChangeFecha();
      })
      this.formGroup.controls.fechaInicio.valueChanges.subscribe(value => {
        this.onChangeFecha();
      })
      this.formGroup.controls.pais.valueChanges.subscribe(value => {
        this.onChangePais();
      })
      this.formGroup.controls.tipoCambio.valueChanges.subscribe(value => {
        this.onChangeMoneda();
      })
      this.formGroup.controls.cuentaConformidad.valueChanges.subscribe(value => {
        this.flagConformidad = true
      })
    }

  }

  cargarDatos(idDocumento) {
    let cuentaConformidad = this.formGroup.controls['cuentaConformidad'].value;
    cuentaConformidad = {} ? this.flagConformidad = false : this.flagConformidad = true

    this.documentoService.obtenerDocumento(idDocumento).subscribe(res => {
      this.documento = res;
      console.log(this.documento);
      
      this.documento.fechaInicio = functions.getFechaString(this.documento.fechaInicio);
      this.documento.fechaFin = functions.getFechaString(this.documento.fechaFin);
      this.documento.fechaConformidad = functions.getFechaString(this.documento.fechaConformidad);
      this.originalDuracion = this.documento ? this.documento.duracion : '';
      this.formGroup.patchValue(res)
      if (res.flagVigente == 0) {
        this.formGroup.controls.flagVigente.setValue(0)
        this.formGroup.controls.fechaFin.setValue(res.fechaFin)
      }
      if (res.cuentaConformidad?.codigo == 'SI') {
        this.formGroup.controls.cuentaConformidad.setValue(this.listCuentaConformidad[0])
      } else if (res.cuentaConformidad?.codigo == 'NO') {
        this.formGroup.controls.cuentaConformidad.setValue(this.listCuentaConformidad[1])
      }

      if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.documento.idDocumentoPadre)) {
        if (this.solicitud.estado.codigo != SolicitudEstadoEnum.OBSERVADO) {
          this.cmpTipoRevisionEdit = true;
        }
      }

      if(this.booleanView || this.booleanViewEval || this.booleanEvaluar || this.booleanEditFile){
        this.onChangePaisView();
      }

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
    let nroDocumento = this.formGroup.controls.numeroDocumento.value;
    let tipoIden = this.formGroup.controls.tipoIdentificacion.value;

    if (tipoIden?.codigo == "IT_RUC") {
      if(nroDocumento.length != 11){
        this.snackbar.open('El RUC debe tener 11 caracteres', 'Cerrar', {
          duration: 7000,
        })
        return;
      }
      this.pidoService.buscarSunat(nroDocumento).subscribe(res => {
        if (true) {
          this.formGroup.controls["nombreEntidad"].setValue(res?.nombres?.trim());
          this.formGroup.controls['nombreEntidad'].disable({ emitEvent: false })
        } else {
          functionsAlert.error(res?.message).then((result) => {
            this.formGroup.controls["nombreEntidad"].setValue(null);
          })
        }
      }, error => {
        this.formGroup.controls["nombreEntidad"].setValue(null);
        this.formGroup.controls['nombreEntidad'].enable({ emitEvent: false })
      })
    }

    if (tipoIden?.codigo == "IT_DNI") {
      if(nroDocumento.length != 8){
        this.snackbar.open('El DNI debe tener 8 caracteres', 'Cerrar', {
          duration: 7000,
        })
        return;
      }
      this.pidoService.buscarReniec(nroDocumento).subscribe(res => {
        if (res?.resultCode == '0000') {
          let nombesComp = res.nombres?.trim();
          if(functions.noEsVacio(res.apellidoPaterno?.trim())){
            nombesComp += ' ' + res.apellidoPaterno.trim();
          }
          if(functions.noEsVacio(res.apellidoMaterno?.trim())){
            nombesComp += ' ' + res.apellidoMaterno.trim();
          }

          this.formGroup.controls["nombreEntidad"].setValue(nombesComp);
          this.formGroup.controls['nombreEntidad'].disable({ emitEvent: false })
        } else {
          functionsAlert.error(res?.message).then((result) => {
            this.formGroup.controls["nombreEntidad"].setValue(null);
          })
        }
      }, error => {
        this.formGroup.controls["nombreEntidad"].setValue(null);
        this.formGroup.controls['nombreEntidad'].enable({ emitEvent: false })
      })
    }

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

  cargarTipoIdentificacionTrubutaria(idPais) {
    this.parametriaService.obtenerSubListado(ListadoEnum.TIPO_IDEN_TRIBUTARIA, idPais).subscribe(res => {
      this.listTipoidentificacion = res
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

  onChangeMoneda() {
    let tipoCambio: any
    tipoCambio = this.formGroup.controls['tipoCambio'].value
    if (tipoCambio.codigo == "SOLES") {
      this.formGroup.controls['montoTipoCambio'].disable({ emitEvent: false })
      this.formGroup.controls['montoTipoCambio'].clearValidators
      this.formGroup.controls['montoTipoCambio'].updateValueAndValidity
      this.formGroup.controls['montoTipoCambio'].reset();
    } else {
      this.formGroup.controls['montoTipoCambio'].enable({ emitEvent: false })
      this.formGroup.controls['montoTipoCambio'].setValidators(Validators.required);
      this.formGroup.controls['montoTipoCambio'].updateValueAndValidity
    }
  }

  onChangeSubSector(obj) {
    this.formGroup.get('actividadArea').setValue(null);
    if (!obj) return;
    this.parametriaService.obtenerSubListado(ListadoEnum.ACTIVIDAD_AREAS, obj.idListadoDetalle).subscribe(res => {
      this.listActividadArea = res;
    });
  }

  ngOnInit() {
    this.cargarCombo();
    this.cargarsubSectorDoc();

    this.formGroup.get('subSectorDoc').valueChanges.subscribe(value => {
      this.onChangeSubSector(value);
    });
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_DOCUMENTO_PJ,
      ListadoEnum.PAIS,
      ListadoEnum.TIPO_DOCUMENTO,
      ListadoEnum.MONEDA,
      ListadoEnum.CUENTA_CONFORMIDAD,
      ListadoEnum.ACTIVIDAD_AREAS
    ]).subscribe(listRes => {
      this.validarDocumentos(listRes[0]);
      this.listPais = listRes[1];
      //this.listTipoidentificacion = listRes[2]
      this.listTipoCambio = listRes[3]
      this.listCuentaConformidad = listRes[4]
      // this.listActividadArea = listRes[5]
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

    let pais: any = this.formGroup.controls['pais'].value
    if (pais.codigo == "PERU") {
      if (this.formGroup.get('nombreEntidad').value == null) {
        this.snackbar.open('Valide la Razón Social', 'Cerrar', {
          duration: 7000,
        })
        return true;
      }
    }

    return false;
  }

  validarFormModified() {
    console.log(this.formGroup);
    
    if (this.enableDateEditing) {
      if (this.formGroup.get('fechaFin').value == null && this.formGroup.get('flagVigente').value == 0 ) {
        this.snackbar.open('Valide la Fecha de Fin', 'Cerrar', {
          duration: 7000,
        })
        return true;
      }

      if (this.formGroup.get('duracion').value == null) {
        this.snackbar.open('Valide la Duración', 'Cerrar', {
          duration: 7000,
        })
        return true;
      }

      return false;
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

    let archivo = this.formAdjuntoBtn.obtenerAdjuntos();
    if (archivo) {
      documento.archivo = archivo;
    }

    documento.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
    documento.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');
    documento.flagVigente = this.formGroup.controls['flagVigente'].value ? '1' : '0';
    this.documentoService.actualizar(documento).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });

  }

  modificar() {
    if (this.validarFormModified()) return;
    let documento: any = {
      idDocumento: this.documento.idDocumento,
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      }
    };

    let archivo = this.formAdjuntoBtn.obtenerAdjuntos();
    if (archivo) {
      documento.archivo = archivo;
    }

    if (this.enableDateEditing) {
      documento = {
        ...documento,
        ...this.formGroup.getRawValue()
      };
      documento.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
      documento.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');
      documento.flagVigente = this.formGroup.controls['flagVigente'].value ? '1' : '0';
    }


    this.documentoService.actualizarFile(documento).subscribe(res => {
      const currentDuracion = this.formGroup.get('duracion').value;
      let message = 'Registro Actualizado';
      
      if (this.originalDuracion !== currentDuracion && currentDuracion) {
        message = `Registro Actualizado. La duración de la experiencia se ha modificado a ${currentDuracion}.`;
      }
      
      functionsAlert.success(message).then((result) => {
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

  decimalOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      //Check if the text already contains the . character
      if (event.srcElement.value.split('.').length > 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    }
    return true;
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

  evaluar() {
    let obj = this.cmpOpcionEvaluar.getEvaluar();
    if(obj == null) return;
    this.documentoService.evaluarDocumento(obj, this.documento.idDocumento).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal();
      });
    })
  }

  toggleDateEditing() {
    this.enableDateEditing = !this.enableDateEditing;

    if (this.enableDateEditing) {
        this.formGroup.controls['fechaFin'].enable({ emitEvent: false })
        this.formGroup.controls['flagVigente'].enable({ emitEvent: false })

        this.flagVigenteSubscription = this.formGroup.controls.flagVigente.valueChanges.subscribe(value => {
          this.onChangeVigente();
        })
        this.fechaFinSubscription = this.formGroup.controls.fechaFin.valueChanges.subscribe(value => {
          this.onChangeFecha();
        })
        this.onChangeVigente();
    } else {
      this.formGroup.controls['fechaFin'].disable({ emitEvent: false })
      this.formGroup.controls['flagVigente'].disable({ emitEvent: false })
      
      if (this.flagVigenteSubscription) {
        this.flagVigenteSubscription.unsubscribe();
      }
      if (this.fechaFinSubscription) {
        this.fechaFinSubscription.unsubscribe();
      }
      // this.cargarDatos(this.data.documento.idDocumento);
      this.formGroup.controls.flagVigente.setValue(this.documento.flagVigente === '1' ? 1 : 0)
      this.formGroup.controls.fechaFin.setValue(this.documento.fechaFin)
      this.formGroup.controls.duracion.setValue(this.documento.duracion)  

    }
  }

  isOriginalEval() {
    return this.data.documento?.estado?.nombre.toUpperCase() == 'ORIGINAL' && (this.booleanViewEval || this.booleanView);
  }

  // booleanEditFile

  // validarFormModified() {
  //   if (this.enableDateEditing) {
  //     return false;
  //   }
  //   if (!this.formGroup.valid) {
  //     this.formGroup.markAllAsTouched()
  //     return true;
  //   }
  //   return false;
  // }
}
