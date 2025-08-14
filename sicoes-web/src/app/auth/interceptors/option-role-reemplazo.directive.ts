import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OpcionPorRol } from 'src/helpers/constantes.options.';
import { AuthFacade } from '../store/auth.facade';
import { AuthUser } from '../store/auth.models';

@Directive({
  selector: '[vexOptionRoleReemplazo]',
  exportAs: 'vexOptionRoleReemplazo'
})
export class OptionRoleReemplazoDirective implements OnInit, OnChanges, OnDestroy {

  @Input() vexOptionRoleReemplazo: string;
  @Input() vexOptionRoleReemplazoExtraCondition?: boolean = true;

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
    this.validarOpcionSolicitud();
  }

  validarOpcionSolicitud(){
    let buscarOpcion = this.validarOpcion();
    
    if(this.vexOptionRoleReemplazo){
      this.viewContainer.clear();  
      if(buscarOpcion && this.vexOptionRoleReemplazoExtraCondition){
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    }
  }

  validarOpcion(){
    let buscarOpcion = false;
    this.usuario?.roles?.forEach(element => {
      let opcs: any = OpcionPorRol.find(ele => ele.rol == element.codigo);
      if (opcs?.opciones?.includes(this.vexOptionRoleReemplazo)){
        buscarOpcion = true;
        return;
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
