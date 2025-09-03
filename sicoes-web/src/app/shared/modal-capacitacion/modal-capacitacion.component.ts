import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListadoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { BaseComponent } from '../components/base.component';
import { ParametriaService } from 'src/app/service/parametria.service';
import { CapacitacionService } from 'src/app/service/capacitacion.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { DatePipe } from '@angular/common';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { Capacitacion } from 'src/app/interface/capacitación.model';
import { functions } from 'src/helpers/functions';
import { FormAdjuntosBtnComponent } from '../form-adjuntos-btn/form-adjuntos-btn.component';
import { CmpOpcionEvaluadorComponent } from '../cmp-opcion/cmp-opcion-evaluador/cmp-opcion-evaluador.component';
import { PerfilService } from 'src/app/service/perfil.service';
import { PerfilInscripcion } from 'src/app/interface/perfil-insripcion.model';

@Component({
  selector: 'vex-modal-capacitacion',
  templateUrl: './modal-capacitacion.component.html',
  styleUrls: ['./modal-capacitacion.component.scss']
})
export class ModalCapacitacionComponent extends BaseComponent implements OnInit {

  @ViewChild('formAdjuntoBtnTA09', { static: false }) formAdjuntoBtnTA09: FormAdjuntosBtnComponent;
  @ViewChild('cmpOpcionEvaluar', { static: false }) cmpOpcionEvaluar: CmpOpcionEvaluadorComponent;

  solicitud: Solicitud
  capacitacion: Capacitacion
  data: any

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false
  booleanEvaluar: boolean = false
  booleanViewEval: boolean = false
  editableEvaluacion: boolean = true;
  flagOtroCapacitacion: boolean = false;
  cmpTipoRevisionEdit: boolean = false;
  booleanEditFile = false;
  flagPEU: boolean = false;
  flagEgreso: boolean = false;

