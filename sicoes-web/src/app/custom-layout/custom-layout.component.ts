import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../@vex/services/layout.service';
import { filter, map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from '../../@vex/utils/check-router-childs-data';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfigService } from '../../@vex/config/config.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SidebarComponent } from '../../@vex/components/sidebar/sidebar.component';
import { ParametriaService } from '../service/parametria.service';
import { ListadoEnum, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { AuthFacade } from '../auth/store/auth.facade';
import { AuthUser } from '../auth/store/auth.models';
import { RolMenu } from 'src/helpers/constantes.options.';
import { NavigationService } from 'src/@vex/services/navigation.service';
import { VexConfigName } from 'src/@vex/config/config-name.model';
import { colorVariables } from 'src/@vex/components/config-panel/color-variables';
import { UsuarioService } from '../service/usuario.service';
import { NavigationItem } from 'src/@vex/interfaces/navigation-item.interface';


@UntilDestroy()
@Component({
  selector: 'vex-custom-layout',
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent implements OnInit {

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isFooterVisible$ = this.configService.config$.pipe(map(config => config.footer.visible));
  isDesktop$ = this.layoutService.isDesktop$;

  suscriptionUsuario: Subscription;
  usuario$ = this.authFacade.user$;
  usuario: AuthUser

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
              private authFacade: AuthFacade,
              private parametriaService: ParametriaService,
              private usuarioService: UsuarioService,
              private navigationService: NavigationService) {
  
    this.navigationService.items = [];

    this.usuarioService.obtenerMenu().subscribe(res => {
      this.usuario = res;

      let itemsDupliados: NavigationItem[] = [];

      console.log('User data received:', this.usuario);
      console.log('User roles:', this.usuario?.roles);

      this.usuario?.roles?.forEach(element => {
        let menu: any = RolMenu.find(item => item.ROL.CODIGO === element.codigo);
        
        if (menu && menu.MENU) {
          itemsDupliados.push(...menu.MENU);
        }

        if(this.usuario?.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO){
          //remove menu 10 Bdj Invitados
          itemsDupliados = itemsDupliados.filter(function(el) { return el.codigo != "menu10"; });
        }
      });
      let unique: NavigationItem[] = [...new Set(itemsDupliados)];
      this.navigationService.items.push(...unique);
    })
  
  }

  ngOnInit() {
    this.layoutService.configpanelOpen$.pipe(
      untilDestroyed(this)
    ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());

    this.cargarCombos();

    this.configService.setConfig('vex-layout-apollo' as VexConfigName);     
    this.configService.updateConfig({
      layout: 'horizontal',
      toolbar: {
        fixed: false,
        user: {
          visible: true
        }
      },
      sidenav: {
        title: 'SICOES',
        search: {
          visible: false
        },
        user: {
          visible: false
        }
      },
      style: {
        colors: {
          primary: colorVariables['sicoes']
        }
      }
    });

  }

  cargarCombos() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ESTADO_SOLICITUD,
      ListadoEnum.TIPO_DOCUMENTO,
      ListadoEnum.TIPO_DOCUMENTO_PJ,
      ListadoEnum.TIPO_CAPACITACION,
      ListadoEnum.TIPO_DOCUMENTO_PN,
      ListadoEnum.TIPO_CAUSALES,
      ListadoEnum.CAUSALES_SUSPENSION,
      ListadoEnum.CAUSALES_CANCELACION,
      ListadoEnum.SECTOR,
      ListadoEnum.SUBSECTOR,
      ListadoEnum.ACTIVIDAD,
      ListadoEnum.UNIDAD,
      ListadoEnum.OTROS_REQUISITOS,
      ListadoEnum.TIPO_DOCUMENTO_ACREDITA,
      ListadoEnum.PAIS,
      ListadoEnum.ESTADO_REVISION,
      ListadoEnum.TIPO_SOLICITUD,
      ListadoEnum.RESULTADO_EVALUACION,
      ListadoEnum.ESTADO_NOTIFICACION,
      ListadoEnum.ESTADO_TOKEN,
      ListadoEnum.ESTADO_EVALUACION,
      ListadoEnum.GRADO_ACADEMICO,
      ListadoEnum.TIPO_EVALUADOR,
      ListadoEnum.ESTADO_ROL,
      ListadoEnum.TIPO_ARCHIVO,
      ListadoEnum.OTROS_DOCUMENTOS_PN,
      ListadoEnum.OTROS_DOCUMENTOS_PJ,
      ListadoEnum.TIPO_ESTUDIO,
      ListadoEnum.FUENTE_ESTUDIO,
      ListadoEnum.PAISES,
      ListadoEnum.MONEDA,
      ListadoEnum.CUENTA_CONFORMIDAD,
      ListadoEnum.UNIDAD,
      ListadoEnum.RESULTADO_EVALUACION_ADM,
      ListadoEnum.SUBCATEGORIA,
      ListadoEnum.PERFILES,
      ListadoEnum.RESULTADO_EVALUACION_TEC_ADM,
      ListadoEnum.GRUPOS,
      ListadoEnum.TIPO_IDEN_TRIBUTARIA,
      ListadoEnum.TIPO_PERSONA,
      ListadoEnum.CAUSAL_SUSPENSION,
      ListadoEnum.CAUSAL_CANCELACION,
      ListadoEnum.ESTADO_PROCESO,
      ListadoEnum.ESTADO_ITEM,
      ListadoEnum.ESTADO_INVITACION,
      ListadoEnum.ESTADO_PRESENTACION,
      ListadoEnum.ETAPA_PROCESO,
      ListadoEnum.CARGO_MIEMBRO,
      ListadoEnum.TIPO_FACTURACION,
      ListadoEnum.TIPO_SECCION,
      ListadoEnum.TIPO_CONTRATO,
      ListadoEnum.TIPO_DATO,
      ListadoEnum.ENTRADA_DATO,
      ListadoEnum.ADJUDICACION_SIMPLIFICADA,
      ListadoEnum.TIPO_CONTRATO,  
    ]).subscribe(listRes => {

    })
  }

}
