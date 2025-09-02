import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { Observable } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { Pageable } from '../interface/pageable.model';
import { tap, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Propuesta } from '../interface/propuesta.model';
import { RequerimientoRenovacion } from '../interface/requerimiento-renovacion.model';

@Injectable({
  providedIn: 'root'
})
export class RequerimientoRenovacionService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerSolicitudPorId(idSolicitud: number) {
    let urlEndpoint = `${this._path_serve}/api/requerimiento/${idSolicitud}/proceso`
    return this.http.get<any>(urlEndpoint);
  }

  obtenerRequerimientos(filtro): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/renovaciones/requerimientos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }

  obtenerContratos(filtro): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/requerimiento-renovacion/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }

  obtenerPropuesta(propuestaUuid): Observable<Propuesta> {
    const urlEndpoint = `${this._path_serve}/api/propuestas/${propuestaUuid}`
    return this.http.get<Propuesta>(urlEndpoint);
  }

  obtenerPorNumeroExpediente(nuExpediente): Observable<RequerimientoRenovacion> {
    const urlEndpoint = `${this._path_serve}/api/renovaciones/requerimientoPorNuExpediente/${nuExpediente}`
    return this.http.get<RequerimientoRenovacion>(urlEndpoint);
  }

  registrarRequerimientoRenovacion(request: any){
    let urlEndpoint = `${this._path_serve}/api/renovaciones/requerimiento`
    return this.http.post<any>(urlEndpoint,request);
  }

  obtenerRequerimientoRenovacion(request: any){
    let urlEndpoint = `${this._path_serve}/api/renovaciones/requerimiento`
    return this.http.post<any>(urlEndpoint,request);
  }

}
