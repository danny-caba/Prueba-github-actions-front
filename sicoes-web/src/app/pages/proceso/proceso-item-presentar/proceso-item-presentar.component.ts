import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map } from 'rxjs';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ConfigService } from 'src/@vex/config/config.service';
import { LayoutService } from 'src/@vex/services/layout.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ProcesoService } from 'src/app/service/proceso.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { LayoutDatosGeneralComponent } from 'src/app/shared/layout-datos-proceso/layout-datos-general/layout-datos-general.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';
import { ProcesoItemAddService } from '../proceso-item-add.service';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';

@UntilDestroy()
@Component({
  selector: 'vex-proceso-item-presentar',
  templateUrl: './proceso-item-presentar.component.html',
  styleUrls: ['./proceso-item-presentar.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProcesoItemPresentarComponent extends BaseComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  PROCESO_ITEM

  @ViewChild(MatDrawer, { static: true }) private drawer: MatDrawer;
  isVerticalLayout$: Observable<boolean> = this.configService.select(config => config.layout === 'vertical');

  mobileQuery = this.mediaMatcher.matchMedia('(max-width: 959px)');
  isDesktop$ = this.layoutService.isDesktop$;
  ltLg$ = this.layoutService.ltLg$;
  drawerOpen$ = this.procesoAddService.drawerOpen$;
  drawerMode$: Observable<MatDrawerMode> = this.isDesktop$.pipe(
    map(isDesktop => isDesktop ? 'side' : 'over')
  );
  drawerOpen = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private procesoService: ProcesoService,
    private readonly configService: ConfigService,
    private mediaMatcher: MediaMatcher,
    private layoutService: LayoutService,
    private procesoAddService: ProcesoItemAddService,
    private procesoItemsService: ProcesoItemsService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.navegacion();
    let procesoItemUuid = this.activatedRoute.snapshot.paramMap.get('procesoItemUuid');
    if(procesoItemUuid){
      this.procesoItemsService.obtenerProcesoItems(procesoItemUuid).subscribe( resp => {
        this.PROCESO_ITEM = resp;
        this.procesoItemsService.setProcesoItem(this.PROCESO_ITEM);
      })
    }

  }

  navegacion(){
    this.isDesktop$.pipe(
      untilDestroyed(this)
    ).subscribe(isDesktop => {
      if (isDesktop) {
        this.drawer?.open();
        this.procesoAddService.drawerOpen.next(true);
        this.cd.markForCheck();
      } else {
        this.drawer?.close();
        this.procesoAddService.drawerOpen.next(false);
        this.cd.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    console.info("ondestroy")
    this.procesoService.clearSolicitud();
  }

  cancelar() {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }

  drawerChange(drawerOpen: boolean) {
    this.procesoAddService.drawerOpen.next(drawerOpen);
    this.cd.markForCheck();
  }

  openDrawer() {
    this.procesoAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  closeDrawer() {
    this.procesoAddService.drawerOpen.next(false);
    this.cd.markForCheck();
  }
}