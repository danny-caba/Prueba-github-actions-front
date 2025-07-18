import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { OpcionConfig, OpcionPorRol } from 'src/helpers/constantes.options.';
import { AuthFacade } from '../store/auth.facade';
import { AuthUser } from '../store/auth.models';

@Directive({
  selector: '[vexOptionRoleReemplazo]'
})
export class OptionRoleReemplazoDirective implements OnInit, OnChanges, OnDestroy {

  @Input() vexOptionRoleReemplazo: string;
  @Input() vexOptionRoleElse?: TemplateRef<unknown>;

  suscriptionSolicitud: Subscription;
  suscriptionUsuario: Subscription;
  usuario$ = this.authFacade.user$;
  usuario: AuthUser
  opcionPagina: any[]

  constructor(
    private activeRoute: ActivatedRoute,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authFacade: AuthFacade
  ) {
    console.log('✅ Directiva inicializada');
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
    console.log('vexOptionRoleReemplazo', this.vexOptionRoleReemplazo);
    this.suscribirSolicitud();
  }

  private suscribirSolicitud() {
    this.validarOpcionSolicitud();
  }

  validarOpcionSolicitud(){
    let buscarOpcion = this.validarOpcion();
    
    if(this.vexOptionRoleReemplazo){
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
    console.log('user', this.usuario);
    this.usuario?.roles?.forEach(element => {
      let codigoRol = element.codigo;

      let opcs: any = OpcionPorRol.find(ele => ele.rol == codigoRol);
      console.log('opcs', opcs);
      
      let shouldSkip = false;
      if(opcs?.opciones?.includes(this.vexOptionRoleReemplazo)){
        if(shouldSkip){
          return;
        }
        OpcionConfig.forEach(opCong => {
          if(shouldSkip){
            return;
          }
          if(opCong.codigo == this.vexOptionRoleReemplazo){
            buscarOpcion = true;

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

  ngOnChanges(changes: SimpleChanges): void {
    if(this.usuario){
      this.validarOpcionSolicitud();
    }
  }

  ngOnDestroy() {
    this.suscriptionSolicitud?.unsubscribe();
    this.suscriptionUsuario?.unsubscribe();
  }

}
