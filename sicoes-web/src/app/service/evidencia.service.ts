import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Evidencia } from '../interface/evidencia.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerEvidencia(idArchivo): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/archivos/${idArchivo}`
    return this.http.get<Evidencia>(urlEndpoint);
  }

  buscarEvidencias(filtro) {
    let urlEndpoint = `${this._path_serve}/api/archivos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, { params: params });
  }

  registrar(request: any) {
    let urlEndpoint = `${this._path_serve}/api/archivos`
    return this.http.post<Evidencia>(urlEndpoint, request);
  }

  actualizar(request: any) {
    let urlEndpoint = `${this._path_serve}/api/archivos/${request.idArchivo}`
    return this.http.put<Evidencia>(urlEndpoint, request);
  }

  eliminar(id: any) {
    let urlEndpoint = `${this._path_serve}/api/archivos/${id}`
    return this.http.delete<Evidencia>(urlEndpoint);
  }
}
