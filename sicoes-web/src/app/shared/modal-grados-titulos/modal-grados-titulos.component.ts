import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { Estudio } from "src/app/interface/estudio.model";
import { Solicitud } from "src/app/interface/solicitud.model";
import { EstudioService } from "src/app/service/estudio.service";
import { ParametriaService } from "src/app/service/parametria.service";
import { ListadoEnum } from "src/helpers/constantes.components";
import { functions } from "src/helpers/functions";
import { functionsAlert } from "src/helpers/functionsAlert";
import { CmpOpcionEvaluadorComponent } from "../cmp-opcion/cmp-opcion-evaluador/cmp-opcion-evaluador.component";
import { BaseComponent } from "../components/base.component";
import { FormAdjuntosBtnComponent } from "../form-adjuntos-btn/form-adjuntos-btn.component";

@Component({
  selector: 'vex-modal-grados-titulos',
  templateUrl: './modal-grados-titulos.component.html',
  styleUrls: ['./modal-grados-titulos.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalGradosTitulosComponent extends BaseComponent implements OnInit {

  @ViewChild('formAdjuntoBtnTA01', { static: false }) formAdjuntoBtnTA01: FormAdjuntosBtnComponent;
  @ViewChild('formAdjuntoBtnTA02', { static: false }) formAdjuntoBtnTA02: FormAdjuntosBtnComponent;
  @ViewChild('cmpOpcionEvaluar', { static: false }) cmpOpcionEvaluar: CmpOpcionEvaluadorComponent;

  solicitud: Solicitud
  estudio: Estudio
  estudioTemp: Estudio
  data: any

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false
  booleanEvaluar: boolean = false
  booleanViewEval: boolean = false
  editableEvaluacion: boolean = true;
  cmpTipoRevisionEdit: boolean = false;

  formGroup = this.fb.group({
    especialidad: ['', Validators.required],
    fechaVigenciaGrado: ['', Validators.required],
    tipo: [null],
    institucion: ['', Validators.required],
    colegiatura: [''],
    fechaVigenciaColegiatura: [''],
    institucionColegiatura: [''],
    flagEgresado: [''],
    flagColegiatura: ['']
  });

  listTipo: any[]
  flagColegiado: boolean = false;
  flagTitulado: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalGradosTitulosComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private datePipe: DatePipe,
    private parametriaService: ParametriaService,
    private estudioService: EstudioService,
  ) {
    super();

    this.data = data;
    this.solicitud = data?.solicitud;

    this.formGroup.controls.flagEgresado.disable()

    this.validarOpciones(data)

    if (data.estudio) {
      this.cargarDatos(data.estudio.idEstudio)
    }

    this.formGroup.controls.flagColegiatura.valueChanges.subscribe(value => {
      this.onChangeColegiatura();
    })
    this.formGroup.controls.tipo.valueChanges.subscribe(value => {
      this.onChangeTitulado(value);
    })
  }

  validarOpciones(data) {
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    this.booleanEvaluar = data.accion == 'editEval';
    this.booleanViewEval = data.accion == 'viewEval';

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
  }

  cargarDatos(idEstudio) {


    this.estudioService.obtenerEstudio(idEstudio).subscribe(res => {
      this.estudio = res;

      this.estudio.fechaVigenciaGrado = functions.getFechaString(this.estudio.fechaVigenciaGrado);
      this.estudio.fechaVigenciaColegiatura = functions.getFechaString(this.estudio.fechaVigenciaColegiatura);
      this.formGroup.patchValue(res)
      if (res.flagEgresado == 0) {
        this.formGroup.controls.flagEgresado.setValue(null)
      }

      if (res.flagColegiatura == 0) {
        this.formGroup.controls.flagColegiatura.setValue("0")
      }

      if (this.estudio.fuente?.idListadoDetalle == 123) {
        this.formGroup.controls.especialidad.disable()
        this.formGroup.controls.tipo.disable()
        this.formGroup.controls.fechaVigenciaGrado.disable()
        this.formGroup.controls.institucion.disable()
        this.formGroup.controls.flagEgresado.disable()
      }

      if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.estudio.idEstudioPadre)) {
        this.cmpTipoRevisionEdit = true;
      }
    });
  }

  ngOnInit() {
    this.cargarCombo();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.GRADO_ACADEMICO
    ]).subscribe(listRes => {
      this.listTipo = listRes[0];
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  guardar() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return;
    }

    let obj: any = {
      ...this.formGroup.getRawValue(),
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid
      }
    }
    obj.archivos = [];

    obj.flagEgresado = this.formGroup.controls['flagEgresado'].value == "1" ? '1' : '0';
    obj.flagColegiatura = this.formGroup.controls['flagColegiatura'].value == "1" ? '1' : '0';

    obj.fechaVigenciaGrado = this.datePipe.transform(this.formGroup.controls['fechaVigenciaGrado']?.value, 'dd/MM/yyyy');
    obj.fechaVigenciaColegiatura = this.datePipe.transform(this.formGroup.controls['fechaVigenciaColegiatura']?.value, 'dd/MM/yyyy');

    let archivoTA01 = this.formAdjuntoBtnTA01?.obtenerAdjuntos();
    let archivoTA02 = this.formAdjuntoBtnTA02?.obtenerAdjuntos();
    if (archivoTA01) {
      obj.archivos.push(archivoTA01);
    }
    if (archivoTA02) {
      obj.archivos.push(archivoTA02);
    }

    this.estudioService.registrar(obj).subscribe(res => {
      functionsAlert.success('Registrado').then((result) => {
        this.closeModal();
      });
    })
  }

  evaluar() {
    let obj = this.cmpOpcionEvaluar.getEvaluar();
    if(obj == null) return;
    this.estudioService.evaluarGrado(obj, this.estudio.idEstudio).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal();
      });
    })
  }

  actualizar() {

    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return;
    }

    let obj: any = {
      ...this.formGroup.getRawValue(),
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid
      }
    }
    obj.archivos = [];

    obj.flagEgresado = this.formGroup.controls['flagEgresado'].value == "1" ? '1' : '0';
    obj.flagColegiatura = this.formGroup.controls['flagColegiatura'].value == "1" ? '1' : '0';

    obj.fechaVigenciaGrado = this.datePipe.transform(this.formGroup.controls['fechaVigenciaGrado']?.value, 'dd/MM/yyyy');
    obj.fechaVigenciaColegiatura = this.datePipe.transform(this.formGroup.controls['fechaVigenciaColegiatura']?.value, 'dd/MM/yyyy');

    let archivoTA01 = this.formAdjuntoBtnTA01?.obtenerAdjuntos();
    let archivoTA02 = this.formAdjuntoBtnTA02?.obtenerAdjuntos();
    if (archivoTA01) {
      obj.archivos.push(archivoTA01);
    }
    if (archivoTA02) {
      obj.archivos.push(archivoTA02);
    }
    this.estudioService.actualizar(obj, this.estudio.idEstudio).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal();
      });
    })
  }

  onChangeTitulado(opt: any) {

    //validacion para el campo ¿Colegiado?
    if (!opt) return;

    if (opt.idListadoDetalle == 94) {
      this.flagTitulado = true;
    } else {
      this.formGroup.controls.flagColegiatura.setValue(null)
      this.flagTitulado = false
      this.flagColegiado = false
      this.formGroup.controls["colegiatura"].setValidators(Validators.nullValidator);
      this.formGroup.controls['colegiatura'].updateValueAndValidity();

      this.formGroup.controls["fechaVigenciaColegiatura"].setValidators(Validators.nullValidator);
      this.formGroup.controls['fechaVigenciaColegiatura'].updateValueAndValidity();

      this.formGroup.controls["institucionColegiatura"].setValidators(Validators.nullValidator);
      this.formGroup.controls['institucionColegiatura'].updateValueAndValidity();
    }

    //Validación para el campo Egresado
    if (opt.idListadoDetalle == 92 || opt.idListadoDetalle == 93) {
      if (!this.booleanView && !this.booleanViewEval && !this.booleanEvaluar) {
        this.formGroup.controls.flagEgresado.enable()
      }
    } else {
      this.formGroup.controls.flagEgresado.disable()
      this.formGroup.controls.flagEgresado.setValue(null)

    }
  }

  onChangeColegiatura() {
    if (this.formGroup.controls["flagColegiatura"].value == "1") {
      this.flagColegiado = true
      this.formGroup.controls["colegiatura"].setValidators(Validators.required);
      this.formGroup.controls['colegiatura'].updateValueAndValidity();

      this.formGroup.controls["fechaVigenciaColegiatura"].setValidators(Validators.required);
      this.formGroup.controls['fechaVigenciaColegiatura'].updateValueAndValidity();

      this.formGroup.controls["institucionColegiatura"].setValidators(Validators.required);
      this.formGroup.controls['institucionColegiatura'].updateValueAndValidity();
    } else {
      this.flagColegiado = false
      this.formGroup.controls["colegiatura"].setValue(null);
      this.formGroup.controls["colegiatura"].setValidators(Validators.nullValidator);
      this.formGroup.controls['colegiatura'].updateValueAndValidity();

      this.formGroup.controls["fechaVigenciaColegiatura"].setValue(null);
      this.formGroup.controls["fechaVigenciaColegiatura"].setValidators(Validators.nullValidator);
      this.formGroup.controls['fechaVigenciaColegiatura'].updateValueAndValidity();

      this.formGroup.controls["institucionColegiatura"].setValue(null);
      this.formGroup.controls["institucionColegiatura"].setValidators(Validators.nullValidator);
      this.formGroup.controls['institucionColegiatura'].updateValueAndValidity();

      let archivoTA02 = this.formAdjuntoBtnTA02?.obtenerAdjuntos();
      this.formAdjuntoBtnTA02?.eliminarSinMensaje(archivoTA02);
    }
  }

  idEstudioPrincipal;

  changeVersion(version: any) {
    if (version.codigo == 'V1') {
      let data = {
        accion: 'viewEval'
      }
      this.idEstudioPrincipal = this.estudio.idEstudio
      this.validarOpciones(data);
      this.cargarDatos(this.estudio.idEstudioPadre);
    } else {
      this.editableEvaluacion = true;
      this.validarOpciones(this.data)
      this.cargarDatos(this.idEstudioPrincipal);
    }
  }

  noEsVacio(str) {
    return functions.noEsVacio(str);
  }
}
