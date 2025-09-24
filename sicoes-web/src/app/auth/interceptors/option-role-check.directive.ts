import { ChangeDetectorRef, Directive, Input, OnInit } from '@angular/core';
import { OpcionConfig, OpcionPorRol } from 'src/helpers/constantes.options.';
import { AuthFacade } from '../store/auth.facade';
import { AuthUser } from '../store/auth.models';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[vexOptionRoleCheck]',
  exportAs: 'vexOptionRoleCheck'
})
export class OptionRoleCheckDirective implements OnInit {

  @Input() vexOptionRoleCheck: string;
  
  private userSub: Subscription;
  user$ = this.authFacade.user$;
  usuario: AuthUser;
  private permiso: boolean = false;

  constructor(
    private authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userSub = this.user$.subscribe(usu => {
      this.usuario = usu;
      this.permiso = this.validarOpcion();
    })
    this.cd.detectChanges(); 
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  get hasPermission(): boolean {
    return this.permiso;
  }

  private validarOpcion(): boolean {
    let buscarOpcion = false;
    this.usuario?.roles?.forEach(element => {
      let opcs: any = OpcionPorRol.find(ele => ele.rol == element.codigo);
      if (opcs?.opciones?.includes(this.vexOptionRoleCheck)){
        buscarOpcion = true;
      }
    
    });

    return buscarOpcion;
  }
}