import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
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

@Component({
  selector: 'vex-login-extranjero',
  templateUrl: './login-extranjero.component.html',
  styleUrls: ['./login-extranjero.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LoginExtranjeroComponent extends BaseComponent implements OnInit{

  intenalUrls: InternalUrls;
  listPais: ListadoDetalle[];
  listTipoidentificacion: ListadoDetalle[];
  inputType = 'password';
  visible = false;

  formGroup = this.fb.group({
    pais: [null as ListadoDetalle, Validators.required],
    tipoIdentificacion: [null as ListadoDetalle, Validators.required],
    ruc: [null, Validators.required],
    password: [null as string, Validators.required],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authFacade: AuthFacade,
    private parametriaService: ParametriaService
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

  iniciarSesion() {
    if(this.formGroup.valid){
      let usu: any = {
        idPais: this.formGroup.controls.pais.value.idListadoDetalle,
        idTipoDocumento: this.formGroup.controls.tipoIdentificacion.value.idListadoDetalle,
        ruc: this.formGroup.controls.ruc.value
      }
      this.authFacade.login(JSON.stringify(usu), this.formGroup.controls.password.value);
    }else{
      this.formGroup.markAllAsTouched();
    }
  }

  crearCuenta() {
    this.router.navigate([Link.PUBLIC, Link.REGISTRO_EMP_EXTRANJERA]);
  }

  olvideContrasenia() {
    this.router.navigate([Link.PUBLIC, Link.RECUPERAR_CONTRASENIA]);
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

}
