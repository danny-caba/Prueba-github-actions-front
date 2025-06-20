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
  selector: 'vex-layout-datos-pers-nat',
  templateUrl: './layout-datos-pers-nat.component.html',
  styleUrls: ['./layout-datos-pers-nat.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutDatosPersNatComponent extends BaseComponent implements OnInit, OnChanges {

  @ViewChild('formUbigeo', { static: true }) formUbigeo: UbigeoUpdComponent;
  @Input() SOLICITUD: any;
  @Input() editable: boolean = false;
  @Input() actualizable = false;

  listTipoDocumento: any[] = []

  flagSne = false;
  flagValidacion = false;
  flagCodigoValidacion = false;
  isDisabledBtnCorreo = true;
  isDisabledBtnCodigo = false;
  editableUbigeo = false;
  editableDocumento = true;

  matcher = new MyErrorStateMatcher();

  errorMsgSNE: string;
  msgCodigo: string;

  formGroup = this.fb.group({
    tipoDocumento: [null as ListadoDetalle, Validators.required],
    numeroDocumento: ['', Validators.required],
    nombres: ['', Validators.required],
    apellidoPaterno: ['', Validators.required],
    apellidoMaterno: ['', Validators.required],
    codigoTipoPN: [''],
    tipoPN: [''],
    codigoRuc: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono1: ['', Validators.required],
    telefono2: [''],
    telefono3: [''],
    correo: ['', [Validators.required, Validators.email]],
    codigo: ['']
  });

  constructor(
    private fb: FormBuilder,
    private pidoService: PidoService,
    private parametriaService: ParametriaService) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.formGroup.get('correo').valueChanges.subscribe(() => this.isDisabledBtnCorreo = false)

    if(this.editable){
      this.formGroup.controls.tipoDocumento.valueChanges.subscribe(value => {
        if(value?.codigo == TipoDocumentoEnum.CARNET_EXTRA){
          this.disableControls(false, ['direccion'], this.formGroup);
          this.editableUbigeo = true;
        } else {
          this.disableControls(true, ['direccion', 'tipoPN'], this.formGroup);
          this.editableUbigeo = false;
        }
        this.limpiarDatosDocumento();
        this.formUbigeo.clear();
      })
    }
    // if(this.actualizable){
      // this.formGroup.controls.tipoDocumento.valueChanges.subscribe(value => {
        // if(value?.codigo == TipoDocumentoEnum.CARNET_EXTRA){
        //   this.disableControls(false, ['direccion'], this.formGroup);
        //   this.editableUbigeo = true;
        // } else {
          // this.disableControls(true, ['direccion', 'tipoPN'], this.formGroup);
          // this.editableUbigeo = true;
          // this.disableControls(true, ['direccion'], this.formGroup);
        // }
        // this.limpiarDatosDocumento();
        // this.formUbigeo.clear();
      // })
    // }
  }



  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.TIPO_DOCUMENTO]).subscribe(listRes => {
      listRes[0]?.forEach(item => {
        if(item.codigo != 'RUC'){
          this.listTipoDocumento.push(item);
        }
      });
    })
  }

  public validarDocumentoSesion(tipoDocumento, numeroDocumento) {
    this.pidoService.buscarNroDocumento(tipoDocumento.codigo, numeroDocumento).subscribe(resp => {
      this.formGroup.controls.codigoTipoPN.setValue(resp?.codigoTipoNegocio);
      this.formGroup.controls.tipoPN.setValue(resp?.nombreTipoNegocio);
    });
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

  public validarDatosPN() {
    this.formGroup.markAllAsTouched();
    this.formUbigeo.esValido();
    return this.formGroup.valid && this.formUbigeo.esValido();
  }

  public validarFlagValidacion() {
    if (!this.flagCodigoValidacion) {
      return false;
    }
    return true;
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

  public validarDocumento(tipoDocumento, numeroDocumento) {
    this.formGroup.clearValidators();
    if (!tipoDocumento || !numeroDocumento) {
      this.formGroup.controls.tipoDocumento.markAsTouched();
      this.formGroup.controls.numeroDocumento.markAsTouched();
      return;
    }

    this.pidoService.buscarNroDocumento(tipoDocumento.codigo, numeroDocumento).subscribe(resp => {

      if (resp?.resultCode === '0000' || resp?.resultCode === '0') {

        this.formGroup.patchValue({
          ...resp
        })
        this.formUbigeo.setValue(resp)
        //this.disableControls(true);
      } else {
        this.editable = true;
        functionsAlert.error(resp.deResultado || resp.message);
        this.limpiarDatosDocumento();
        //this.disableControls(false);
      }

    });
  }

  public setDNI(){
    let dni = this.listTipoDocumento.find(d => d.codigo === TipoDocumentoEnum.DNI);
    console.info(this.listTipoDocumento[0])
    console.info(this.listTipoDocumento)
    console.info(dni)
    this.formGroup.controls['tipoDocumento'].setValue(dni);
  }

  public validarSNE(usu) {
    this.pidoService.validarSNE(usu).subscribe({
      next: (resp) => {
        if (resp.resultCode == "N") {
          this.errorMsgSNE = resp.message;
          this.flagSne = true;
        }
        if (resp.resultCode == "A") {
          this.pidoService.setSne(resp);
          this.errorMsgSNE = resp.message;
          this.formGroup.controls.correo.setValue(resp.correoAfiliado)
          this.flagSne = false
          this.flagCodigoValidacion = true;
          this.formGroup.controls['correo'].disable({ emitEvent: false })
        }
      },
      error: (e) => {
        //FIXME que hacer en Error Tecnico?
      }
    }
    );
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

  public getFormValues() {
    return {
      ...this.formGroup.getRawValue(),
      ...this.formUbigeo.getUbigeo()
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.SOLICITUD) {
      this.setValues();
    }

    let codigoRuc =  this.formGroup.controls.codigoRuc.getRawValue();
    let tipoDocumento =  this.formGroup.controls.tipoDocumento.getRawValue();

    if (this.editable) {
      if (tipoDocumento?.codigo == TipoDocumentoEnum.CARNET_EXTRA){
        this.disableControls(true, ['apellidoPaterno', 'apellidoMaterno', 'nombres', 'tipoPN', 'codigoRuc'], this.formGroup);
        this.editableUbigeo = true;
      } else if (codigoRuc?.length == 11 && !codigoRuc.startsWith('10')) {
        this.disableControls(true, ['apellidoPaterno', 'apellidoMaterno', 'nombres', 'direccion', 'tipoPN', 'codigoRuc'], this.formGroup);
        this.editableUbigeo = false;
      } else {
        this.disableControls(true, ['apellidoPaterno', 'apellidoMaterno', 'nombres', 'direccion', 'tipoPN', 'codigoRuc', 'tipoDocumento', 'numeroDocumento'], this.formGroup);
        this.editableUbigeo = false;
      }
    } else if (this.actualizable) {
      this.disableControls(true, ['apellidoPaterno', 'apellidoMaterno', 'nombres', 'tipoPN', 'codigoRuc', 'tipoDocumento', 'numeroDocumento'], this.formGroup);
      this.editableUbigeo = true;
    } else {
      this.disableAllForm(this.formGroup);
    }
  }

  /*private disableControls(active: boolean) {
    ['apellidoPaterno', 'apellidoMaterno', 'nombres', 'direccion'].forEach(name => {
      if (active) this.formGroup.controls[name].disable({ emitEvent: false })
      else this.formGroup.controls[name].enable({ emitEvent: false })
    })
  }*/

  setValues() {
    this.formGroup.patchValue(this.SOLICITUD?.persona)
    this.formUbigeo.setValue(this.SOLICITUD?.persona)
  }

  setDocumentoNoEditable(){
    this.editableDocumento = false;
  }

}
