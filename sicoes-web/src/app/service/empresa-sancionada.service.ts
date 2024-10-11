import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaSancionadaService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerSolicitud(ruc): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/empresas-sancionadas/${ruc}`
    return this.http.get<any>(urlEndpoint);
  }

  validarEmpresaSancionada(ruc): Observable<any> {
    let params = functions.obtenerParams(ruc);
    //return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});

    return this.http.get<any>(`${this._path_serve}/api/empresas-sancionadas`,{params:params}).pipe(
      tap(),
    ).pipe(
      map(res => res?.respuesta == 'NO'),
      catchError(err => {
        return of(false);
      }
    ),
    );
  }

  validarPropuesta(propuestaUuid): Observable<any> {
    let params = functions.obtenerParams(propuestaUuid);
    return this.http.get<any>(`${this._path_serve}/api/propuestas/validacion-usuario/${propuestaUuid}`,{params:params}).pipe(
      tap(),
    ).pipe(
      map(res => res?.respuesta == 'NO'),
      catchError(err => {
        return of(false);
      }
    ),
    );
  }

  validarSancionVigente(ruc): Observable<any> {

    let params = functions.obtenerParams(ruc);
    //return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});

    return this.http.get<any>(`${this._path_serve}/api/sancion-vigente`,{params:params}).pipe(
      tap(),
    ).pipe(
      
      map(res => (res?.respuesta == '2')),
      catchError(err => {
        return of(false);
      }
    ),
    );
  }
  validarSancionVigentePN(ruc): Observable<any> {

    let params = functions.obtenerParams(ruc);
    //return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});

    return this.http.get<any>(`${this._path_serve}/api/sancion-vigente`, { params: params }).pipe(
      tap(),
    ).pipe(
      map(res => (res?.respuestaPN == '2')),
      catchError(err => {
        console.error('Error al obtener datos:', err); // Imprime el error en la consola
        return of(false);
      })
    );
  }    
  
  validarSancionVigentePNFec(ruc): Observable<any> {

    let params = functions.obtenerParams(ruc);
    //return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});

    return this.http.get<any>(`${this._path_serve}/api/sancion-vigente`, { params: params }).pipe(
      tap(),
    ).pipe(
      map(res => (res?.respuestaFec == '2')),
      catchError(err => {
        console.error('Error al obtener datos:', err); // Imprime el error en la consola
        return of(false);
      })
    );
  }    
}
