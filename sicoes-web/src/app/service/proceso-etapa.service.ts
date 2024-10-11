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
export class ProcesoEtapaService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerProcesoEtapa(idProcesoEtapa,procesoUuid): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/etapas/${idProcesoEtapa}?procesoUuid=${procesoUuid}`
    return this.http.get<any>(urlEndpoint);
  }

  buscarProcesosEtapa(filtro) {
    let urlEndpoint = `${this._path_serve}/api/etapas/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrarProcesoEtapa(request: any){
    let urlEndpoint = `${this._path_serve}/api/etapas`
    return this.http.post<Proceso>(urlEndpoint,request);
  }
  
  actualizarProcesoEtapa(request: any){
    let urlEndpoint = `${this._path_serve}/api/etapas/${request.idProcesoEtapa}?procesoUuid=${request.proceso?.procesoUuid}`
    return this.http.put<Proceso>(urlEndpoint,request);
  }

  eliminarProcesoEtapa(idProcesoItem,procesoUuid){
    let urlEndpoint = `${this._path_serve}/api/etapas/${idProcesoItem}?procesoUuid=${procesoUuid}`
    return this.http.delete<Proceso>(urlEndpoint);
  }

}
