import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { functions } from "src/helpers/functions";
import { ConfigService } from "../core/services";
import { Pageable } from "../interface/pageable.model";
import { Solicitud, SolicitudListado } from "../interface/solicitud.model";

@Injectable({
  providedIn: "root",
})
export class InvitacionService {
  private invitacionSubject = new BehaviorSubject<Partial<any>>(null);
  private _path_serve: String;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this._path_serve = this.configService.getAPIUrl();
  }

  suscribeInvitacion(): Observable<Partial<any>> {
    return this.invitacionSubject.asObservable();
  }

  setInvitacion(solicitud: any) {
    this.invitacionSubject.next(solicitud);
  }

  clearInvitacion() {
    this.invitacionSubject.next(null);
  }

  obtenerPropuestaProfesional(id, propuestaUuid): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/propuestasProfesionales/${id}`;
    let params = functions.obtenerParams({ propuestaUuid: propuestaUuid });
    return this.http.get<any>(urlEndpoint, { params: params });
  }

  buscarPropuestaProfesional(filtro) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales`;
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, {
      params: params,
    });
  }

  enviarInvitacion(request: any) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales`;
    return this.http.post<any>(urlEndpoint, request);
  }

  enviarInvitacion2(request: any) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales2`;
    return this.http.post<any>(urlEndpoint, request);
  }

  aceptarInvitacion(id, propuestaUuid, request: any) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales/${id}/aceptar?propuestaUuid=${propuestaUuid}`;
    return this.http.put<any>(urlEndpoint, request);
  }

  rechazarInvitacion(id, propuestaUuid, request: any) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales/${id}/rechazar?propuestaUuid=${propuestaUuid}`;
    return this.http.put<any>(urlEndpoint, request);
  }

  cancelarInvitacion(id, propuestaUuid, request: any) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales/${id}/cancelar?propuestaUuid=${propuestaUuid}`;
    return this.http.put<any>(urlEndpoint, request);
  }

  listarInvitaciones(filtro: any) {
    const url = `${this._path_serve}/api/invitaciones`;
    let params = functions.obtenerParams(filtro);
  
    return this.http.get<any>(url, { params }).pipe(
      map(respuesta => {
        if (respuesta && Array.isArray(respuesta.content)) {
          respuesta.content.forEach(item => {
            const saldo = item.saldoContrato;
            if (typeof saldo === 'number' && !isNaN(saldo)) {
              const anios = Math.floor(saldo / 365);
              const meses = Math.floor((saldo % 365) / 30.44);
              const dias = Math.floor(saldo % 30.44);
              item.saldoContrato = `${anios} años ${meses} meses ${dias} días`;
            }
          });
        }
        return respuesta;
      })
    );
  }

  evaluarInvitacion(
    id: string,
    body: { codigo: string }
  ): Observable<any> {
    const url = `${this._path_serve}/api/invitaciones/${id}/evaluar`;
    return this.http.patch<any>(url, body);
  }
}
