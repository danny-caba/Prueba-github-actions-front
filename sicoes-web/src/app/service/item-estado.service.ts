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
export class ItemEstadoService {
 
  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  listarItemEstado(procesoItemUuid:string){
    let urlEndpoint = `${this._path_serve}/api/itemsEstado/listar?procesoItemUuid=${procesoItemUuid}`;
    return this.http.get<Pageable<any>>(urlEndpoint);
  }

  registrar(request: any){
    let urlEndpoint = `${this._path_serve}/api/itemsEstado`
    return this.http.post<any>(urlEndpoint,request);

  }  
}
