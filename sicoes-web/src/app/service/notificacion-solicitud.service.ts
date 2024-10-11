import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services';
import { Capacitacion } from '../interface/capacitación.model';
import { SolicitudNotificacion } from '../interface/solicitud-notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionSolicitudService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerNotif(idSolNotificacion): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/solicitud-notificacion/${idSolNotificacion}`
    return this.http.get<Capacitacion>(urlEndpoint);
  }

  registratNotif(request: any) {
    let urlEndpoint = `${this._path_serve}/api/solicitud-notificacion`
    return this.http.post<Capacitacion>(urlEndpoint, request);
  }

  respuesta(solicitudUuid) {
    let urlEndpoint = `${this._path_serve}/api/solicitud-notificacion/respuesta/${solicitudUuid}`
    return this.http.get<SolicitudNotificacion>(urlEndpoint);
  }

  archivamiento(solicitudUuid) {
    let urlEndpoint = `${this._path_serve}/api/solicitud-notificacion/respuesta/${solicitudUuid}`
    return this.http.get<SolicitudNotificacion>(urlEndpoint);
  }
  
}
