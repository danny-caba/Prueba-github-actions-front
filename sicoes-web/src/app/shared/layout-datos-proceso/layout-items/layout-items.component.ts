import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ProcesoAddService } from 'src/app/pages/proceso-intranet/proceso-add.service';
import { BasePageComponent } from '../../components/base-page.component';
import { LayoutService } from 'src/@vex/services/layout.service';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoService } from 'src/app/service/proceso.service';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { ModalProcesoItemsComponent } from '../../modal-proceso-items/modal-proceso-items.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { EstadoProcesoEnum } from 'src/helpers/constantes.components';


@Component({
  selector: 'vex-layout-items',
  templateUrl: './layout-items.component.html',
  styleUrls: ['./layout-items.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutItemsComponent extends BasePageComponent<any> implements OnInit, OnDestroy {
  EstadoProcesoEnum = EstadoProcesoEnum;
  suscriptionProceso: Subscription;
  PROCESO: Partial<Proceso>

  bAdd = false;
  bEdit = false;
  bView = false;
  datosGenerales:boolean;

  displayedColumns: string[] = [
    'numeroItem',
    'descripcion',
    'tipoMoneda',
    'montoReferencialSoles',
    'facturacionMinima',
    'estado',
    'acciones'
  ];
  serviceTable(filtro: any) {
    return this.procesoItemsService.buscarProcesosItems(filtro);
  }

  obtenerFiltro() {
    return {
      procesoUuid: this.PROCESO?.procesoUuid
    };
  }
  isDesktop$ = this.layoutService.isDesktop$;
  constructor(
    private procesoService: ProcesoService,
    private procesoItemsService: ProcesoItemsService,
    private procesoAddService: ProcesoAddService,
    private cd: ChangeDetectorRef,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe(data => {
      this.bAdd = data.bAdd;
      this.bEdit = data.bEdit;
      this.bView = data.bView;
    });
    this.suscribirSolicitud();
  }

  ngOnDestroy() {
    this.suscriptionProceso.unsubscribe();
  }

  private suscribirSolicitud(){
    this.suscriptionProceso = this.procesoService.suscribeSolicitud().subscribe(sol => {
      this.PROCESO = sol;
      if(this.PROCESO?.procesoUuid){
        this.paginator.pageIndex = 0;
        this.cargarTabla();
      }
      //if(this.bEdit == true && this.PROCESO?.estado?.codigo != EstadoProcesoEnum.EN_ELABORACION){
        //this.bEdit = false;
      //}
    });
  }

  eliminarItems(obj){
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar item?').then((result) => {
      if (result.isConfirmed) {
        this.procesoItemsService.eliminarProcesoItems(obj.procesoItemUuid).subscribe(obj => {
          functionsAlertMod2.success('Ítem elimnado correctamente');
          this.actualizarProceso();
        });
      }
    });
  }

  verItems(obj){
    this.dialog.open(ModalProcesoItemsComponent, {
      width: '1000px',
      maxHeight: '100%',
      panelClass: 'sin-padding',
      data: {
        proceso: this.PROCESO,
        accion: 'view',
        item: obj
      },
    }).afterClosed().subscribe(() => {
      this.actualizarProceso();
    });
  }

  actualizarItems(obj){
    this.dialog.open(ModalProcesoItemsComponent, {
      width: '1000px',
      maxHeight: '100%',
      panelClass: 'sin-padding',
      data: {
        proceso: this.PROCESO,
        accion: 'edit',
        item: obj
      },
    }).afterClosed().subscribe(() => {
      this.actualizarProceso();
    });
  }

  agregarItems() {
    this.dialog.open(ModalProcesoItemsComponent, {
      width: '1000px',
      maxHeight: '100%',
      panelClass: 'sin-padding',
      data: {
        proceso: this.PROCESO,
        accion: 'add'
      },
    }).afterClosed().subscribe(() => {
      this.actualizarProceso();
    });
  }

  openDrawer() {
    this.procesoAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }

  /*siguiente(){
    functionsAlertMod2.preguntarSiNo('¿Estás seguro de guardar y continuar con el registro?', 'Sí, guardar y continuar').then((result) =>{
      if (result.isConfirmed) {
        this.procesoService.obtenerProceso(this.PROCESO.procesoUuid).subscribe( resp => {
          this.PROCESO = resp;
          this.suscriptionProceso.unsubscribe();
          this.procesoService.setSolicitud(resp);
          functionsAlertMod2.successButtonDistinto('Tu información se ha guardado correctamente', 'Continuar');
          this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, this.PROCESO.procesoUuid, 'publicar']);
        })
      }
    });
  }*/

  actualizarProceso(){
    this.procesoService.obtenerProceso(this.PROCESO.procesoUuid).subscribe( resp => {
      this.PROCESO = resp;
      this.procesoService.setSolicitud(resp);
    })
  }

  verBtnAgregarItem(){
    if(this.PROCESO?.estado?.codigo == EstadoProcesoEnum.EN_ELABORACION && this.bEdit == true){
      return true;
    }
    return false;
  }

  siguiente(){

    if(this.bView){
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, this.PROCESO.procesoUuid, 'informacion']);
    }else{
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, this.PROCESO.procesoUuid, 'informacion']);
    }
  }
}
