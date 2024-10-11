import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services';
import { Capacitacion } from '../interface/capacitación.model';
import { Pageable } from '../interface/pageable.model';
import { SolicitudListado } from '../interface/solicitud.model';
import { functions } from 'src/helpers/functions';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerCapacitacion(idCapacitacion): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/estudios/capacitaciones/${idCapacitacion}`
    return this.http.get<Capacitacion>(urlEndpoint);
  }

  buscarCapacitacion(filtro) {
    let urlEndpoint = `${this._path_serve}/api/estudios/capacitaciones`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, { params: params });
  }

  registrarCapacitacion(request: any) {
    let urlEndpoint = `${this._path_serve}/api/estudios/capacitaciones`
    return this.http.post<Capacitacion>(urlEndpoint, request);
  }

  actualizarCapacitacion(request: any) {
    let urlEndpoint = `${this._path_serve}/api/estudios/capacitaciones/${request.idEstudio}`
    return this.http.put<Capacitacion>(urlEndpoint, request);
  }

  eliminar(id: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/capacitaciones/${id}`
    return this.http.delete<Capacitacion>(urlEndpoint);
  }

  evaluarCapacitacion(request: any, idRequisito: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/capacitaciones/${idRequisito}/evaluar`
    return this.http.put<Capacitacion>(urlEndpoint,request);
  }
}
