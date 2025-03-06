import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { BasePageComponent } from "../../components/base-page.component";
import { ProcesoService } from "src/app/service/proceso.service";
import { ProcesoItemsService } from "src/app/service/proceso-items.service";
import { ProcesoAddService } from "src/app/pages/proceso-intranet/proceso-add.service";
import { LayoutService } from "src/@vex/services/layout.service";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Proceso } from "src/app/interface/proceso.model";
import { Link } from "src/helpers/internal-urls.components";
import { InformacionProcesoService } from "src/app/service/informacion-proceso.service";
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { functionsAlertMod2 } from "src/helpers/funtionsAlertMod2";
import { EstadoProcesoEnum } from 'src/helpers/constantes.components';
@Component({
  selector: "app-layout-info-proceso",
  templateUrl: "./layout-info-proceso.component.html",
  styleUrls: ["./layout-info-proceso.component.scss"],
  animations: [stagger80ms],
})
export class LayoutInfoProcesoComponent
  extends BasePageComponent<any>
  implements OnInit, OnDestroy
{
  constructor(
    private procesoService: ProcesoService,
    private procesoItemsService: ProcesoItemsService,
    private procesoAddService: ProcesoAddService,
    private cd: ChangeDetectorRef,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private infoProcesoServices: InformacionProcesoService,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }
  PROCESO: Partial<Proceso>;
  displayedColumns: string[] = [
    "numeroItem",
    "etapa",
    "documento",
    "fecHraPubli",
    "acciones",
  ];
  bAdd = false;
  bEdit = false;
  bView = false;

  ngOnDestroy() {
    this.suscriptionProceso.unsubscribe();
  }

  ngOnInit() {
    this.activeRoute.data.subscribe(data => {
      this.bAdd = data.bAdd;
      this.bEdit = data.bEdit;
      this.bView = data.bView;
    });
    this.suscribirSolicitud();
  }
  suscriptionProceso: Subscription;
  private suscribirSolicitud(){
    this.suscriptionProceso = this.procesoService.suscribeSolicitud().subscribe(sol => {
      this.PROCESO = sol;
      if(this.PROCESO?.idProceso){
        this.paginator.pageIndex = 0;
        this.cargarTabla();
      }
      //if(this.bEdit == true && this.PROCESO?.estado?.codigo != EstadoProcesoEnum.EN_ELABORACION){
        //this.bEdit = false;
      //}
    });
  }

  serviceTable(filtro: any) {
    return this.infoProcesoServices.listarInfoProceso(this.PROCESO?.idProceso);
  }

  obtenerFiltro() {
    return {
      procesoUuid: this.PROCESO?.procesoUuid,
    };
  }
  isDesktop$ = this.layoutService.isDesktop$;
  cancelar() {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }
  openDrawer() {
    this.procesoAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }
  verBtnAgregarItem(){
    if(this.PROCESO?.estado?.codigo == EstadoProcesoEnum.EN_ELABORACION && this.bEdit == true){
      return true;
    }
    return false;
  }
  siguiente(){
    if(this.bView){
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, this.PROCESO.procesoUuid, 'publicar']);
    }else{
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, this.PROCESO.procesoUuid, 'publicar']);
    }
  }
    actualizarProceso(){
    this.procesoService.obtenerProceso(this.PROCESO.procesoUuid).subscribe( resp => {
      this.PROCESO = resp;
      this.procesoService.setSolicitud(resp);
    })
  }
  descargar(adj) {
    let nombreAdjunto = adj.documentName != null ? adj.documentName : adj.nombreReal
    this.adjuntoService.descargarWindowsJWT(adj.codigo, nombreAdjunto);
  }
  eliminarItem(adjunto){
    functionsAlertMod2.preguntarSiNoIcono('¿Esta seguro que desea eliminar este documento?').then((result) => {
      if(result.isConfirmed){
        this.infoProcesoServices.eliminarInfoProceso(adjunto.idProcesoDocumento).subscribe(listRes => {
          this.paginator.pageIndex = 0;
          this.cargarTabla();
        });
      }
    });
  }
}
