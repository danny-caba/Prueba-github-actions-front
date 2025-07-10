import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Opcion, OpcionPorRol } from 'src/helpers/constantes.options.';
import { AuthFacade } from '../store/auth.facade';
import { AuthUser } from '../store/auth.models';

@Directive({
  selector: '[vexOptionRoleRequerimiento]'
})
export class OptionRoleRequerimientoDirective implements OnInit, OnChanges, OnDestroy {

  @Input() vexOptionRoleRequerimiento: Opcion;
  @Input() vexOptionRoleRequerimientoElse?: TemplateRef<unknown>;

  suscriptionUsuario: Subscription;
  usuario$ = this.authFacade.user$;
  usuario: AuthUser

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authFacade: AuthFacade
  ) {
    this.suscriptionUsuario = this.usuario$.subscribe(usu => {
      this.usuario = usu;
      this.validarOpcion();
    })
  }

  ngOnInit(){
    this.validarOpcion();
  }

  validarOpcion(){
    if(this.vexOptionRoleRequerimiento){
      this.viewContainer.clear();
      if(this.tieneOpcion()){
        this.viewContainer.createEmbeddedView(this.templateRef);
      }else if(this.vexOptionRoleRequerimientoElse){
        this.viewContainer.createEmbeddedView(this.vexOptionRoleRequerimientoElse);
      }
    }
  }

  tieneOpcion(): boolean {
    if (!this.usuario?.roles) return false;
    
    return this.usuario.roles.some(rol => {
      const opcionesRol = OpcionPorRol.find(opc => opc.rol === rol.codigo);
      return opcionesRol?.opciones?.includes(this.vexOptionRoleRequerimiento);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.usuario){
      this.validarOpcion();
    }
  }

  ngOnDestroy() {
    this.suscriptionUsuario?.unsubscribe();
  }
} 