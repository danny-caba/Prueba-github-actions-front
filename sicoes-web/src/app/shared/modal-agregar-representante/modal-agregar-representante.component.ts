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
import { ListadoEnum, TipoDocumentoEnum } from "src/helpers/constantes.components";
import { functions } from "src/helpers/functions";
import { functionsAlert } from "src/helpers/functionsAlert";
import { CmpOpcionEvaluadorComponent } from "../cmp-opcion/cmp-opcion-evaluador/cmp-opcion-evaluador.component";
import { BaseComponent } from "../components/base.component";
import { FormAdjuntosBtnComponent } from "../form-adjuntos-btn/form-adjuntos-btn.component";
import { PidoService } from "src/app/service/pido.service";

@Component({
  selector: 'vex-modal-grados-titulos',
  templateUrl: './modal-agregar-representante.component.html',
  styleUrls: ['./modal-agregar-representante.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalAgregarRepresentanteComponent extends BaseComponent implements OnInit {

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
  listTipoDocumento: any[] = []

  formGroup = this.fb.group({
    tipoDocumento: [{},Validators.required],
    numeroDocumento: ['', Validators.required],
    nombres: ['', Validators.required],
    apellidoPaterno: ['', Validators.required],
    apellidoMaterno: ['', Validators.required],
  });

  listTipo: any[]
  flagColegiado: boolean = false;
  flagTitulado: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalAgregarRepresentanteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private datePipe: DatePipe,
    private pidoService: PidoService,
    private parametriaService: ParametriaService,
    private estudioService: EstudioService,
  ) {
    super();
    this.data = data;
    this.solicitud = data?.solicitud;

  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.TIPO_DOCUMENTO]).subscribe(listRes => {
      listRes[0]?.forEach(item => {
        if (item.codigo != 'RUC') {
          this.listTipoDocumento.push(item);
        }
      });
    })
  }

  ngOnInit() {
    this.cargarCombo();
  }

  closeModal() {
    this.dialogRef.close(null);
  }

  public validarDocumento(tipoDocumento, numeroDocumento) {

    if(!tipoDocumento || !numeroDocumento || !tipoDocumento.codigo) {
      functionsAlert.error('Ingrese tipo de documento y número de documento');
      return;
    }

    if (numeroDocumento.length < 8 || numeroDocumento.length > 12) {
      functionsAlert.error('Ingrese número de documento válido');
      return;
    }

    this.pidoService.buscarNroDocumentoRepresentante(tipoDocumento.codigo, numeroDocumento).subscribe({
      next: (resp) => {
        if (resp?.resultCode === '0000' || resp?.resultCode === '0') {

          this.formGroup.patchValue({
            ...resp
          })
          //this.disableControls(true);
        } else {
          //this.editable = true;
          functionsAlert.error(resp.message);
          this.limpiarDatosDocumento();
          //this.disableControls(false);
        }
        if(tipoDocumento.codigo == TipoDocumentoEnum.CARNET_EXTRA && resp?.resultCode === '0001'){
          functionsAlert.error(resp.message);
          this.limpiarDatosDocumento();
        }
      },
      error: (e) => {
        //FIXME que hacer en Error Tecnico?
        this.limpiarDatosDocumento();
      }
    });
  }

  public limpiarDatosDocumento() {
    let datos = {
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    }
    this.formGroup.patchValue({
      ...datos
    })
    //this.formUbigeo.setValue(datos)
  }

  grabar() {
    if (this.formGroup.valid) {
      let data = this.formGroup.getRawValue();
      this.dialogRef.close(data);
    } else {
      functionsAlert.error('Complete los campos requeridos');
    }
  }
}
