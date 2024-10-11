import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { RolEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { OpcionConfig, OpcionPorRol } from 'src/helpers/constantes.options.';
import { functions } from 'src/helpers/functions';
import { AuthFacade } from '../store/auth.facade';
import { AuthUser } from '../store/auth.models';

@Directive({
  selector: '[vexOptionRole]'
})
export class OptionRoleDirective implements OnInit, OnChanges, OnDestroy {

  @Input() vexOptionRole: string;
  @Input() vexOptionRoleElse?: TemplateRef<unknown>;

  suscriptionSolicitud: Subscription;
  suscriptionUsuario: Subscription;
  solicitud: Partial<Solicitud> = {
    estado: {
      codigo: SolicitudEstadoEnum.BORRADOR
    }
  }
  usuario$ = this.authFacade.user$;
  usuario: AuthUser
  opcionPagina: any[]

  constructor(
    private activeRoute: ActivatedRoute,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade
  ) {
    this.activeRoute.data.subscribe(data => {
      if(data.opcionPagina){
        this.opcionPagina = data.opcionPagina;
      }
    })

    this.suscriptionUsuario = this.usuario$.subscribe(usu => {
      this.usuario = usu;
    })
    
  }

  ngOnInit(){
    this.suscribirSolicitud();
  }

  private suscribirSolicitud() {
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      if(sol?.solicitudUuid){
        this.solicitud = sol;
        this.validarOpcionSolicitud();
      }
    });
  }

  validarOpcionSolicitud(){
    let buscarOpcion = this.validarOpcion();
    
    if(this.vexOptionRole){
      this.viewContainer.clear();  
      if(buscarOpcion){
        this.viewContainer.createEmbeddedView(this.templateRef);
      }else if(this.vexOptionRoleElse){
        this.viewContainer.createEmbeddedView(this.vexOptionRoleElse);
      }
    }
  }

  validarOpcion(){
    let buscarOpcion = false;
    this.usuario?.roles?.forEach(element => {
      let codigoRol = element.codigo;

      let opcs: any = OpcionPorRol.find(ele => ele.rol == codigoRol);
      
      let shouldSkip = false;
      if(opcs?.opciones?.includes(this.vexOptionRole) && this.opcionPagina?.includes(this.vexOptionRole)){
        if(shouldSkip){
          return;
        }
        OpcionConfig.forEach(opCong => {
          if(shouldSkip){
            return;
          }
          if(opCong.codigo == this.vexOptionRole && opCong.estadoSolicitud == this.solicitud?.estado?.codigo){
            buscarOpcion = true;

            if(functions.noEsVacio(opCong.estadoRevisionAdm)){
              buscarOpcion = (opCong.estadoRevisionAdm == this.solicitud?.estadoEvaluacionAdministrativa?.codigo)
            }

            if(functions.noEsVacio(opCong.estadoRevisionTec)){
              buscarOpcion = (opCong.estadoRevisionTec == this.solicitud?.estadoEvaluacionTecnica?.codigo)
            }

            if(functions.noEsVacio(opCong.evaluadorRol)){
              let isOwner = this.buscarOwner(codigoRol, opCong.evaluadorRol);
              buscarOpcion = (buscarOpcion && isOwner);
            }

            if(buscarOpcion){
              shouldSkip = true;
            }
          }
        });

        if(buscarOpcion){
          shouldSkip = true;
        }
      }
    });
    return buscarOpcion;
  }

  buscarOwner(codigoRol, evaluadorRol){
    let buscarOwner = false;
    if(codigoRol == RolEnum.EVA_ADMIN || codigoRol == RolEnum.EVA_TECNI){
      this.solicitud?.asignados.forEach(ele => {
        if(buscarOwner){
          return;
        }
        if(codigoRol == RolEnum.EVA_ADMIN && ele.tipo.codigo == evaluadorRol && this.usuario.idUsuario == ele.usuario.idUsuario){
          buscarOwner = true;
        }
        if(codigoRol == RolEnum.EVA_TECNI && ele.tipo.codigo == evaluadorRol && this.usuario.idUsuario == ele.usuario.idUsuario){
          buscarOwner = true;
        }
      });
    }
    
    return buscarOwner;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.solicitud?.estado?.codigo && this.usuario){
      this.validarOpcionSolicitud();
    }
  }

  ngOnDestroy() {
    this.suscriptionSolicitud?.unsubscribe();
    this.suscriptionUsuario?.unsubscribe();
  }

}
