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
export class ProcesoItemsService {
 
  private procesoItemSubject = new BehaviorSubject<Partial<any>>(null);
  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  suscribeProcesoItem(): Observable<Partial<any>> {
    return this.procesoItemSubject.asObservable();
  }

  setProcesoItem(solicitud: any){
    this.procesoItemSubject.next(solicitud);
  }

  clearProcesoItem(){
    this.procesoItemSubject.next(null);
  }

  obtenerProcesoItems(idProceso): Observable<Proceso> {
    const urlEndpoint = `${this._path_serve}/api/items/${idProceso}`
    return this.http.get<Proceso>(urlEndpoint);
  }

  buscarProcesosItems(filtro) {
    let urlEndpoint = `${this._path_serve}/api/items/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  buscarListProcesoItems(filtro) {
    let urlEndpoint = `${this._path_serve}/api/items/procesos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrarProcesoItems(request: any){
    let urlEndpoint = `${this._path_serve}/api/items`
    return this.http.post<Proceso>(urlEndpoint,request);
  }

  actualizarProcesoItems(request: any){
    let urlEndpoint = `${this._path_serve}/api/items/${request.procesoItemUuid}`
    return this.http.put<Proceso>(urlEndpoint,request);
  }

  eliminarProcesoItems(procesoItemUuid){
    let urlEndpoint = `${this._path_serve}/api/items/${procesoItemUuid}`
    return this.http.delete<Proceso>(urlEndpoint);
  }

  generaProcesoItemsZip(request: any, procesoItemUuid:string){
    let urlEndpoint = `${this._path_serve}/api/items/generar-zip/${procesoItemUuid}`
    return this.http.get<Proceso>(urlEndpoint,request);
  }

}
