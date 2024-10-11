import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { Proceso } from '../interface/proceso.model';

@Injectable({
  providedIn: 'root'
})
export class ProcesoMiembtoService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerProcesoMiembro(idProcesoMiembro,procesoUuid): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/miembros/${idProcesoMiembro}?procesoUuid=${procesoUuid}`
    return this.http.get<any>(urlEndpoint);
  }

  buscarProcesosMiembro(filtro) {
    let urlEndpoint = `${this._path_serve}/api/miembros/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrarProcesoMiembro(request: any){
    let urlEndpoint = `${this._path_serve}/api/miembros`
    return this.http.post<Proceso>(urlEndpoint,request);
  }

  actualizarProcesoMiembro(request: any){
    let urlEndpoint = `${this._path_serve}/api/miembros/${request.idProcesoMiembro}?procesoUuid=${request.proceso.procesoUuid}`
    return this.http.put<Proceso>(urlEndpoint,request);
  }

  eliminarProcesoMiembro(idProcesoMiembro,procesoUuid){
    let urlEndpoint = `${this._path_serve}/api/miembros/${idProcesoMiembro}?procesoUuid=${procesoUuid}`
    return this.http.delete<Proceso>(urlEndpoint);
  }

  inactivarProcesoMiembro(idProcesoMiembro,procesoUuid){
    let urlEndpoint = `${this._path_serve}/api/miembros/${idProcesoMiembro}/inactivar?procesoUuid=${procesoUuid}`
    return this.http.put<Proceso>(urlEndpoint, { proceso: {procesoUuid:procesoUuid}});
  }
}
