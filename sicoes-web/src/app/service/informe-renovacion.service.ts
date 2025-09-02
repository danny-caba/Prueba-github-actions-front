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
    const urlEndpoint = `${this._path_serve}/api/informes-renovacion/aprobar`;
    return this.http.put<any>(urlEndpoint, request);
  }

  registrar(request: InformeRenovacion): Observable<InformeRenovacion> {
    const urlEndpoint = `${this._path_serve}/api/renovacion/informes`;
    return this.http.post<InformeRenovacion>(urlEndpoint, request);
  }
}
