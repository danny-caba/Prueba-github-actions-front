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
import { ListadoEnum, TipoDocumentoEnum, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';

@Component({
  selector: 'vex-solicitud-pn-form',
  templateUrl: './solicitud-pn-form.component.html',
  styleUrls: ['./solicitud-pn-form.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudPnFormComponent extends BaseComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  subscriptionUsuario: Subscription = new Subscription();

  @ViewChild('layoutDatosPersNat', { static: true }) layoutDatosPersNat: LayoutDatosPersNatComponent;

  constructor(
    private router: Router,
    private pidoService: PidoService,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private snackbar: MatSnackBar,
    private parametriaService: ParametriaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptionUsuario = this.usuario$.subscribe(usu => {
      if (usu) {
        this.layoutDatosPersNat.validarSNE(usu);
        this.layoutDatosPersNat.formGroup.controls['codigoRuc'].setValue(usu.codigoRuc);
        this.layoutDatosPersNat.validarDocumentoSesion(usu.tipoDocumento, usu.codigoRuc);
        this.validarDocumento(usu);
      }
    })
  }

  validarDocumento(usu: AuthUser){
    if(usu.tipoDocumento?.codigo == TipoDocumentoEnum.RUC && usu?.codigoRuc?.startsWith("10")){
      let tipoDni;
      this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.TIPO_DOCUMENTO]).subscribe(listRes => {
        listRes[0]?.forEach(item => {
          if(item.codigo == TipoDocumentoEnum.DNI){
            tipoDni = item;
          }
        });
      })
      let dni = usu.codigoRuc.substring(2,10)
      this.layoutDatosPersNat.formGroup.controls['tipoDocumento'].disable({ emitEvent: false })
      this.layoutDatosPersNat.formGroup.controls['numeroDocumento'].disable({ emitEvent: false })
      this.layoutDatosPersNat.formGroup.controls['tipoDocumento'].setValue(tipoDni);
      this.layoutDatosPersNat.formGroup.controls['numeroDocumento'].setValue(dni);
      this.layoutDatosPersNat.validarDocumento({codigo: TipoDocumentoEnum.DNI}, dni);
      this.layoutDatosPersNat.setDocumentoNoEditable();
    }

    if(usu.tipoDocumento?.codigo == TipoDocumentoEnum.CARNET_EXTRA){
      let tipoCarnetExtranjeria;
      this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.TIPO_DOCUMENTO]).subscribe(listRes => {
        listRes[0]?.forEach(item => {
          if(item.codigo == TipoDocumentoEnum.CARNET_EXTRA){
            tipoCarnetExtranjeria = item;
          }
        });
      })
      this.layoutDatosPersNat.formGroup.controls['tipoDocumento'].setValue(tipoCarnetExtranjeria);
    }
  }

  ngOnDestroy(): void {
    this.subscriptionUsuario.unsubscribe();
  }

  borrador() {
    if (!this.layoutDatosPersNat.validarDatosPN()) {
      this.snackbar.open('Debe llenar todos los campos en la sección DATOS DE LA PERSONA NATURAL', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    if (!this.layoutDatosPersNat.validarFlagValidacion()) {
      this.snackbar.open('Debe validar el correo electrónico', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    functionsAlert.questionSiNo('¿Seguro que desea guardar solicitud preliminar?').then((result) => {
      if (result.isConfirmed) {
        let formValues = {
          persona: {
            ... this.layoutDatosPersNat.getFormValues(),
            tipoPersona: {
              codigo: TipoPersonaEnum.PN_PERS_PROPUESTO
            }
          },
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
