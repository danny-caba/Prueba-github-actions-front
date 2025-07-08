import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Asignacion, Historial } from '../interface/asignacion';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluadorService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerAsignacion(idAsignacion): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/asignaciones/${idAsignacion}`
    return this.http.get<any>(urlEndpoint);
  }

  buscarEvaluadores(codigoRol) {
    let urlEndpoint = `${this._path_serve}/api/usuarios?codigoRol=${codigoRol}&size=1000`
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint);
  }

  buscarEvaluadoresPerfil(codigoRol, uuidSolicitud, idPerfil) {
    let urlEndpoint = `${this._path_serve}/api/usuarios/por-perfil?codigoRol=${codigoRol}&uuidSolicitud=${uuidSolicitud}&idPerfil=${idPerfil}&size=1000`
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint);
  }

  registrarAsignacion(request: any){
    let urlEndpoint = `${this._path_serve}/api/asignaciones`
    return this.http.post<Pageable<Asignacion>>(urlEndpoint,request);
  }

  registrarAprobador(request: any){
    let urlEndpoint = `${this._path_serve}/api/asignaciones/aprobadores`
    return this.http.post<Asignacion>(urlEndpoint,request);
  }

  modificarAprobador(request: any, idAsignacion: any){
    let urlEndpoint = `${this._path_serve}/api/asignaciones/aprobadores/${idAsignacion}`
    return this.http.put<Asignacion>(urlEndpoint,request);
  }

  eliminarAprobador(id: any){
    let urlEndpoint = `${this._path_serve}/api/asignaciones/aprobadores/${id}`
    return this.http.delete<Asignacion>(urlEndpoint);
  }

  listarAsignacionesAprobadores(filtro){
    let urlEndpoint = `${this._path_serve}/api/asignaciones/aprobaciones`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<Asignacion>>(urlEndpoint,{params:params});
  }


  listarAsignaciones(filtro){
    let urlEndpoint = `${this._path_serve}/api/asignaciones`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<Asignacion>>(urlEndpoint,{params:params});
  }

  evaluarAccion(request: any){
    let urlEndpoint = `${this._path_serve}/api/asignaciones/${request.idAsignacion}`
    return this.http.put<Asignacion>(urlEndpoint,request);
  }

  // Método específico para rechazo por perfil
  rechazarPerfil(idAsignacion: number, idPerfil: number, observacion: string): Observable<{success: boolean, message: string}> {
    const url = `${this._path_serve}/api/asignaciones/${idAsignacion}/rechazar-perfil`;
    return this.http.put<{ success: boolean, message: string }>(url, { 
      idOtroRequisito: idPerfil,
      observacion: observacion
    });
  }

  crearHistorialAsignacionBackend(idAsignacion: number, accion: string, observacion: string): Observable<any> {
    const url = `${this._path_serve}/api/asignaciones/historial`; // Define la URL correcta para crear el historial
    return this.http.post(url, { idAsignacion, accion, observacion });
  }

  obtenerIdsPerfiles(idUsuario: string): Observable<number[]> {
    return this.http.get<number[]>(`${this._path_serve}/api/asignaciones/aprobador/${idUsuario}/perfiles-asignados`);
} 


  obtenerIdArchivo(numeroExpediente) {
    let urlEndpoint = `${this._path_serve}/api/asignaciones/obtenerIdArchivo/${numeroExpediente}`
    return this.http.get<any>(urlEndpoint);
  }

  obtenerParametrosfirmaDigital(usuario) {
    let urlEndpoint = `${this._path_serve}/api/asignaciones/obtenerParametros/firmaDigital`
    let params = functions.obtenerParams(usuario);
    return this.http.get<any>(urlEndpoint, {params:params});
  }

  listarHistorialAprobaciones(filtro: { idContrato: number, tipo: string }) {
    const url = `${this._path_serve}/api/asignaciones/aprobaciones`;
    const params = functions.obtenerParams(filtro);
    return this.http.get<Asignacion>(url, { params });
  }

  obtenerHistorialAsignacion(idContrato: number) {
    return this.http.get<Asignacion[]>(`${this._path_serve}/api/asignaciones/historial/${idContrato}`);
  }
}
