import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { Requerimiento, RequerimientoInformeDetalle } from '../interface/requerimiento.model';
import { Pageable } from '../interface/pageable.model';
import { functions } from 'src/helpers/functions';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequerimientoService {

  private _path_serve: string;
  private requerimientoSubject = new BehaviorSubject<Requerimiento | null>(null);
  public requerimiento$ = this.requerimientoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  setRequerimiento(requerimiento: Requerimiento) {
    this.requerimientoSubject.next(requerimiento);
  }

  getRequerimiento(): Requerimiento | null {
    return this.requerimientoSubject.value;
  }

  clearRequerimiento() {
    this.requerimientoSubject.next(null);
  }

  listarRequerimientos(filtro: any) {
    let urlEndpoint = `${this._path_serve}/api/requerimientos`
    let params = functions.obtenerParams(filtro)
    return this.http.get<Pageable<Requerimiento>>(urlEndpoint, { params });
  }

  registrar(requerimiento: Requerimiento) {
    let urlEndpoint = `${this._path_serve}/api/requerimientos`
    return this.http.post<Requerimiento>(urlEndpoint, requerimiento);
  }

  archivar(requerimientoUuid: string, observacion: any) {
    let urlEndpoint = `${this._path_serve}/api/requerimientos/${requerimientoUuid}/archivar`
    return this.http.patch<Requerimiento>(urlEndpoint, observacion);
  }

  enviarInforme(requerimientoInformeDetalle: RequerimientoInformeDetalle) {
    let urlEndpoint = `${this._path_serve}/api/informes`
    return this.http.post<any>(urlEndpoint, requerimientoInformeDetalle);
  }

  listarInvitaciones(filtro: any) {
    let urlEndpoint = `${this._path_serve}/api/invitaciones`
    let params = functions.obtenerParams(filtro)
    return this.http.get<Pageable<Requerimiento>>(urlEndpoint, { params });
  }

  listarRequerimientosAprobaciones(filtro) {
    let urlEndpoint = `${this._path_serve}/api/requerimientos`;
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, {
      params: params,
    });
  }

  obtenerHistorialAprobacion(uuid: string): Observable<any> {
    const url = `${this._path_serve}/api/aprobaciones/${uuid}/historial`;
    return this.http.get<any>(url);
  }

}
