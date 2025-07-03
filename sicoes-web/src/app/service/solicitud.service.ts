import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private solicitudSubject = new BehaviorSubject<Partial<Solicitud>>(null);
  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  suscribeSolicitud(): Observable<Partial<Solicitud>> {
    return this.solicitudSubject.asObservable();
  }

  setSolicitud(solicitud: Solicitud){
    this.solicitudSubject.next(solicitud);
  }

  clearSolicitud(){
    this.solicitudSubject.next(null);
  }

  obtenerSolicitud(solicitudUuid): Observable<Solicitud> {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/${solicitudUuid}`
    return this.http.get<Solicitud>(urlEndpoint);
  }

  subSectorUsuario(solicitudUuid): Observable<Solicitud> {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/${solicitudUuid}/subsector-usuario`
    return this.http.get<Solicitud>(urlEndpoint);
  }

  buscarSolicitudes(filtro) {
    let urlEndpoint = `${this._path_serve}/api/solicitudes`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  buscarSolicitudesAprobador(filtro) {
    let urlEndpoint = `${this._path_serve}/api/solicitudes/aprobador`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

   buscarSolicitudesAprobadorPerfeccionamiento(filtroPerfeccionamiento): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/contratos/listar`
    let params = functions.obtenerParams(filtroPerfeccionamiento);
    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }
  
  buscarSolicitudesResponsable(filtro) {
    let urlEndpoint = `${this._path_serve}/api/solicitudes/responsable`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  buscarSolicitudesEvaluador(filtro) {
    let urlEndpoint = `${this._path_serve}/api/solicitudes/evaluador`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrarBorradorPN(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes`
    return this.http.post<Solicitud>(urlEndpoint,request);
  }
  
  enviarSolicitudPN(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}/enviar`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  actualizarBorradorPN(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  registrarBorradorPJ(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes`
    return this.http.post<Solicitud>(urlEndpoint,request);
  }

  registrarObservacionAdm(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}/observacionesAdm`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  registrarObservacionTec(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}/observacionesTec`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  registrarResultadoAdmin(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}/resultado`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  expedienteDocumento(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}/expediente-siged`
    return this.http.get<any[]>(urlEndpoint,request);
  }

  finalizarAdminitrativa(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}/finalizar-administrativo`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  finalizarTecnica(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${request.solicitudUuid}/finalizar-tecnico`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  obtenerUltimaSolicitud(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/ultimaSolicitudUsuario`
    return this.http.get<any>(urlEndpoint);
  }

  copiarDocumentosUltimaSolicitud(solicitudUuidUltima: any, solicitudUuid: any, request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/copiar/${solicitudUuidUltima}/${solicitudUuid}`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }
  anularSolicitud(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/anular/${request.idSolicitud}`
    return this.http.put<Solicitud>(urlEndpoint, request);
  }

  cancelarSolicitud(solicitudUuid : any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/cancelar/${solicitudUuid}`
    return this.http.put<Solicitud>(urlEndpoint, null);
  }

  actualizarSolicitudConcluido(request: any){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/actualizar/${request.solicitudUuid}`
    return this.http.put<Solicitud>(urlEndpoint,request);
  }

  modificarSolicitud(solicitudUuid: String){
    let urlEndpoint = `${this._path_serve}/api/solicitudes/modificar/${solicitudUuid}`
    return this.http.put<Solicitud>(urlEndpoint, null);
  }


}
