import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { OtroRequisito } from 'src/app/interface/otro-requisito.model';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { OtroRequisitoService } from 'src/app/service/otro-requisito.service';
import { ParametriaService } from 'src/app/service/parametria.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { FormatoLocal, ListadoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';
import { ModalOtroRequisitoObservacionComponent } from '../modal-otro-requisito-observacion/modal-otro-requisito-observacion.component';
import { ModalTerminosComponent } from '../modal-terminos/modal-terminos.component';
import { AdjuntosService } from 'src/app/service/adjuntos.service';

@Component({
  selector: 'vex-layout-otros-requisitos',
  templateUrl: './layout-otros-requisitos.component.html',
  styleUrls: ['./layout-otros-requisitos.component.scss']
})
export class LayoutOtrosRequisitosComponent extends BaseComponent implements OnInit, OnDestroy {

  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>

  ultimaVersion = true;
  cmpTipoRevisionEdit: boolean = false;

  @Input() editable: boolean = false;
  @Input() editModified = false;
  @Input() version: boolean = false;
  @Input() isSubsanar: boolean = false;
  @Input() viewEvaluacion: boolean;
  @Input() actualizable: boolean = false;

  listOpcion: ListadoDetalle[] = []
  listOtrosDocumento: OtroRequisito[]

