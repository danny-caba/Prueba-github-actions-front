import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { EstadoPropuestaEnum, ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { ProcesoService } from 'src/app/service/proceso.service';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { functions } from 'src/helpers/functions';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { functionsAlert } from 'src/helpers/functionsAlert';
@Component({
  selector: 'vex-proceso-list',
  templateUrl: './proceso-list.component.html',
  styleUrls: ['./proceso-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ProcesoListComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_PRESENTAR_PROPUESTA = 'ACC_PRESENTAR_PROPUESTA';
  ACC_EDITAR_PROPUESTA = 'ACC_EDITAR_PROPUESTA';
  ACC_VER_PROPUESTA = 'ACC_VER_PROPUESTA';
  ACC_VER_POSTULANTE = 'ACC_VER_POSTULANTE';
  ACC_RESUMEN_PROPUESTA = 'ACC_RESUMEN_PROPUESTA';

  //FIXME
  formGroup = this.fb.group({
    fechaDesde: [''],
    fechaHasta: [''],
    nroExpediente: [''],
    nroProceso: [''],
    nombreProceso: [''],
    descripcionItem: [''],
    estado: [null],
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
    'sectorNombre',
    'subsectorNombre',
    'numeroExpediente',
    'nombreProceso',
    'estadoProceso',
    'item',
    'estadoItem',
    'fechaPresentacion',
    'presentacion',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private procesoService: ProcesoService,
    private procesoItemsService: ProcesoItemsService,
    private datePipe: DatePipe,
    private adjuntoService:AdjuntosService,
    private propuestaService: PropuestaService
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
      ListadoEnum.SECTOR,
      ListadoEnum.ESTADO_ITEM
    ]).subscribe(listRes => {
      this.listEstado = listRes[0]
      this.listSector = listRes[1];
      this.listEstadoItem = listRes[2];
    })
  }

  serviceTable(filtro) {
    return this.procesoItemsService.buscarListProcesoItems(filtro);
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
      idEstadoProceso: this.formGroup.controls.estado.value?.idListadoDetalle,
      idEstadoItem: this.formGroup.controls.estadoItem.value?.idListadoDetalle,
      nroProceso: this.formGroup.controls.nroProceso.value,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
      nombreProceso: this.formGroup.controls.nombreProceso.value,
      descripcionItem: this.formGroup.controls.descripcionItem.value,
      idSubSector: this.formGroup.controls.subsector.value?.idListadoDetalle,
      fechaDesde: this.datePipe.transform(this.formGroup.controls.fechaDesde.value, 'dd/MM/yyyy'),
      fechaHasta: this.datePipe.transform(this.formGroup.controls.fechaHasta.value, 'dd/MM/yyyy')
    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, sol.procesoUuid]);
  }

  mostrarOpcion(opt, objSol) {
    if(opt == this.ACC_PRESENTAR_PROPUESTA && functions.esVacio(objSol.propuesta)) return true;
    if(opt == this.ACC_EDITAR_PROPUESTA && functions.noEsVacio(objSol.propuesta) && objSol.propuesta?.estado?.codigo == EstadoPropuestaEnum.NO_PRESENTADO) return true;
    if(opt == this.ACC_RESUMEN_PROPUESTA && objSol.propuesta?.estado?.codigo == EstadoPropuestaEnum.PRESENTADO) return true;
    return false;
  }

  onChangeSector(obj) {
    if (!obj) return;
    this.formGroup.controls.subsector.setValue('');
    this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, obj.idListadoDetalle).subscribe(res => {
      this.listSubSector = res
    });
  }

  presentarPropuesta(sol) {
  
    this.procesoService.validarSancionVigente(sol).subscribe(res =>{
      if(!res){
        functionsAlert.vigente('No es posible realizar su registro.', 'Mantiene una sancion por parte del OSCE.').then((result) => {
        });
      }else{
    this.procesoService.validaPrePresentacionPropuesta(sol?.proceso?.procesoUuid, sol?.procesoItemUuid).subscribe(res =>{
      if(res?.length){
        functionsAlertMod2.preguntarSiNoIconoWarning(res.join('\n'));
      }else{
        this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_ITEM_PRESENTAR, sol.procesoItemUuid, 'datos']);
      }
    }); 
  }
    }); 
  }

  editarPropuesta(sol) {
    this.procesoService.validaPrePresentacionPropuesta(sol?.proceso?.procesoUuid, sol?.procesoItemUuid).subscribe(res =>{
      if(res?.length){
        functionsAlertMod2.preguntarSiNoIconoWarning(res.join('\n'));
      }else{
        this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, sol.propuesta.propuestaUuid, 'datos']);
      }
    }); 
  }

  verProfesionales(sol) {
    console.info(sol)
    this.procesoService.validaProfesionalPropuesta(sol.proceso.procesoUuid).subscribe({
      next: (resp) => {
        this.adjuntoService.reporteVerProfesionales(sol.procesoItemUuid,"ReporteProfesionales.xlsx");
      },
      error: (e) => {
        
      }
    });
  }
  
  verResumenPropuesta(sol){
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA_RESUMEN, sol.propuesta?.propuestaUuid]);
  }

}
