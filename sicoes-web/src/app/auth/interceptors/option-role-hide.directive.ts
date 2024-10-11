import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { AuthFacade } from '../store/auth.facade';
import { AuthUser } from '../store/auth.models';

@Directive({
  selector: '[vexOptionRoleHide]'
})
export class OptionRoleHideDirective implements OnInit, OnChanges, OnDestroy {

  @Input() vexOptionRoleHide: string;
  suscriptionSolicitud: Subscription;
  suscriptionUsuario: Subscription;
  solicitud: Partial<Solicitud> = {
    estado: {
      codigo: SolicitudEstadoEnum.BORRADOR
    }
  }
  usuario$ = this.authFacade.user$;
  usuario: AuthUser

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private el: ElementRef, private renderer: Renderer2
  ) {
    //this.validateAccess();
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
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.solicitud?.estado?.codigo && this.usuario){
      this.validarOpcionSolicitud();
    }
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
    this.suscriptionUsuario.unsubscribe();
  }

}
