import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { UsuarioService } from 'src/app/service/usuario.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { functions } from 'src/helpers/functions';

@Component({
  selector: 'vex-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RecuperarContraneniaComponent extends BaseComponent implements OnInit{

  intenalUrls: InternalUrls;
  listPais: ListadoDetalle[];
  listTipoidentificacion: ListadoDetalle[];
  
  inputType = 'password';
  visible = false;

  inputType1 = 'password';
  visible1 = false;

  isDisabledBtnPasoUno = true;
  isDisabledBtnCorreo = false;
  isDisabledBtnCodigo = true;
  isDisabledBtnRegistrar = true;

  msgCodigo: string;

  isPasoDosVisible = false;
  isPasoTresVisible = false;

  formGroup = this.fb.group({
    pais: [null as ListadoDetalle, Validators.required],
    tipoDocumento: [null as ListadoDetalle, Validators.required],
    codigoRuc: [null, Validators.required],
    correo: [{value: '', disabled: true }],
    codigoVerificacion: [''],
    contrasenia: [null as string],
    contraseniaRepetir: [null as string],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private parametriaService: ParametriaService,
    private usuarioService: UsuarioService,
  ) {
    super();
    this.formGroup.controls.pais.valueChanges.subscribe(value => {
      this.onChangePais();
    })
  }

  ngOnInit(): void {
    this.cargarCombo();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetallePublico([
      ListadoEnum.PAIS
    ]).subscribe(listRes => {
      this.listPais = listRes[0]
    })
  }

  onChangePais() {
    let pais: any = this.formGroup.controls['pais'].value;
    this.cargarTipoIdentificacionTrubutaria(pais.idListadoDetalle);
  }

  cargarTipoIdentificacionTrubutaria(idPais) {
    this.parametriaService.obtenerSubListadoPublico(ListadoEnum.TIPO_IDEN_TRIBUTARIA, idPais).subscribe(res => {
      this.listTipoidentificacion = res
    });
  }

  pasoUno() {
    this.formGroup.markAllAsTouched();
    if(!this.formGroup.valid) return;

    this.usuarioService.obtenerCorreo(this.formGroup.getRawValue()).subscribe(req => {
      this.disableControls(true, ['pais', 'tipoDocumento', 'codigoRuc'], this.formGroup);
      this.formGroup.controls.correo.setValue(req.correo);
      this.isDisabledBtnPasoUno = false;
      this.isPasoDosVisible = true;
    });

  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  toggleVisibility1() {
    if (this.visible1) {
      this.inputType1 = 'password';
      this.visible1 = false;
      this.cd.markForCheck();
    } else {
      this.inputType1 = 'text';
      this.visible1 = true;
      this.cd.markForCheck();
    }
  }

  public recuperarContrasenia() {
    this.isDisabledBtnCorreo = true;

    this.usuarioService.recuperarContrasenia(this.formGroup.getRawValue()).subscribe({
      next: (resp) => {
        this.isDisabledBtnCodigo = false;
        this.formGroup.controls['codigoVerificacion'].setValidators([Validators.required]);
        this.formGroup.controls['codigoVerificacion'].updateValueAndValidity();
        functionsAlert.success('Verifique el código en la bandeja de entrada de su correo.').then((result) => {
        });
      },
      error: (e) => {
        this.isDisabledBtnCorreo = false;
      }
    });
  }

  public validarCodigoVerificacion(codigoVerificacion){
    this.formGroup.controls.codigoVerificacion.markAsTouched();
    if (!this.formGroup.controls.codigoVerificacion.valid) {
      return;
    }

    this.isDisabledBtnCodigo = true;

    this.usuarioService.validarCodigoEmail(codigoVerificacion).subscribe({
      next: (resp) => {
        this.disableControls(true, ['codigoVerificacion'], this.formGroup);
        this.formGroup.controls['contrasenia'].setValidators([Validators.required]);
        this.formGroup.controls['contrasenia'].updateValueAndValidity();
        this.formGroup.controls['contraseniaRepetir'].setValidators([Validators.required]);
        this.formGroup.controls['contraseniaRepetir'].updateValueAndValidity();
        this.isPasoTresVisible = true;
        this.isDisabledBtnCodigo = true;
        this.isDisabledBtnRegistrar = false;
        this.msgCodigo = "Código validado";
      },
      error: (e) => {
        this.isDisabledBtnCodigo = false;
        this.msgCodigo = "Código ingresado incorrecto";
      }
    });
  }

  actualizarContrasenia(){
    this.formGroup.markAllAsTouched();
    if(!this.formGroup.valid) return;

    this.isDisabledBtnCorreo = true;

    let obj = {
      codigoToken: this.formGroup.controls.codigoVerificacion.getRawValue(),
      contrasenia: this.formGroup.controls.contrasenia.getRawValue(),
      confirmarContrasenia: this.formGroup.controls.contraseniaRepetir.getRawValue(),
    }

    this.usuarioService.cambiarContrasenia(obj).subscribe({
      next: (resp) => {
      
        functionsAlert.success('Contraseña Actualizada').then((result) => {
          this.router.navigate([Link.PRINCIPAL]);
        });
      },
      error: (e) => {
        
      }
    });
  }

  cancelar(){
    functionsAlert.questionSiNo('¿Seguro que desea cancelar?').then((result) => {
      if (result.isConfirmed) {
        this.router.navigate([Link.PRINCIPAL]);
      }
    });
  }

}
