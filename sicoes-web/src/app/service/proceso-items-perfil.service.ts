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
export class ProcesoItemsPerfilService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerProcesoItems(idProceso): Observable<Proceso> {
    const urlEndpoint = `${this._path_serve}/api/items/${idProceso}`
    return this.http.get<Proceso>(urlEndpoint);
  }

  buscarItemsPerfiles(filtro, procesoItemUuid) {
    let urlEndpoint = `${this._path_serve}/api/itemPerfiles/listar?procesoItemUuid=${procesoItemUuid}`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint,{params:params});
  }

  registrarProcesoItemsPerfil(request: any){
    let urlEndpoint = `${this._path_serve}/api/itemPerfiles`
    return this.http.post<Proceso>(urlEndpoint,request);
  }

  actualizarProcesoItems(request: any){
    let urlEndpoint = `${this._path_serve}/api/items/${request.idProcesoItem}`
    return this.http.put<Proceso>(urlEndpoint,request);
  }

  eliminarProcesoItemsPerfil(idProcesoItem, request){
    let urlEndpoint = `${this._path_serve}/api/itemPerfiles/${idProcesoItem}?procesoItemUuid=${request.procesoItemUuid}`
    return this.http.delete<Proceso>(urlEndpoint);
  }
  

}
