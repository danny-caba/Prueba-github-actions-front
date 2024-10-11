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

@Component({
  selector: 'vex-registro-emp-extranjera',
  templateUrl: './registro-emp-extranjera.component.html',
  styleUrls: ['./registro-emp-extranjera.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RegistroEmpExtranjeraComponent extends BaseComponent implements OnInit{

  intenalUrls: InternalUrls;
  listPais: ListadoDetalle[];
  listTipoidentificacion: ListadoDetalle[];
  
  inputType = 'password';
  visible = false;

  inputType1 = 'password';
  visible1 = false;

  isDisabledBtnCorreo = false;
  isDisabledBtnCodigo = true;
  isDisabledBtnRegistrar = true;

  msgCodigo: string;

  formGroup = this.fb.group({
    pais: [null as ListadoDetalle, Validators.required],
    tipoDocumento: [null as ListadoDetalle, Validators.required],
    codigoRuc: [null, Validators.required],
    razonSocial: [null, Validators.required],
    telefono: [null, Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    codigoVerificacion: ['', Validators.required],
    contrasenia: [null as string, Validators.required],
    contraseniaRepetir: [null as string, Validators.required],
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

  registrar() {
    this.formGroup.markAllAsTouched();
    if(!this.formGroup.valid) return;
      
    this.usuarioService.registrar(this.formGroup.getRawValue()).subscribe(req => {
      this.formGroup.disable();
      functionsAlert.success('Datos Guardados').then((result) => {
        this.router.navigate([Link.PRINCIPAL]);
      });
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

  public validarEmail(correo) {
    //this.isDisabledBtnCorreo = true;
    this.formGroup.controls.correo.markAsTouched();
    if (!this.formGroup.controls.correo.valid) {
      return;
    }

    this.usuarioService.validarEmail(correo).subscribe({
      next: (resp) => {
        this.isDisabledBtnCorreo = true;
        this.isDisabledBtnCodigo = false;
        functionsAlert.success('Verifique el código en la bandeja de entrada de su correo.').then((result) => {
          
        });
      },
      error: (e) => {
        this.isDisabledBtnCorreo = false;
      }
    });
  }

  public validarCodigoVerificacion(codigoVerificacion){
    this.isDisabledBtnCodigo = true;
    this.formGroup.controls.codigoVerificacion.markAsTouched();
    if (!this.formGroup.controls.codigoVerificacion.valid) {
      return;
    }

    this.usuarioService.validarCodigoEmail(codigoVerificacion).subscribe({
      next: (resp) => {
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

}
