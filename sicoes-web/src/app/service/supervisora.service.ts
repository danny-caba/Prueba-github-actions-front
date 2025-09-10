import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { Supervisora } from '../interface/supervisora.model';
import { List } from 'postcss/lib/list';

@Injectable({
  providedIn: 'root'
})
export class SupervisoraService {

  private solicitudSubject = new BehaviorSubject<Partial<Solicitud>>(null);
  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  suscribeSolicitud(): Observable<Partial<Solicitud>> {
    return this.solicitudSubject.asObservable();
  }

  setSolicitud(solicitud: Solicitud){
    this.solicitudSubject.next(solicitud);
  }

  clearSolicitud(){
    this.solicitudSubject.next(null);
  }

  buscarEmpresaSuper(filtro) {
    let urlEndpoint = `${this._path_serve}/api/supervisoras`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  buscarEmpresaMontoSuper(filtro) {
    let urlEndpoint = `${this._path_serve}/api/supervisoras/monto`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  listarSupervisorasPerfil(idPerfil) {
    let urlEndpoint = `${this._path_serve}/api/supervisoras/profesionales?idPerfil=${idPerfil}`
    return this.http.get<any>(urlEndpoint);
  }

  buscarEmpresaSuperPerfiles(filtro) {
    let urlEndpoint = `${this._path_serve}/api/supervisora-perfiles`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  obtenerSupervisora(idSupervisora): Observable<Supervisora> {
    const urlEndpoint = `${this._path_serve}/api/supervisoras/${idSupervisora}`
    return this.http.get<Supervisora>(urlEndpoint);
  }

  autocompleteEmpresaSupervisora(nombreSupervisora: string): Observable<any[]> {
    const urlEndpoint = `${this._path_serve}/api/supervisoras/autocomplete`;
    const params = { nombreSupervisora: nombreSupervisora };
    return this.http.get<any[]>(urlEndpoint, { params: params });
  }

}
