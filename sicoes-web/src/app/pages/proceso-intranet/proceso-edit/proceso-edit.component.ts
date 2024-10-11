import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy, Input, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/@vex/config/config.service';
import { LayoutService } from 'src/@vex/services/layout.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ProcesoService } from 'src/app/service/proceso.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';
import { Link } from 'src/helpers/internal-urls.components';
import { ProcesoAddService } from '../proceso-add.service';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { Observable, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';

@UntilDestroy()
@Component({
  selector: 'vex-proceso-edit',
  templateUrl: './proceso-edit.component.html',
  styleUrls: ['./proceso-edit.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProcesoEditComponent extends BaseComponent implements OnInit, OnDestroy {

  tipoPersonaEnum = TipoPersonaEnum;

  usuario$ = this.authFacade.user$;
  PROCESO: any;
  editable: boolean = false;
  isSubsanar: boolean = false;
  @Input() viewEvaluacion: boolean;

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
    private activeRoute: ActivatedRoute,
    private procesoService: ProcesoService,
    private authFacade: AuthFacade,
    private readonly configService: ConfigService,
    private mediaMatcher: MediaMatcher,
    private layoutService: LayoutService,
    private procesoAddService: ProcesoAddService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {

    this.activeRoute.data.subscribe(data => {
      if(data.editable){
        this.editable = data.editable;
      }
    })

    let procesoUuid = this.activeRoute.snapshot.paramMap.get('procesoUuid');
    if(procesoUuid){
      this.procesoService.obtenerProceso(procesoUuid).subscribe( resp => {
        this.PROCESO = resp;
        this.procesoService.setSolicitud(resp);
      })
    }

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
    this.procesoService.clearSolicitud();
  }

  cancelar(){
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