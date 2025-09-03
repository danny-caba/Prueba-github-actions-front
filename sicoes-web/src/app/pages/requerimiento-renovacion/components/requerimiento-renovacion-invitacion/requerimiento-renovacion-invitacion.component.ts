import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Link } from 'src/helpers/internal-urls.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { EstadoEvaluacionAdministrativa, EstadoEvaluacionTecnica, EvaluadorRol, ListadoEnum, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { FormBuilder } from '@angular/forms';
import { InformeRenovacionService } from 'src/app/service/informe-renovacion.service';
import { RequerimientoRenovacionService } from 'src/app/service/requerimiento-renovacion.service';
import { RequerimientoRenovacion } from 'src/app/interface/requerimiento-renovacion.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { InvitacionRenovacionService } from 'src/app/service/invitacion-renovacion.service';
import { InvitacionRenovacion } from 'src/app/interface/invitacion-renovacion.model';

@Component({
  selector: 'vex-requerimiento-renovacion-invitacion',
  templateUrl: './requerimiento-renovacion-invitacion.component.html',
  styleUrls: ['./requerimiento-renovacion-invitacion.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RequerimientoRenovacionInvitacionComponent extends BasePageComponent<InvitacionRenovacion> implements OnInit, OnDestroy {

  displayedColumns: string[] = ['feInvitacion', 'fePlazoConfirmacion', 'feAceptacionInvitacion', 'tiSector', 
    'tiSubSector', 'noItem','estadoInvitacion', 'actions'];

  formGroup = this.fb.group({
    sector: [null],
    subsector: [null],
    noItem: [null],
  });

  listInvitacion: InvitacionRenovacion[]
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  idSolicitud: string
  tipoPersonaEnum = TipoPersonaEnum
  EstadoEvaluacionAdministrativa = EstadoEvaluacionAdministrativa
  EstadoEvaluacionTecnica = EstadoEvaluacionTecnica
  nuExpediente: string
  requerimiento: RequerimientoRenovacion;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService,
    private informeRenovacionService: InformeRenovacionService,
    private requerimientoRenovacionService: RequerimientoRenovacionService,
    private invitacionRenovacionService: InvitacionRenovacionService,
    private authFacade: AuthFacade,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.listar();
    this.formGroup.get('sector').valueChanges.subscribe(value => {
      this.onChangeSector(value)
    })
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.SECTOR,
    ]).subscribe(listRes => {
      this.listSector = listRes[0];
    })
  }

  listar() {
    //TODO: cargar invitaciones por requerimiento renovacion
    this.cargarTabla();
  }

  registrar() {
  //TODO: registrar invitacion      
  }  

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST]);
  }

  ngOnDestroy(): void {
    this.solicitudService.clearSolicitud();
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }  

  onChangeSector(obj) {
    if (!obj) return;
    this.formGroup.controls.subsector.setValue('');
    this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, obj.idListadoDetalle).subscribe(res => {
      this.listSubSector = res;
      
    });
  }

  obtenerFiltro() {
    let filtro: any = {
      sector: this.formGroup.controls.sector.value?.codigo,
      subSector: this.formGroup.controls.subsector.value?.codigo,
    }
    return filtro;
  }

  serviceTable(filtro: any) {
    return this.invitacionRenovacionService.listar(filtro);
  }

  goToBandejaSolicitudes() {
    this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
  }

}
