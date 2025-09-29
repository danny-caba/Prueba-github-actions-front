import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { take, tap } from 'rxjs/operators';

import { selectIsLoggedIn } from '../store/auth.selectors';
import { UsuarioService } from 'src/app/service/usuario.service';
import { RolMenu } from 'src/helpers/constantes.options.';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';

@Injectable({ providedIn: 'root' })
export class RoleGuardService implements CanActivate {
  constructor(
    private router: Router, 
    private store: Store,
    private usuarioService: UsuarioService
    ) {}

  canActivate(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot):Observable<boolean> {

    return this.usuarioService.obtenerMenu().pipe(
      map(data => {        

        //console.info(data)
/*        console.info(state.url)
        console.info(state.root)
        console.info(route.url)*/
      

        let verifica = false;

        /*data.modulos.map(value => {
          const pathRole = value.route.split("/")[value.route.split("/").length-1]
          if(pathRole == pathFinal){
            verifica = true;
          }
        })  */      

        /*data?.opciones?.ROOT?.map(value => {
          
            if('/' + value.url == state.url){
              verifica = true;
            }
          
        })*/  

        data?.roles?.forEach(element => {
          let codigoRol = element.codigo;
          let opcs: any = RolMenu.find(ele => ele.ROL?.CODIGO == codigoRol);

          if (opcs && opcs.path) {
            console.log(`Role ${codigoRol} - Checking paths:`, opcs.path);
            console.log('Current URL:', state.url);
            
            opcs.path.map(value => {
              if(state.url.replace(/\d+/g, '').includes('/' + value)){
                console.log(`Matched path: /${value}`);
                verifica = true;
              }
            })
          }

        });

        /*console.info(data.tipoPersona?.codigo)
        console.info(state.url)*/
        if(data.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO && state.url.includes('invitaciones')){
          console.info("aa")
          return false;
        }
        
        //console.info(verifica)
        
        console.log('Final verification result:', verifica);
        
        if(verifica){
          return verifica;
        }else{
          console.log('Access denied to:', state.url);          
          //this.router.navigate(data[0].route.split('/'));
          return verifica;
        }

      })
    )

  }
}
