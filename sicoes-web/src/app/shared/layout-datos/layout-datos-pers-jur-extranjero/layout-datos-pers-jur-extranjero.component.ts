import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { PidoService } from 'src/app/service/pido.service';
import { ListadoEnum, TipoDocumentoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../../components/base.component';
import { UbigeoUpdComponent } from '../../ubigeo-upd/ubigeo-upd.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'vex-layout-datos-pers-jur-extranjero',
  templateUrl: './layout-datos-pers-jur-extranjero.component.html',
  styleUrls: ['./layout-datos-pers-jur-extranjero.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutDatosPersJurExntrajeroComponent extends BaseComponent implements OnInit, OnChanges {

  @ViewChild('formUbigeo', { static: true }) formUbigeo: UbigeoUpdComponent;
  @Input() SOLICITUD: any;
  @Input() editable: boolean = false;
  @Input() actualizable = false;

  listPais: any[]
  listTipoDocumento: any[]

  flagSne = false;
  flagValidacion = false;
  flagCodigoValidacion = false;
  isDisabledBtnCorreo = true;
  isDisabledBtnCodigo = false;
  editableUbigeo = false;

  matcher = new MyErrorStateMatcher();

  errorMsgSNE: string;
  msgCodigo: string;

  formGroup = this.fb.group({
    pais: [null as ListadoDetalle, Validators.required],
    tipoDocumento: [null as ListadoDetalle, Validators.required],
    numeroDocumento: ['', Validators.required],
    codigoRuc: ['', Validators.required],
    nombreRazonSocial: ['', Validators.required],
    direccion: ['', Validators.required],
    codigoDepartamento: [''],
    codigoProvincia: [''],
    codigoDistrito: [''],
    codigoPartidaRegistral: [''],
    telefono1: ['', Validators.required],
    telefono2: [''],
    telefono3: [''],
    correo: ['', [Validators.required, Validators.email]],
    codigo: [''],
  });

  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private pidoService: PidoService
  ) {
    super();
    this.formGroup.controls['pais'].disable({ emitEvent: false })
    this.formGroup.controls['nombreRazonSocial'].disable({ emitEvent: false })
    this.formGroup.controls.pais.valueChanges.subscribe(value => {
      this.onChangePais();
    })
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.formGroup.get('correo').valueChanges.subscribe(() => this.isDisabledBtnCorreo = false)

    if (!this.editable && !this.actualizable) {
      this.disableAllForm(this.formGroup);
      this.editableUbigeo = false;
    }else if (!this.editable && this.actualizable) {
      this.disableControls(true, ['tipoDocumento', 'numeroDocumento', 'nombreRazonSocial', 'direccion', 'codigoPartidaRegistral',], this.formGroup);
      this.editableUbigeo = false;
    }else{
      this.disableControls(true, ['tipoDocumento', 'numeroDocumento', 'nombreRazonSocial', 'correo'], this.formGroup);
      this.editableUbigeo = false;
    }
    this.formUbigeo.setValue(
      {
        codigoDepartamento: '150000',
        codigoDistrito: '150101',
        codigoProvincia: '150100',
        nombreDepartamento: 'LIMA',
        nombreDistrito: 'LIMA',
        nombreProvincia: 'LIMA',
        departamento: 'LIMA',
        distrito: 'LIMA',
        provincia: 'LIMA',
        ubigeo: '15010'
        }
    );
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.PAIS
    ]).subscribe(listRes => {
      this.listPais = listRes[0];
    })
  }

  onChangePais() {
    let pais: any = this.formGroup.controls['pais'].getRawValue()
    this.cargarTipoIdentificacionTrubutaria(pais.idListadoDetalle);
  }
  
  cargarTipoIdentificacionTrubutaria(idPais) {
    this.parametriaService.obtenerSubListado(ListadoEnum.TIPO_IDEN_TRIBUTARIA, idPais).subscribe(res => {
      this.listTipoDocumento = res
    });
  }

  public validarFlagValidacion() {
    if (!this.flagCodigoValidacion) {
      return false;
    }
    return true;
  }

  public validarSNE(usu) {
    this.pidoService.validarSNE(usu).subscribe({
      next: (resp) => {
        if (resp.resultCode == "N") {
          this.errorMsgSNE = resp.message;
          this.flagSne = true;
        }
        if (resp.resultCode == "A") {
          this.errorMsgSNE = resp.message;
          this.formGroup.controls.correo.setValue(resp.correoAfiliado)
          this.pidoService.setSne(resp);
          this.flagSne = false;
          this.flagCodigoValidacion = true;
          this.formGroup.controls['correo'].disable({ emitEvent: false })
        }
      },
      error: (e) => {

      }
    }
    );
  }

  public validarDatosPJ() {
    this.formGroup.markAllAsTouched();
    return this.formGroup.valid;
  }

  public getFormValues() {
    return {
      ...this.formGroup.getRawValue(),
      ...this.formUbigeo.getUbigeo()
    };
  }

  public validarDocumento(tipoDocumento, numeroDocumento) {
    this.pidoService.buscarNroDocumento(tipoDocumento.codigo, numeroDocumento).subscribe(resp => {
      if (resp?.resultCode === '0000' || resp?.resultCode === '0') {
        this.formGroup.patchValue({
          ...resp
        })
        this.formUbigeo.setValue(resp)
        //this.disableControls(true);
      } else {
        this.editable = true;
        functionsAlert.error(resp.deResultado);
        this.limpiarDatosDocumento();
        this.formGroup.controls['nombreRazonSocial'].enable({ emitEvent: true })
        //this.disableControls(false);
      }
    });
  }

  public limpiarDatosDocumento() {
    let datos = {
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      direccion: ''
    }
    this.formGroup.patchValue({
      ...datos
    })
    //this.formUbigeo.setValue(datos)
  }

  public validarEmail(correo) {

    this.formGroup.controls.correo.markAsTouched();
    if (!this.formGroup.controls.correo.valid) {
      return;
    }

    this.pidoService.validarEmail(correo).subscribe(req => {
      this.isDisabledBtnCorreo = true;
      this.flagValidacion = true;
      this.msgCodigo = "Verifique el código en la bandeja de entrada de su correo."
    });
  }

  public validarCodigoEmail(codigo) {
    this.pidoService.validarCodigoEmail(codigo).subscribe({
      next: (resp) => {
        functionsAlert.success("Código validado")
        this.flagCodigoValidacion = true
        this.isDisabledBtnCodigo = true
        this.formGroup.controls['correo'].disable({ emitEvent: false })
        this.msgCodigo = "Código validado"
        return true
      },
      error: (e) => {
        this.flagCodigoValidacion = false
        this.msgCodigo = "Código ingresado incorrecto"
        return false
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.SOLICITUD) {
      this.setValues();
    }
  }

  setValues() {
    this.formGroup.patchValue(this.SOLICITUD.persona)
    this.formUbigeo.setValue(this.SOLICITUD.persona)
  }

  mostrarBtnValidarEmail() {
    console.log(this.editable, this.actualizable, this.flagSne);
    
    return (this.editable || this.actualizable) && this.flagSne;
  }
  
}
    