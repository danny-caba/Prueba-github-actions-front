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
    .set('size', '100');

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

  listarSupervisoraPerfil(idSolicitud: number): Observable<any> {
    const params = new HttpParams()
    .set('idSolicitud', idSolicitud)
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

  listarSupervisoraApto(idPerfil: number): Observable<any> {
    const params = new HttpParams()
    .set('idPerfil', idPerfil)
    .set('page', '0')
    .set('size', '10');

    const urlEndpoint = `${this._path_serve}/api/supervisora-perfiles/profesionales/propuesto/reemplazo`;
    return this.http.get<Pageable<any>>(urlEndpoint, { params });
  }

  adjuntarArchivo(formData: any): Observable<any> {
    return this.http.post<any>(`${this._path_serve}/api/documentosreemplazo`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  eliminarAdjunto(idDocumento: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/documentosreemplazo/${idDocumento}`;
    return this.http.delete<any>(urlEndpoint);
  }

  guardarPersonalPropuesto(data: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/solicitud/propuesta/inserta/propuesto`;    
    return this.http.put<any>(urlEndpoint, data);
  }

  eliminarPersonalPropuesto(data: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/solicitud/propuesta/elimina/propuesto`;    
    return this.http.put<any>(urlEndpoint, data);
  }

  listarDocsReemplazo(idReemplazo: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/documentosreemplazo`;
    const params = new HttpParams()
    .set('idReemplazo', idReemplazo)
    .set('page', '0')
    .set('size', '100');

    return this.http.get<Pageable<any>>(urlEndpoint, { params });
  }

  registrarReemplazo(data: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/externo/reemplazo/inserta`;
    return this.http.put<Pageable<any>>(urlEndpoint, data);
  }

  obtenerPersonalReemplazo(idReemplazo: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/reemplazo/${idReemplazo}`;
    return this.http.get<any>(urlEndpoint);
  }

  grabaConformidad(data: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/reemplazo/solicitud/propuesto/revisa`;
    
    return this.http.post<any>(urlEndpoint, data);
  }

  guardarRevDocumentos(data: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/reemplazo/solicitud/registra/propuesto/revision`;
    
    return this.http.post<any>(urlEndpoint, data);
  }

  registrarObservaciones(data: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/reemplazo/solicitud/propuesto/observaciones`;
    
    return this.http.post<any>(urlEndpoint, data);
  }

  updateFechaDesvinculacion(idReemplazo: string, fecha: string): Observable<any> {
    const params = new HttpParams()
      .set('id', Number(idReemplazo))
      .set('fecha', fecha); 
    
    const urlEndpoint = `${this._path_serve}/api/interno/reemplazo/solicitud/propuesto/evalua/fecha`;
    
    return this.http.put<any>(urlEndpoint, null, { params });
  }

  registrarAprobacionRechazo(accion: string, conforme: boolean, data: any): Observable<any> {
    const params = new HttpParams()
      .set('accion', accion)
      .set('conforme', conforme); 

    const urlEndpoint = `${this._path_serve}/api/interno/reemplazo/solicitud/propuesto`;
    
    return this.http.put<any>(urlEndpoint, data, { params });
  }
}
