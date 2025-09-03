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
export class InformeRenovacionService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  aprobarInformeRenovacion(request: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/informe/renovacion/aprobar`;
    return this.http.post<any>(urlEndpoint, request);
  }

  rechazarInformeRenovacion(request: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/informe/renovacion/rechazar`;
    return this.http.post<any>(urlEndpoint, request);
  }

  registrar(request: InformeRenovacion): Observable<InformeRenovacion> {
    const urlEndpoint = `${this._path_serve}/api/renovacion/informes`;
    return this.http.post<InformeRenovacion>(urlEndpoint, request);
  }

  listarInformes(tipoAprobador: string, numeroExpediente?: string, estado?: number, idContratista?: number, pageable?: any): Observable<any> {
    let params = new URLSearchParams();
    params.append('tipoAprobador', tipoAprobador);
    
    if (numeroExpediente) params.append('numeroExpediente', numeroExpediente);
    if (estado !== undefined) params.append('estado', estado.toString());
    if (idContratista !== undefined) params.append('idContratista', idContratista.toString());
    if (pageable) {
      if (pageable.page !== undefined) params.append('page', pageable.page.toString());
      if (pageable.size !== undefined) params.append('size', pageable.size.toString());
      if (pageable.sort) params.append('sort', pageable.sort);
    }

    const urlEndpoint = `${this._path_serve}/api/renovacion/informes?${params.toString()}`;
    return this.http.get<any>(urlEndpoint);
  }

  obtenerParametrosFirmaDigital(idInformeRenovacion: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/informe/renovacion/firma-digital/obtenerParametros`;
    const requestBody = { idInformeRenovacion: idInformeRenovacion };
    return this.http.post<any>(urlEndpoint, requestBody);
  }
}
