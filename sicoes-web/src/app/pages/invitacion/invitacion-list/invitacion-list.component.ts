import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { ProcesoService } from 'src/app/service/proceso.service';
import { InvitacionService } from 'src/app/service/invitacion.service';

@Component({
  selector: 'vex-invitacion-list',
  templateUrl: './invitacion-list.component.html',
  styleUrls: ['./invitacion-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class InvitacionListComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_PROCESAR = 'ACC_PROCESAR';
  ACC_VER = 'ACC_VER';

  //FIXME
  formGroup = this.fb.group({
    fechaDesde: [''],
    fechaHasta: [''],
    nroExpediente: [''],
    nroProceso: [''],
    nombreProceso: [''],
    item: [''],
    empresa: [''],
    //estadoProceso: [null],
    estadoItem: [null],
    sector: [null],
    subsector: [null]
  });

  listEstado: any[]
  listEstadoItem: any[]
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]

  displayedColumns: string[] = [
    'fechaRegistro',
    'empresa',
    'subsectorNombre',
    'numeroExpediente',
    'nombreProceso',
    'numeroProceso',
    'estadoItem',
    'estadoInvitacion',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private procesoService: ProcesoService,
    private invitacionService: InvitacionService,
    private datePipe: DatePipe
  ) {
    super();
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.cargarTabla();
    this.formGroup.get('sector').valueChanges.subscribe(value => {
      this.onChangeSector(value)
    })
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ESTADO_PROCESO,
      ListadoEnum.ESTADO_ITEM,
      ListadoEnum.SECTOR
    ]).subscribe(listRes => {
      this.listEstado = listRes[0]
      this.listEstadoItem = listRes[1]
      this.listSector = listRes[2];
    })
  }

  serviceTable(filtro) {
    return this.invitacionService.buscarPropuestaProfesional(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  obtenerFiltro() {
    let filtro: any = {
      idSector: this.formGroup.controls.sector.value?.idListadoDetalle,
      //idEstado: this.formGroup.controls.estadoProceso.value?.idListadoDetalle,
      idEstadoItem: this.formGroup.controls.estadoItem.value?.idListadoDetalle,
      nroProceso: this.formGroup.controls.nroProceso.value,
      nombreProceso: this.formGroup.controls.nombreProceso.value,
      idSubsector: this.formGroup.controls.subsector.value?.idListadoDetalle,
      fechaDesde: this.datePipe.transform(this.formGroup.controls.fechaDesde.value, 'dd/MM/yyyy'),
      fechaHasta: this.datePipe.transform(this.formGroup.controls.fechaHasta.value, 'dd/MM/yyyy'),
      item: this.formGroup.controls.item.value,
      empresa: this.formGroup.controls.empresa.value
    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST, sol.idPropuestaProfesional, sol.propuesta.propuestaUuid]);
  }

  mostrarOpcion(opt, objSol) {
    if(opt == this.ACC_PROCESAR && objSol.estado?.codigo == SolicitudEstadoEnum.EN_PROCESO) return true;
    return false;
  }

  onChangeSector(obj) {
    if (!obj) return;
    this.formGroup.controls.subsector.setValue('');
    this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, obj.idListadoDetalle).subscribe(res => {
      this.listSubSector = res
    });
  }
  
}
