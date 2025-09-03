import { Component, OnDestroy, ChangeDetectorRef, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ProcesoAddService } from 'src/app/pages/proceso-intranet/proceso-add.service';
import { LayoutService } from 'src/@vex/services/layout.service';
import { BasePageComponent } from '../../components/base-page.component';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoEtapaService } from 'src/app/service/proceso-etapa.service';
import { ProcesoService } from 'src/app/service/proceso.service';
import { ModalProcesoEtapaComponent } from '../../modal-proceso-etapa/modal-proceso-etapa.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { CmpFechaEtapaComponent } from '../../cmp-fecha-etapa/cmp-fecha-etapa.component';
import { MatTableDataSource } from '@angular/material/table';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { ArchivoService } from '../../../service/archivo.service';
import { EvaluatorService } from '../../service/evaluator.service';

@Component({
  selector: 'vex-layout-fecha-etapa',
  templateUrl: './layout-fecha-etapa.component.html',
  styleUrls: ['./layout-fecha-etapa.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutFechaEtapaComponent extends BasePageComponent<any> implements OnInit, OnDestroy {
  
  @ViewChild('cmpFechaEtapa', { static: false }) cmpFechaEtapa: CmpFechaEtapaComponent;

  suscriptionProceso: Subscription;
  PROCESO: Partial<Proceso>
  @Input() editable: boolean = false;
  archivoConsulta: any;
  
  bAdd = false;
  bEdit = false;
  bView = false;

  FORMULACION_CONSULTAS = 'Formulación de Consultas';

  displayedColumns: string[] = [
    'grupo',
    'fecha',
    'usuario',
    'estado'
  ];
  
  serviceTable(filtro: any) {
    return this.procesoEtapaService.buscarProcesosEtapa(filtro);
  }

  obtenerFiltro() {    
    return { 
      procesoUuid: this.PROCESO?.procesoUuid 
    };
  }

  constructor(
    private procesoService: ProcesoService,
    private activeRoute: ActivatedRoute,
    private procesoEtapaService: ProcesoEtapaService,
    private procesoAddService: ProcesoAddService,
    private adjuntoService: AdjuntosService,
    private archivoService: ArchivoService,
    private cd: ChangeDetectorRef,
    private layoutService: LayoutService,
    private evaluatorService: EvaluatorService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    super();
  }
  isDesktop$ = this.layoutService.isDesktop$;
  ngOnInit(): void {
    this.suscribirSolicitud();
    this.activeRoute.data.subscribe(data => {
      this.bAdd = data.bAdd;
      this.bEdit = data.bEdit;
      this.bView = data.bView;
    })
  }

  ngOnDestroy() {
    this.suscriptionProceso.unsubscribe();
  }

  cargarTabla() {
    const filtro = this.obtenerFiltro();

    // Obtenemos los datos del servicio
    this.serviceTable(filtro).subscribe(data => {
      const items = data.content; // Extraemos el array de datos (content)

      // Ordenamos los elementos por 'idListadoDetalle' de la propiedad 'etapa'
      const itemsWithProceso = items.map(item => ({
        ...item,
        proceso: this.PROCESO
      }));

      // Asignamos los elementos ordenados a 'MatTableDataSource'
      this.dataSource = new MatTableDataSource(itemsWithProceso);

      // Si usas paginación, asegúrate de asignarla
      this.dataSource.paginator = this.paginator;
      this.paginator.length = data.totalElements; // Total de elementos para la paginación
    });
  }

  private suscribirSolicitud(){
    this.suscriptionProceso = this.procesoService.suscribeSolicitud().subscribe(sol => {
      this.PROCESO = sol;
      if(this.PROCESO?.procesoUuid){
        this.cargarTabla();
        this.obtenerXlsArhivoConsultas();
      }
    });
  }

  eliminarEtapa(obj){
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar item?').then((result) => {
      if (result.isConfirmed) {
        this.procesoEtapaService.eliminarProcesoEtapa(obj.idProcesoEtapa,this.PROCESO?.procesoUuid).subscribe(obj => {
          functionsAlertMod2.success('Datos Guardados').then((result) => {
            this.cargarTabla();
          });
        });
      }
    });
  }

  actualizarEtapa(obj){
    this.dialog.open(ModalProcesoEtapaComponent, {
      width: '800px',
      maxHeight: '100%',
      panelClass: 'modal-editar-etapa',
      data: {
        proceso: this.PROCESO,
        accion: 'edit',
        etapa: obj
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  openDrawer() {
    this.procesoAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }
  cancelar(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }

  actualizarProceso(){
    this.procesoService.obtenerProceso(this.PROCESO.procesoUuid).subscribe( resp => {
      this.PROCESO = resp;
      this.procesoService.setSolicitud(resp);
    })
  }
  
  siguiente(){
    if(this.bView){
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, this.PROCESO.procesoUuid, 'miembros']);
    }else{
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, this.PROCESO.procesoUuid, 'miembros']);
    }
  }

  descargarXlsConsultas() {
    this.adjuntoService.descargarWindowsJWT(this.archivoConsulta.codigo, this.archivoConsulta.nombreReal);
  }

  evaluarFechaPorEtapa(fechaInicio: string, fechaFin: string): string {
    return this.evaluatorService.evaluarFechaPorEtapa(fechaInicio, fechaFin);
  }

  obtenerXlsArhivoConsultas() {
    this.archivoService.obtenerArchivoPorProceso(this.PROCESO?.idProceso).subscribe((resp) => {
      this.archivoConsulta = resp;
    });
  }

}
