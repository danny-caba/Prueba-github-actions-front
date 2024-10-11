import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { EmpresaSancionadaService } from 'src/app/service/empresa-sancionada.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Injectable({ providedIn: 'root' })
export class SolicitudSancionVigenteServicePNfecVig implements CanActivate {
  constructor(
    private router: Router,
    private empresaSancionada: EmpresaSancionadaService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return this.empresaSancionada.validarSancionVigentePNFec({}).pipe(
      
      tap(resp => {
        console.log(resp);
        if(!resp){
          functionsAlert.vigente('No es posible registrar la Solicitud.', 'Usted no ha superado 1 año de haber terminado su vinculo con OSINERGMIN.').then((result) => {
          });
           this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
         }
       })
    );

  }
}
