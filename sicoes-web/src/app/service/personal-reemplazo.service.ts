import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services';
import { PersonalReemplazo } from '../interface/reemplazo-personal.model';
import { Pageable } from '../interface/pageable.model';
import { SeccionReemplazoPersonal } from '../interface/seccion.model';
import { functions } from 'src/helpers/functions';

@Injectable({
  providedIn: 'root'
})
export class PersonalReemplazoService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  listarPersonalReemplazo(idSolicitud: number): Observable<any> {
    const params = new HttpParams()
    .set('page', '0')
    .set('size', '10');

    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/solicitud/obtener/${idSolicitud}`;
    return this.http.get<Pageable<any>>(urlEndpoint, { params });
  }

  eliminarPersonalReemplazo(idReemplazo: number) {
    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/solicitud/${idReemplazo}`
    this.http.delete(urlEndpoint);
  }

  listarSeccionesPersonalReemplazo(): Observable<SeccionReemplazoPersonal[]> {
    const urlEndpoint = `${this._path_serve}/api/listado/SECCIONES_REEMPLAZO_PERSONAL`
    return this.http.get<SeccionReemplazoPersonal[]>(urlEndpoint);
  }



}
