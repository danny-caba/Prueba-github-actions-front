import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { InformeRenovacion } from '../interface/informe-renovacion.model';

@Injectable({
  providedIn: 'root'
})
export class InformeRenovacionService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }
  
  registrar(request: InformeRenovacion){
    let urlEndpoint = `${this._path_serve}/api/renovacion/informes`
    return this.http.post<InformeRenovacion>(urlEndpoint,request);
  }

}
