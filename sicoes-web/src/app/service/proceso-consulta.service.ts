import { Injectable } from '@angular/core';
import { ProcesoConsulta } from '../interface/proceso.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { functions } from 'src/helpers/functions';

@Injectable({
  providedIn: 'root'
})
export class ProcesoConsultaService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  registrar(request: any){
    let urlEndpoint = `${this._path_serve}/api/consultas`
    return this.http.post<ProcesoConsulta>(urlEndpoint, request);
  }

  actualizar(request: any){
    let urlEndpoint = `${this._path_serve}/api/consultas/${request.procesoConsultaUuid}`
    return this.http.put<ProcesoConsulta>(urlEndpoint, request);
  }

  eliminar(procesoConsultaUuid: number){
    let urlEndpoint = `${this._path_serve}/api/consultas/${procesoConsultaUuid}`
    return this.http.delete(urlEndpoint);
  }
  
  obtenerConsultasUsuario(filtro: any){
    let urlEndpoint = `${this._path_serve}/api/consultas`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<ProcesoConsulta>>(urlEndpoint, {
      params
    });
  }

  actualizarEstadoEnvio(idProceso: number){
    let urlEndpoint = `${this._path_serve}/api/consultas`
    return this.http.put(urlEndpoint, idProceso);
  }

}
