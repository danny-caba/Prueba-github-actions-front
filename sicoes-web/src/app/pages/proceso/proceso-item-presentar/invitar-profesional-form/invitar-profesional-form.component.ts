import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { ProcesoItemsPerfilService } from 'src/app/service/proceso-items-perfil.service';
import { Supervisora } from 'src/app/interface/supervisora.model';
import { LayoutService } from 'src/@vex/services/layout.service';
import { ProcesoItemAddService } from '../../proceso-item-add.service';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { InvitacionService } from 'src/app/service/invitacion.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ProcesoService } from 'src/app/service/proceso.service';


@Component({
  selector: 'vex-invitar-profesional-form',
  templateUrl: './invitar-profesional-form.component.html',
  styleUrls: ['./invitar-profesional-form.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class InvitarProfesionalFormComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  suscriptionPropuesta: Subscription;

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  @Input() PROPUESTA: any;
  @Input() PROCESO_ITEM: any;

  formGroup = this.fb.group({
    sector: ['', Validators.required],
    subsector: ['', Validators.required],
    perfil: ['', Validators.required],
    estado: [null as ListadoDetalle, Validators.required],
    profesional: [null as Supervisora, Validators.required],
  });

  displayedColumns: string[] = [
    'fechaInvitacion',
    'perfil',
    'nombreProfesional',
    'estado',
    'acciones'
  ];
  suscriptionSolicitud: Subscription;
  listEstado: any[]
  listPerfiles: any[]
  listProfesionales: any[]
  invitacion: any
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  isDesktop$ = this.layoutService.isDesktop$;
  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private procesoItemsPerfilService: ProcesoItemsPerfilService,
    private propuestaService: PropuestaService,
    private invitacionService: InvitacionService,
    private supervisoraService: SupervisoraService,
    private layoutService: LayoutService,
    private procesoService: ProcesoService,
    private cd: ChangeDetectorRef,
    private procesoItemAddService: ProcesoItemAddService,
  ) {
    super();

    this.formGroup.get('sector').disable();
    this.formGroup.get('subsector').disable();
    this.formGroup.get('profesional');
    this.formGroup.get('estado').disable();
  }

  ngOnInit(): void {
    this.formGroup.get('perfil').valueChanges.subscribe(value => {
      if (value) {
        this.listarProfesionales(value)
      } else {
        this.formGroup.controls.profesional.setValue(null);
      }
    })
    this.suscribirPropuestaService();
  }

  private suscribirPropuestaService() {
    this.suscriptionPropuesta = this.propuestaService.suscribePropuesta().subscribe(pro => {
      if (pro) {
        this.PROPUESTA = pro;
        this.PROCESO_ITEM = pro.procesoItem;
        this.paginator.pageIndex = 0;
        this.cargarTabla();
        if (this.PROCESO_ITEM) {
          this.listarPerfiles();
          this.formGroup.controls.sector.setValue(this.PROCESO_ITEM.proceso?.sector.nombre)
          this.formGroup.controls.subsector.setValue(this.PROCESO_ITEM.proceso?.subsector.nombre)
        }
      }
    });
  }

  listarProfesionales(value) {
    if (this.formGroup.controls.profesional.value != null) {
      this.formGroup.controls.profesional.setValue(null);
    }
    this.supervisoraService.listarSupervisorasPerfil(value.perfil?.idListadoDetalle).subscribe(listRes => {
      this.listProfesionales = listRes;
    })
  }

  listarPerfiles() {
    this.procesoItemsPerfilService.buscarItemsPerfiles({}, this.PROCESO_ITEM?.procesoItemUuid).subscribe(listRes => {
      this.listPerfiles = listRes.content;
    })
  }

  serviceTable(filtro: any) {
    return this.propuestaService.buscarInvitacionesProfesionales(filtro, this.PROPUESTA?.propuestaUuid);
  }

  obtenerFiltro() {
    return {
    };
  }

  cancelarInvitacion(obj) {
    functionsAlertMod2.preguntarSiNoIcono('¿Esta seguro que desea cancelar esta invitacion?').then((result) => {
      if (result.isConfirmed) {
        this.invitacionService.cancelarInvitacion(obj.idPropuestaProfesional, this.PROPUESTA.propuestaUuid, obj).subscribe(listRes => {
          this.paginator.pageIndex = 0;
          this.cargarTabla();
        });
      }
    });
  }

  enviarInvitacion() {
    if (this.formGroup.controls.profesional.value == null) {
      this.formGroup.controls.profesional.setErrors({ ProfesionaNoVacio: true });
      return;
    }
    let formValues = {
      perfil: this.formGroup.get('perfil').getRawValue().perfil,
      sector: this.formGroup.get('perfil').getRawValue().sector,
      subsector: this.formGroup.get('perfil').getRawValue().subsector,
      supervisora: this.formGroup.get('profesional').getRawValue(),
      propuesta: {
        propuestaUuid: this.PROPUESTA.propuestaUuid
      }
    }

    functionsAlertMod2.preguntarSiNoIcono('¿Esta seguro que desean enviar una invitación al profesional seleccionado para que sea parte de su equipo de trabajo?').then((result) => {
      // this.procesoService.validarSancionVigentePN(formValues).subscribe(res =>{
      //   if(!res){
      //     functionsAlert.vigente('No es posible registrar la Solicitud.', 'Usted no ha superado 1 año de haber terminado su vinculo con OSINERGMIN.').then((result) => {
      //     });
      //   }});
      if (result.isConfirmed) {
        this.invitacionService.enviarInvitacion2(formValues).subscribe(listRes => {
          if (listRes.idPropuestaProfesional == 2) {
            functionsAlert.vigente('No es posible registrar la Solicitud.', 'Usted cuenta con vinculo laboral en OSINERGMIN.').then((result) => {
            });
          } else if (listRes.idPropuestaProfesional == 1) {
            functionsAlert.vigente('No es posible registrar la Solicitud.', 'El profesional precalificado electo por usted se encontraría IMPEDIDO de contratar, debido a la causal señalada en el literal b) del numeral 11.1 del artículo 11 de la Directiva, en concordancia con el literal f) del numeral 11.1 del Texto Único Ordenado de la Ley del Contrataciones del Estado, al no haber transcurrido 12 meses desde que cesó su vínculo laboral con Osinergmin.').then((result) => {
              this.invitacionService.enviarInvitacion(formValues).subscribe(listRes => {
                this.formGroup.reset();
                this.actualizarPropuesta();
              });
            });
          } else {
            this.formGroup.reset();
            this.actualizarPropuesta();
          }

        });
      }
    });
  }

  cancelar() {
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
  }


  guardar(continuar: boolean) {
    if (continuar) {
      this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid, 'propuesta-economica']);
    } else {
      this.cancelar()
    }
  }

  ngOnDestroy() {
    this.suscriptionPropuesta.unsubscribe();
  }

  openDrawer() {
    this.procesoItemAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  valirdarBtn(row) {
    if (row?.estado.codigo == 'CANCELADO' || row?.estado.codigo == 'RECHAZADO') return false;
    return true;
  }

  actualizarPropuesta() {
    this.propuestaService.obtenerPropuesta(this.PROPUESTA.propuestaUuid).subscribe(resp => {
      this.PROPUESTA = resp;
      this.propuestaService.setPropuesta(resp);
    })
  }

}