  formGroup = this.fb.group({
    terminos: [false, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private solicitudService: SolicitudService,
    private otroRequisitoService: OtroRequisitoService,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private parametriaService: ParametriaService,
    private adjuntoService: AdjuntosService
  ) {
    super();
    this.activeRoute.data.subscribe(data => {
      this.editable = data.editable;
      this.isSubsanar = data.isSubsanar;
      this.editModified = data.editModified;
    })
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.cargarCombo();
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  obtenerFiltro() {
    return {
      solicitudUuid: this.solicitudUuid
    };
  }

  private suscribirSolicitud() {
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      this.solicitud = sol;
      if (sol?.solicitudUuid) {
        this.solicitudUuid = this.solicitud.solicitudUuid;
        if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.solicitud.solicitudUuidPadre)) {
          //if(this.solicitud.estado.codigo != SolicitudEstadoEnum.OBSERVADO){
            this.cmpTipoRevisionEdit = true;
          //}
        }

        this.buscarOtrosDocumentos();

        if(this.solicitud.estado.codigo != SolicitudEstadoEnum.BORRADOR){
          this.editable = false;
        }
      }
    });
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.RESULTADO_EVALUACION,

    ]).subscribe(listRes => {
      listRes[0]?.forEach(item => {
        //if(item.codigo != 'RE_01'){
        this.listOpcion.push(item);
        //}
      });
    })
  }

  buscarOtrosDocumentos() {
    this.otroRequisitoService.buscarOtroRequisitos(this.obtenerFiltro()).subscribe(resp => {
      this.listOtrosDocumento = resp.content;
      if (this.actualizable || this.editModified) {
        this.listOtrosDocumento.forEach(otro => {
          if (otro.tipoRequisito.codigo == 'OPJ04' || otro.tipoRequisito.codigo == 'OPN03') {
            otro.archivo = null;
          }
        });
      }
    });
  }

  validarCodigo(str: string, codigos: string): boolean {
    return codigos.includes(str);
  }

  descargarFormato03() {
    let nombre = 'FORMATO_03.docx';
    if(this.actualizable){
      nombre = 'FORMATO_03_ACT.docx';
    } else if(this.editModified){
      nombre = 'FORMATO_03_MOD.docx';
    }
    this.adjuntoService.downloadFormato(FormatoLocal.FORMATO_03, nombre);
  }

  descargarFormato01() {
    let nombre = 'FORMATO_01.docx';
    if(this.actualizable){
      nombre = 'FORMATO_01_ACT.docx';
    } else if(this.editModified){
      nombre = 'FORMATO_01_MOD.docx';
    }
    this.adjuntoService.downloadFormato(FormatoLocal.FORMATO_01, nombre);
  }
  
  setValueCheckedFirma(obj, even) {
    obj.flagFirmaDigital = even.value;
  }

  setValueElectronico(obj, even) {
    obj.flagElectronico = even.value
  }


  getValues() {
    return this.listOtrosDocumento;
  }

  setValueChecked(obj, even) {
    obj.flagActivo = even.checked ? '1' : null;
  }

  public validarOtrosDocumentos() {
    let val = true;
    this.listOtrosDocumento.forEach(item => {
      if(!val) return;
      if (functions.esVacio(item?.flagActivo) && !['OPN05'].includes(item.tipoRequisito?.codigo)) {
        this.snackbar.open('Debe llenar todos los campos en la sección OTROS REQUISITOS: ' + item.tipoRequisito.nombre, 'Cerrar', {
          duration: 7000,
        })
        val = false;
      }
      if (item.tipoRequisito.idListadoDetalle == 114) {
        if (functions.esVacio(item?.flagElectronico)) {
          this.snackbar.open('Debe llenar todos los campos en la sección OTROS REQUISITOS: Seleccionar opción en DNI Electrónico', 'Cerrar', {
            duration: 7000,
          })
          val = false;
        } if (functions.esVacio(item?.flagFirmaDigital)) {
          this.snackbar.open('Debe llenar todos los campos en la sección OTROS REQUISITOS: Seleccionar opción en Firma Digital', 'Cerrar', {
            duration: 7000,
          })
          val = false;
        }
      }
      if (functions.esVacio(item?.archivo) && !['OPN04', 'OPJ05', 'OPN05', 'OEXT03'].includes(item.tipoRequisito?.codigo)) {
        this.snackbar.open('Debe Adjuntar todos los archivos en la seccion OTROS REQUISITOS: ' + item.tipoRequisito.nombre, 'Cerrar', {
          duration: 7000,
        })
        val = false;
      }

    })
    return val;
  }

  setValueFecha(dato, otro) {
    let fecha = this.datePipe.transform(dato.value, 'dd/MM/yyyy')
    otro.fechaExpedicion = fecha;
  }

  registrarObs(otro) {
    this.registrarObsAcc(otro, 'add');
  }

  registrarObsAcc(otro, accion) {
    if(otro.idOtroRequisitoPadre){
      this.otroRequisitoService.obtenerOtroRequisitos(otro.idOtroRequisitoPadre).subscribe(otroPadre => {
        this.mostrarModal(otroPadre, accion);
      });
    }else{
      this.mostrarModal(otro, accion);
    }
  }

  mostrarModal(otroReq, accion){
    this.dialog.open(ModalOtroRequisitoObservacionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        otroRequisito: otroReq,
        accion: accion
      },
    }).afterClosed().subscribe(() => {
      this.buscarOtrosDocumentos();
    });
  }


  guardarEstado(val, otro) {
    otro.evaluacion = {
      idListadoDetalle: val.value
    }
    this.otroRequisitoService.evaluarOtroRequisito(otro).subscribe(res => {
      functionsAlert.success('Requisito Actualizado').then((result) => {

      });
    });
  }

  validarEdicion(otroReq) {
    if (this.solicitud.isUltimaSolicitud) {
      return false;
    }

    if(!this.ultimaVersion){
      return true;
    }

    if ((otroReq.evaluacion?.codigo == 'RE_01' && this.editable == true) || this.editModified == true) {
      return false;
    }

    if (['RE_04', 'RE_07', 'RE_01'].includes(otroReq.evaluacion?.codigo) && this.isSubsanar == true) {
      return false;
    }

    return true;

  }

  esValido() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return false;
    }
    return true;
  }

  abrirTerminos(obj, event) {

    let vali = this.validarEdicion(obj);

    if(vali){
      this.formGroup.controls.terminos.setValue(true);
      return;
    }

    event.preventDefault();

    this.dialog.open(ModalTerminosComponent, {
      disableClose: true,
      width: '800px',
      maxHeight: 'auto',
      data: {
        obj: obj
      }
    }).afterClosed().subscribe(result => {
      if(result == 'ACEPTAR'){
        this.formGroup.controls.terminos.setValue(true)
        obj.flagActivo = '1';
      }else{
        this.formGroup.controls.terminos.setValue(false)
        obj.flagActivo = null;
      }
    });
    
  }

  solicitudUuid;
  solicitudUuidPrincipal;

  changeVersion(version: any) {
    if (version.codigo == 'V1') {
      this.solicitudUuidPrincipal = this.solicitud.solicitudUuid;
      this.solicitudUuid = this.solicitud?.solicitudUuidPadre
      this.ultimaVersion = false;
      this.buscarOtrosDocumentos();
    } else {
      this.solicitudUuid = this.solicitudUuidPrincipal;
      this.ultimaVersion = true;
      if(this.solicitudUuid){
        this.buscarOtrosDocumentos();
      }
    }
  }

  validarEdicionPorActMod(otroReq) {
    let val = otroReq?.tipoRequisito?.codigo;

    if(!val){
      return false;
    }

    if(['OPJ04', 'OPN03'].includes(val) && (this.actualizable || this.editModified)){
      return true;
    }

    return false;
  }

  strValidarEdicionPorActMod(otroReq) {
    if (this.actualizable) {
      return '(Actualización)';
    }
    if (this.editModified) {
      return '(Modificación)';
    }
    return '';
  }

  formatearNombreRequisito(nombre: string): string {
    return nombre.replace(/\(Actualizada \d{2}\/\d{2}\/\d{4}\)/g, '<strong>$&</strong>');
  }
}
