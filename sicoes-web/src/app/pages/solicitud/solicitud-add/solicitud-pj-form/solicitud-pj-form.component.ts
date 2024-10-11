import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { LayoutDatosPersJurComponent } from 'src/app/shared/layout-datos/layout-datos-pers-jur/layout-datos-pers-jur.component';
import { LayoutDatosRepresentanteLegalComponent } from 'src/app/shared/layout-datos/layout-datos-representante-legal/layout-datos-representante-legal.component';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-solicitud-pj-form',
  templateUrl: './solicitud-pj-form.component.html',
  styleUrls: ['./solicitud-pj-form.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudPjFormComponent extends BaseComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  subscriptionUsuario: Subscription = new Subscription();

  @ViewChild('layoutDatosPersJur', { static: true }) layoutDatosPersJur: LayoutDatosPersJurComponent;
  @ViewChild('layoutRepresentanteLeg', { static: true }) layoutRepresentanteLeg: LayoutDatosRepresentanteLegalComponent;

  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private solicitudService: SolicitudService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptionUsuario = this.usuario$.subscribe(usu => {
      if (usu) {
        this.layoutDatosPersJur.validarSNE(usu);
        this.layoutDatosPersJur.validarDocumento(usu.tipoDocumento, usu.codigoRuc);
        this.layoutDatosPersJur.formGroup.controls['tipoDocumento'].setValue(usu.tipoDocumento);
        this.layoutDatosPersJur.formGroup.controls['numeroDocumento'].setValue(usu.codigoRuc);
        this.layoutDatosPersJur.formGroup.controls['codigoRuc'].setValue(usu.codigoRuc);

        if (usu.tipoDocumento?.codigo == "RUC") {
          this.layoutDatosPersJur.cargarCombo()
          this.layoutDatosPersJur.formGroup.controls['pais'].setValue(this.layoutDatosPersJur.listPais[0])
        }

      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptionUsuario.unsubscribe();
  }

  borrador() {
    if (!this.layoutDatosPersJur.validarDatosPJ()) {
      this.snackbar.open('Debe llenar todos los campos en la sección DATOS DE LA EMPRESA', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    if (!this.layoutDatosPersJur.validarFlagValidacion()) {
      this.snackbar.open('Debe validar el correo electrónico', 'Cerrar', {
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
            ... this.layoutDatosPersJur.getFormValues(),
            tipoPersona: {
              codigo: TipoPersonaEnum.JURIDICO
            }
          },
          representante: this.layoutRepresentanteLeg.getFormValues()
        }

        this.solicitudService.registrarBorradorPJ(formValues).subscribe(obj => {
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