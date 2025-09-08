import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { InformeRenovacion } from '../interface/informe-renovacion.model';

@Injectable({
  providedIn: 'root'
})
export class InvitacionRenovacionService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  listar(filtro): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/renovaciones/invitaciones`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }

  enviar(request: any){
    let urlEndpoint = `${this._path_serve}/api/invitaciones/registrar`
    return this.http.post<any>(urlEndpoint,request);
  }


  aceptarInvitacion(invitacionData: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/renovaciones/invitacion/aceptar`;
    return this.http.post<any>(urlEndpoint, invitacionData);
  }

  rechazarInvitacion(invitacionData: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/renovaciones/invitacion/rechazar`;
    return this.http.post<any>(urlEndpoint, invitacionData);
  }

  notificarRenovacion(idTipoNotifica: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/informe/renovacion/notifica/${idTipoNotifica}`;
    return this.http.post<any>(urlEndpoint, {});
  }
}
