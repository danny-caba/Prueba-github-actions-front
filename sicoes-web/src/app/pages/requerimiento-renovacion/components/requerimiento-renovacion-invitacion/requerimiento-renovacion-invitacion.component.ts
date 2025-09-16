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
import { FormBuilder } from '@angular/forms';
import { InformeRenovacionService } from 'src/app/service/informe-renovacion.service';
import { RequerimientoRenovacionService } from 'src/app/service/requerimiento-renovacion.service';
import { RequerimientoRenovacion } from 'src/app/interface/requerimiento-renovacion.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { InvitacionRenovacionService } from 'src/app/service/invitacion-renovacion.service';
import { InvitacionRenovacion } from 'src/app/interface/invitacion-renovacion.model';
import { ModalAprobarRechazarInvitacionComponent } from 'src/app/shared/modal-aprobar-rechazar-invitacion/modal-aprobar-rechazar-invitacion.component';

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
  invitacion: any ={}

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService,
    private requerimientoRenovacionService: RequerimientoRenovacionService,
    private invitacionRenovacionService: InvitacionRenovacionService,
    private authFacade: AuthFacade,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.nuExpediente = this.activatedRoute.snapshot.paramMap.get('idRequerimiento');
    this.listar();
    this.formGroup.get('sector').valueChanges.subscribe(value => {
      this.onChangeSector(value)
    });
    this.requerimientoRenovacionService.obtenerPorNumeroExpediente(this.nuExpediente).subscribe(d=>{
      this.requerimiento = d;
    });
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.SECTOR,
    ]).subscribe(listRes => {
      this.listSector = listRes[0];
    })
  }

  listar() {
    this.cargarTabla();
  }

  enviarInvitacion() {
    functionsAlert.questionSiNoEval('¿Está seguro de que desea enviar la invitación?',"Invitación").then((result) => {
      if(result.isConfirmed){
        console.log('Requerimiento:', this.requerimiento)
        this.invitacion.idReqRenovacion = this.requerimiento?.idReqRenovacion;
        console.log('Payload a enviar:', this.invitacion)
        
        this.invitacionRenovacionService.enviar(this.invitacion).subscribe({
          next: (res) => {
            console.log('Respuesta del servidor:', res)
            functionsAlert.success('Se ha enviado la invitación con éxito a la empresa supervisora').then(() => {
              this.invitacion = res;
              // Recargar la tabla para mostrar la nueva invitación
              this.cargarTabla();
            });
          },
          error: (error) => {
            console.error('Error al enviar invitación:', error);
            functionsAlert.error('Error al enviar la invitación. Por favor, intente nuevamente.');
          }
        });
      }
    });
  }

  cancelar(){
    console.log('Navegando a requerimiento renovación, idSoliPerfCont:', this.requerimiento?.idSoliPerfCont);
    this.router.navigate([Link.INTRANET, Link.REQUERIMIENTO_RENOVACION_LIST, this.requerimiento?.idSoliPerfCont]);
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
      numeroExpediente:this.nuExpediente,
      sector: this.formGroup.controls.sector.value?.codigo,
      subSector: this.formGroup.controls.subsector.value?.codigo,
    }
    return filtro;
  }

  serviceTable(filtro: any) {
    return this.invitacionRenovacionService.listar(filtro);
  }

  evaluarInvitacion(invitacion: any) {
    const dialogRef = this.dialog.open(ModalAprobarRechazarInvitacionComponent, {
      width: '700px',
      disableClose: true,
      data: {
        invitacion: invitacion
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        // Recargar la tabla después de evaluar la invitación
        this.cargarTabla();
        functionsAlert.success('Invitación evaluada exitosamente');
      }
    });
  }

  puedeEvaluarInvitacion(invitacion: any): boolean {
    // Verificar si la invitación está en un estado que permite evaluación
    // Por ejemplo, estado "PENDIENTE" o similar
    return invitacion?.estadoInvitacion?.codigo === 'PENDIENTE' ||
           invitacion?.estadoInvitacion?.codigo === 'ENVIADA' ||
           !invitacion?.feAceptacion; // Si no tiene fecha de aceptación aún
  }

}
