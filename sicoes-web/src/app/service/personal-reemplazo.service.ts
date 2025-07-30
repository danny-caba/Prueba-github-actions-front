import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services';
import { PersonalReemplazo } from '../interface/reemplazo-personal.model';
import { Pageable } from '../interface/pageable.model';
import { SeccionReemplazoPersonal } from '../interface/seccion.model';
import { functions } from 'src/helpers/functions';
import { id } from 'date-fns/locale';

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

  eliminarPersonalReemplazo(idReemplazo: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/solicitud/${idReemplazo}`
    return this.http.delete(urlEndpoint);
  }

  listarSeccionesPersonalReemplazo(): Observable<SeccionReemplazoPersonal[]> {
    const urlEndpoint = `${this._path_serve}/api/listado/SECCIONES_REEMPLAZO_PERSONAL`
    return this.http.get<SeccionReemplazoPersonal[]>(urlEndpoint);
  }

  listarSupervisoraPerfil(idPropuesta: number): Observable<any> {
    const params = new HttpParams()
    .set('idPropuesta', idPropuesta)
    .set('page', '0')
    .set('size', '10');

    const urlEndpoint = `${this._path_serve}/api/supervisora-perfiles/profesionales/propuesto/baja`;
    return this.http.get<Pageable<any>>(urlEndpoint, { params });
  }

  guardarBajaPersonal(personalBaja: Partial<PersonalReemplazo>): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/solicitud/baja/inserta/propuesto`;
    
    return this.http.post<any>(urlEndpoint, personalBaja);
  }

  eliminarBajaPersonal(idReemplazo: number, idSolicitud: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/solicitud/baja/elimina/propuesto`;
    const body = {
      idReemplazo: idReemplazo,
      idSolicitud: idSolicitud
    };
    
    return this.http.put<any>(urlEndpoint, body);
  }





}
