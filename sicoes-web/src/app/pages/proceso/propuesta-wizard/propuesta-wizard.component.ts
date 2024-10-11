import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Observable, map } from 'rxjs';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { ConfigService } from 'src/@vex/config/config.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { LayoutService } from 'src/@vex/services/layout.service';
import { PropuestaWizardService } from '../propuesta-wizard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'vex-propuesta-wizard',
  templateUrl: './propuesta-wizard.component.html',
  styleUrls: ['./propuesta-wizard.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class PropuestaWizardComponent extends BaseComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  PROCESO_ITEM
  PROPUESTA

  @ViewChild(MatDrawer, { static: true }) private drawer: MatDrawer;
  isVerticalLayout$: Observable<boolean> = this.configService.select(config => config.layout === 'vertical');

  mobileQuery = this.mediaMatcher.matchMedia('(max-width: 959px)');
  isDesktop$ = this.layoutService.isDesktop$;
  ltLg$ = this.layoutService.ltLg$;
  drawerOpen$ = this.propuestaWizardService.drawerOpen$;
  drawerMode$: Observable<MatDrawerMode> = this.isDesktop$.pipe(
    map(isDesktop => isDesktop ? 'side' : 'over')
  );
  drawerOpen = true;

  constructor(
    private activeRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private propuestaService: PropuestaService,
    private readonly configService: ConfigService,
    private mediaMatcher: MediaMatcher,
    private layoutService: LayoutService,
    private propuestaWizardService: PropuestaWizardService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.navegacion();
    let propuestaUuid = this.activeRoute.snapshot.paramMap.get('propuestaUuid');
    if(propuestaUuid){
      this.propuestaService.obtenerPropuesta(propuestaUuid).subscribe( resp => {
        this.PROPUESTA = resp;
        this.PROCESO_ITEM = this.PROPUESTA.procesoItem;
        this.propuestaService.setPropuesta(this.PROPUESTA);
      })
    }
  }

  ngOnDestroy(): void {
    this.propuestaService.clearPropuesta();
  }

  navegacion(){
    this.isDesktop$.pipe(
      untilDestroyed(this)
    ).subscribe(isDesktop => {
      if (isDesktop) {
        this.drawer?.open();
        this.propuestaWizardService.drawerOpen.next(true);
        this.cd.markForCheck();
      } else {
        this.drawer?.close();
        this.propuestaWizardService.drawerOpen.next(false);
        this.cd.markForCheck();
      }
    });
  }

  guardar() {


  }

  guardarPropuestaTecnica(){
    //this.propuestaTecnicaForm.guardarPropuestaTecnica();
  }

  drawerChange(drawerOpen: boolean) {
    this.propuestaWizardService.drawerOpen.next(drawerOpen);
    this.cd.markForCheck();
  }

  openDrawer() {
    this.propuestaWizardService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  closeDrawer() {
    this.propuestaWizardService.drawerOpen.next(false);
    this.cd.markForCheck();
  }

  
}
