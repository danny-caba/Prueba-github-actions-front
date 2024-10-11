import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { PidoService } from 'src/app/service/pido.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LayoutDatosPersNatComponent } from 'src/app/shared/layout-datos/layout-datos-pers-nat/layout-datos-pers-nat.component';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';
import { LayoutDatosPersJurExntrajeroComponent } from 'src/app/shared/layout-datos/layout-datos-pers-jur-extranjero/layout-datos-pers-jur-extranjero.component';
import { LayoutDatosRepresentanteLegalComponent } from 'src/app/shared/layout-datos/layout-datos-representante-legal/layout-datos-representante-legal.component';

@Component({
  selector: 'vex-solicitud-pj-extrnajero-form',
  templateUrl: './solicitud-pj-extrnajero-form.component.html',
  styleUrls: ['./solicitud-pj-extrnajero-form.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudPjExtrnajeroFormComponent extends BaseComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  subscriptionUsuario: Subscription = new Subscription();

  @ViewChild('layoutDatos', { static: true }) layoutDatos: LayoutDatosPersJurExntrajeroComponent;
  @ViewChild('layoutRepresentanteLeg', { static: true }) layoutRepresentanteLeg: LayoutDatosRepresentanteLegalComponent;

  constructor(
    private router: Router,
    private pidoService: PidoService,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptionUsuario = this.usuario$.subscribe(usu => {
      if (usu) {
        this.layoutDatos.formGroup.controls['codigoRuc'].setValue(usu.codigoRuc);
        this.layoutDatos.formGroup.controls['nombreRazonSocial'].setValue(usu.nombreUsuario);
        this.layoutDatos.formGroup.patchValue(usu);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptionUsuario.unsubscribe();
  }

  borrador() {
    if (!this.layoutDatos.validarDatosPJ()) {
      this.snackbar.open('Debe llenar todos los campos en la sección DATOS DE LA PERSONA NATURAL', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    if (!this.layoutRepresentanteLeg.validarRepresentante()) {
      this.snackbar.open('Debe llenar todos los campos en la sección REPRESENTANTE LEGAL', 'Cerrar', {
        duration: 7000,
      })
      return;
    }
    
    functionsAlert.questionSiNo('¿Seguro que desea guardar solicitud preliminar?').then((result) => {
      if (result.isConfirmed) {
        let formValues = {
          persona: {
            ... this.layoutDatos.getFormValues(),
            tipoPersona: {
              codigo: TipoPersonaEnum.PJ_EXTRANJERO
            }
          },
          representante: this.layoutRepresentanteLeg.getFormValues()
        }
        
        this.solicitudService.registrarBorradorPN(formValues).subscribe(obj => {
          functionsAlert.success('Datos Guardados').then((result) => {
            this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_EDIT, obj.solicitudUuid]);
          });
        });
      }
    });
  }

  cancelar() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

}