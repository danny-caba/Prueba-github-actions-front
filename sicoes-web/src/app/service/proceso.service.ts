import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { Proceso } from '../interface/proceso.model';
import { tap, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  private solicitudSubject = new BehaviorSubject<Partial<Proceso>>(null);
  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  suscribeSolicitud(): Observable<Partial<Proceso>> {
    return this.solicitudSubject.asObservable();
  }

  setSolicitud(solicitud: Proceso){
    this.solicitudSubject.next(solicitud);
  }

  clearSolicitud(){
    this.solicitudSubject.next(null);
  }

  obtenerProceso(procesoUuid): Observable<Proceso> {
    const urlEndpoint = `${this._path_serve}/api/procesos/${procesoUuid}`
    return this.http.get<Proceso>(urlEndpoint);
  }

  buscarProcesos(filtro) {
    let urlEndpoint = `${this._path_serve}/api/procesos/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrarBorrador(request: any){
    let urlEndpoint = `${this._path_serve}/api/procesos`
    return this.http.post<Proceso>(urlEndpoint,request);
  }

  actualizarBorrador(request: any, procesoUuid){
    let urlEndpoint = `${this._path_serve}/api/procesos/${procesoUuid}`
    return this.http.put<Proceso>(urlEndpoint,request);
  }

  publicarProceso(request: any){
    let urlEndpoint = `${this._path_serve}/api/procesos/${request.procesoUuid}/publicar`
    return this.http.put<Proceso>(urlEndpoint,request);
  }

  registrarProcesoEtapa(request: any){
    let urlEndpoint = `${this._path_serve}/api/etapas`
    return this.http.post<Proceso>(urlEndpoint,request);
  }
  
  validaPrePresentacionPropuesta(procesoUuid:string, procesoItemUuid: string){
    let urlEndpoint = `${this._path_serve}/api/procesos/validacion-usuario/${procesoUuid}/${procesoItemUuid}`
    return this.http.get<any[]>(urlEndpoint);
  }

  validaProfesionalPropuesta(procesoUuid:string){
    let urlEndpoint = `${this._path_serve}/api/procesos/validacion-profesionales/${procesoUuid}`
    return this.http.get<Proceso>(urlEndpoint);
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
}
