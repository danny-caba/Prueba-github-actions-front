import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SuspeCancService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerSuspCanc(idSuspensionCancelacion): Observable<Solicitud> {
    const urlEndpoint = `${this._path_serve}/api/suspension-cancelacion/${idSuspensionCancelacion}`
    return this.http.get<Solicitud>(urlEndpoint);
  }

  buscar(filtro) {
    let urlEndpoint = `${this._path_serve}/api/suspension-cancelacion`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrarSuspension(request: any){
    let urlEndpoint = `${this._path_serve}/api/suspension-cancelacion`
    return this.http.post<Solicitud>(urlEndpoint,request);
  }

  actualizarSuspension(request: any, idSuspensionCancelacion){
    let urlEndpoint = `${this._path_serve}/api/suspension-cancelacion/${idSuspensionCancelacion}`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  eliminarSuspCanc(idSuspensionCancelacion: any){
    let urlEndpoint = `${this._path_serve}/api/suspension-cancelacion/${idSuspensionCancelacion}`
    return this.http.delete<Solicitud>(urlEndpoint);
  }
  
}
