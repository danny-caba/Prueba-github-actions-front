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
export class SolicitudGuardService implements CanActivate {
  constructor(
    private router: Router,
    private empresaSancionada: EmpresaSancionadaService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return this.empresaSancionada.validarEmpresaSancionada({}).pipe(
      tap(resp => {
        if(!resp){
          functionsAlert.error('No se puede generar la solicitud porque el RUC se encuentra en el REGISTRO DE INHABILITACIÓN DE EMPRESAS SUPERVISORAS').then((result) => {
          });
          this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
        }
      })
    );

  }
}
