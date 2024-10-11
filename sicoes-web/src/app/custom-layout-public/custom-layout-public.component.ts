import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../@vex/services/layout.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from '../../@vex/utils/check-router-childs-data';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfigService } from '../../@vex/config/config.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SidebarComponent } from '../../@vex/components/sidebar/sidebar.component';
import { VexConfigName } from 'src/@vex/config/config-name.model';
import { colorVariables } from 'src/@vex/components/config-panel/color-variables';
import { NavigationService } from 'src/@vex/services/navigation.service';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { ParametriaService } from '../service/parametria.service';


@UntilDestroy()
@Component({
  selector: 'vex-custom-layout-public',
  templateUrl: './custom-layout-public.component.html',
  styleUrls: ['./custom-layout-public.component.scss']
})
export class CustomLayoutPublicComponent implements OnInit {

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isFooterVisible$ = this.configService.config$.pipe(map(config => config.footer.visible));
  isDesktop$ = this.layoutService.isDesktop$;

  toolbarShadowEnabled$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.toolbarShadowEnabled))
  );

  @ViewChild('configpanel', { static: true }) configpanel: SidebarComponent;

  constructor(private layoutService: LayoutService,
              private configService: ConfigService,
              private breakpointObserver: BreakpointObserver,
              private router: Router,
              private parametriaService: ParametriaService,
              private navigationService: NavigationService) {
                
    this.navigationService.items = [];
  }

  ngOnInit() {
    this.layoutService.configpanelOpen$.pipe(
      untilDestroyed(this)
    ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());

    this.cargarCombos();

    this.configService.setConfig('vex-layout-apollo' as VexConfigName);     
    this.configService.updateConfig({
      layout: 'vertical',
      toolbar: {
        fixed: false,
        user: {
          visible: true
        }
      },
      sidenav: {
        title: 'SICOES',
        showCollapsePin: false,
        search: {
          visible: false
        },
        user: {
          visible: false
        },
        state: 'collapsed'
      },
      style: {
        colors: {
          primary: colorVariables['sicoes']
        }
      }
    });
  }

  cargarCombos() {
    this.parametriaService.obtenerMultipleListadoDetallePublico([
      ListadoEnum.PAIS
    ]).subscribe(listRes => {

    })
  }
}
