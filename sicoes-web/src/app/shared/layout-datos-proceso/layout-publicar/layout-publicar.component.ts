import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ProcesoAddService } from 'src/app/pages/proceso-intranet/proceso-add.service';
import { CmpAprobadorComponent } from '../../cmp-aprobador/cmp-aprobador.component';
import { LayoutService } from 'src/@vex/services/layout.service';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoService } from 'src/app/service/proceso.service';
import { Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { BaseComponent } from '../../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
@Component({
  selector: 'vex-layout-publicar',
  templateUrl: './layout-publicar.component.html',
  styleUrls: ['./layout-publicar.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutPublicarComponent extends BaseComponent implements OnInit, OnDestroy {
  
  @ViewChild('cmpAprobador', { static: false }) cmpAprobador: CmpAprobadorComponent;

  suscriptionProceso: Subscription;
  PROCESO: Partial<Proceso>;

  isDesktop$ = this.layoutService.isDesktop$;
  constructor(
    private procesoService: ProcesoService,
    private procesoAddService: ProcesoAddService,
    private cd: ChangeDetectorRef,
    private layoutService: LayoutService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
  }

  ngOnDestroy() {
    this.suscriptionProceso.unsubscribe();
  }

  private suscribirSolicitud(){
    this.suscriptionProceso = this.procesoService.suscribeSolicitud().subscribe(sol => {
      this.PROCESO = sol;
    });
  }

  openDrawer() {
    this.procesoAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }
  
  cancelar(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }
  
  publicar(){
    let formValues:any = {};
    formValues.procesoUuid = this.PROCESO.procesoUuid;
    functionsAlertMod2.preguntarSiNoIcono('¿Está seguro que deseas publicar el proceso?').then((result)=>{
      if(result.isConfirmed){
        this.procesoService.publicarProceso(formValues).subscribe(obj => {
          functionsAlertMod2.successButtonDistinto("Se ha registrado correctamente tu registro de proceso interno", 'Ir a bandeja de solicitud').then((result) => {
            this.cancelar();
          });
        });
      }
    })
  }
}
