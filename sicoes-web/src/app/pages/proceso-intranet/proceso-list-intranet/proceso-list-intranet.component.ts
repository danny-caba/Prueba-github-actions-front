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

@Component({
  selector: 'vex-proceso-list-intranet',
  templateUrl: './proceso-list-intranet.component.html',
  styleUrls: ['./proceso-list-intranet.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ProcesoIntranetListIntranetComponent extends BasePageComponent<Solicitud> implements OnInit {

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
    estado: [null],
    sector: [null],
    subsector: [null]
  });

  listEstado: any[]
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]

  displayedColumns: string[] = [
    'fechaRegistro',
    'sectorNombre',
    'subsectorNombre',
    'numeroExpediente',
    'numeroProceso',
    'nombreProceso',
    'estadoProceso',
    'verPostulante',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private procesoService: ProcesoService,
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
      ListadoEnum.SECTOR
    ]).subscribe(listRes => {
      this.listEstado = listRes[0]
      this.listSector = listRes[1];
    })
  }

  serviceTable(filtro) {
    return this.procesoService.buscarProcesos(filtro);
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
      idEstado: this.formGroup.controls.estado.value?.idListadoDetalle,
      nroProceso: this.formGroup.controls.nroProceso.value,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
      nombreProceso: this.formGroup.controls.nombreProceso.value,
      idSubsector: this.formGroup.controls.subsector.value?.idListadoDetalle,
      fechaDesde: this.datePipe.transform(this.formGroup.controls.fechaDesde.value, 'dd/MM/yyyy'),
      fechaHasta: this.datePipe.transform(this.formGroup.controls.fechaHasta.value, 'dd/MM/yyyy')
    }
    return filtro;
  }

  nuevaProceso() {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_ADD, 'datos']);
  }

  ver(sol) {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, sol.procesoUuid, 'datos']);
  }

  editar(sol) {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, sol.procesoUuid, 'datos']);
  }

  verProceso(sol) {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, sol.procesoUuid, 'datos']);
  }

  verBitacora(sol) {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESO_BITACORA, sol.procesoUuid]);
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

  verPostulante(sol, index){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESO_VIEW_POSTULANTE, sol.procesoUuid]);
  }

  validarBotonVer(obj){
    if(obj.codigo == 'EN_ELABORACION' || obj.codigo == 'PRESENTACION' || obj.codigo == 'CONVOCATORIA'){
      return false;
    }
    return true;
  }
  
}