  formGroup = this.fb.group({
    tipo: ['', Validators.required],
    detalleTipo: ['', Validators.required],
    especialidad: ['', Validators.required],
    institucion: ['', Validators.required],
    hora: ['', Validators.required],
    fechaVigencia: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
  });

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalCapacitacionComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private parametriaService: ParametriaService,
    private capacitacionService: CapacitacionService,
    private datePipe: DatePipe,
    private perfilService: PerfilService
  ) {
    super();

    this.data = data;
    this.solicitud = data?.solicitud;

    this.validarOpciones(data)

    if (data.capacitacion) {
      this.cargarDatos(data.capacitacion.idEstudio)
    }

    this.formGroup.controls.tipo.valueChanges.subscribe(value => {
      this.onChangeTipo();
    })
  }

  ngOnInit(): void {
    this.cargarCombo();
  }

  todosTipos: ListadoDetalle[] = [];
  perfilesSeleccionados: PerfilInscripcion[] = [];

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.TIPO_CAPACITACION]).subscribe(listRes => {
      const listaCompleta = listRes[0];
      this.todosTipos = listaCompleta;

      // Filtra inicialmente quitando "PEU"
      this.listTipo = listaCompleta.filter(x => x.codigo !== 'PEU');

      this.validarMostrarPEU();
    })
  }

  validarMostrarPEU() {
    this.perfilService.buscarPerfiles({ solicitudUuid: this.solicitud.solicitudUuid }).subscribe(resp => {
      this.perfilesSeleccionados = resp.content;

      const hayPerfilS4 = this.perfilesSeleccionados.some(p =>
        p.perfil?.nombre?.toUpperCase().includes('S4')
      );

      const toggleOpcion = (codigo: string) => {
        const tieneOpcion = this.listTipo.some(x => x.codigo === codigo);
        const opcion = this.todosTipos.find(x => x.codigo === codigo);

        if (hayPerfilS4 && opcion && !tieneOpcion) {
          this.listTipo.push(opcion);
          this.listTipo.sort((a, b) => Number(a.orden) - Number(b.orden));
        }

        if (!hayPerfilS4 && tieneOpcion) {
          this.listTipo = this.listTipo.filter(x => x.codigo !== codigo);
        }
      };

      toggleOpcion('PEU');
      toggleOpcion('EGRESO');
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  evaluar() {
    let obj = this.cmpOpcionEvaluar.getEvaluar();
    if(obj == null) return;
    this.capacitacionService.evaluarCapacitacion(obj, this.capacitacion.idEstudio).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal();
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

  onChangeTipo() {
    let tipo: any = this.formGroup.controls['tipo'].value
    if (tipo.nombre == "Otro") {

      if (!this.booleanView && !this.booleanViewEval && !this.booleanEvaluar && !this.booleanEditFile) {
        this.formGroup.controls['detalleTipo'].enable({ emitEvent: false })
      }
      this.formGroup.controls['detalleTipo'].setValidators(Validators.required)
      this.formGroup.controls['detalleTipo'].updateValueAndValidity
      this.flagOtroCapacitacion = true
    } else {
      this.formGroup.controls['detalleTipo'].disable({ emitEvent: false })
      this.formGroup.controls['detalleTipo'].clearValidators
      this.formGroup.controls['detalleTipo'].updateValueAndValidity
      this.formGroup.controls['detalleTipo'].reset()
      this.flagOtroCapacitacion = false
    }

    if (tipo.codigo === 'PEU') {
      this.flagPEU = true;
    } else {
      this.flagPEU = false;
    }

    if (tipo.codigo === 'EGRESO') {
      this.flagEgreso = true;
    } else {
      this.flagEgreso = false;
    }
  }

  validarOpciones(data) {
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    this.booleanEvaluar = data.accion == 'editEval';
    this.booleanViewEval = data.accion == 'viewEval';
    this.booleanEditFile = data.accion == 'editFile';

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
    }
  }

  cargarDatos(idEstudio) {

    this.capacitacionService.obtenerCapacitacion(idEstudio).subscribe(res => {
      this.capacitacion = res;
      this.capacitacion.fechaVigencia = functions.getFechaString(this.capacitacion.fechaVigencia);
      this.capacitacion.fechaInicio = functions.getFechaString(this.capacitacion.fechaInicio);
      this.capacitacion.fechaFin = functions.getFechaString(this.capacitacion.fechaFin);
      this.formGroup.patchValue(res)

      if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.capacitacion.idEstudioPadre)) {
        if(this.solicitud.estado.codigo != SolicitudEstadoEnum.OBSERVADO){
          this.cmpTipoRevisionEdit = true;
        }
      }
    });
  }

  idEstudioPrincipal;

  changeVersion(version: any) {
    if (version.codigo == 'V1') {
      let data = {
        accion: 'viewEval'
      }
      this.idEstudioPrincipal = this.capacitacion.idEstudio
      this.validarOpciones(data);
      this.cargarDatos(this.capacitacion.idEstudioPadre);
    } else {
      this.editableEvaluacion = true;
      this.validarOpciones(this.data)
      this.cargarDatos(this.idEstudioPrincipal);
    }
  }

  guardar() {
    if (this.validarForm()) return;

    let capacitacion: any = {
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ...this.formGroup.getRawValue()
    };
    if ((this.flagPEU && capacitacion.fechaVigencia) || (this.flagEgreso && capacitacion.fechaVigencia)) {
      const hoy = new Date();
      const fechaEgresoDate = new Date(capacitacion.fechaVigencia);
      const fechaLimite = new Date();
      fechaLimite.setFullYear(hoy.getFullYear() - 4);

      if (fechaEgresoDate < fechaLimite) {
        functionsAlert.error('La Fecha de Egreso no puede ser mayor a 4 años de antigüedad.');
        return;
      }
    }

    capacitacion.archivos = [];
    let archivoTA09 = this.formAdjuntoBtnTA09?.obtenerAdjuntos();
    if (archivoTA09) {
      capacitacion.archivos.push(archivoTA09);
    }

    capacitacion.fechaVigencia = this.datePipe.transform(this.formGroup.controls['fechaVigencia'].value, 'dd/MM/yyyy');
    capacitacion.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
    capacitacion.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');
    this.capacitacionService.registrarCapacitacion(capacitacion).subscribe(res => {
      functionsAlert.success('Registrado').then((result) => {
        this.closeModal()
      });
    });
  }

  actualizar() {
    if (this.validarForm()) return;

    let capacitacion: any = {
      idEstudio: this.capacitacion.idEstudio,
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ...this.formGroup.getRawValue()
    };
    if ((this.flagPEU && capacitacion.fechaVigencia) || (this.flagEgreso && capacitacion.fechaVigencia)) {
      const hoy = new Date();
      const fechaEgresoDate = new Date(capacitacion.fechaVigencia);
      const fechaLimite = new Date();
      fechaLimite.setFullYear(hoy.getFullYear() - 4);

      if (fechaEgresoDate < fechaLimite) {
        functionsAlert.error('La Fecha de Egreso no puede ser mayor a 4 años de antigüedad.');
        return;
      }
    }

    capacitacion.archivos = [];
    let archivoTA09 = this.formAdjuntoBtnTA09?.obtenerAdjuntos();
    if (archivoTA09) {
      capacitacion.archivos.push(archivoTA09);
    }

    capacitacion.fechaVigencia = this.datePipe.transform(this.formGroup.controls['fechaVigencia'].value, 'dd/MM/yyyy');
    capacitacion.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
    capacitacion.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');
    this.capacitacionService.actualizarCapacitacion(capacitacion).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }

  actualizarArchivo() {
    let obj: any = {
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid
      }
    }
    obj.archivos = [];
    let archivoTA09 = this.formAdjuntoBtnTA09?.obtenerAdjuntos();
    if (archivoTA09) {
      obj.archivos.push(archivoTA09);
    }

    this.capacitacionService.actualizarFile(obj, this.capacitacion.idEstudio).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }
}
