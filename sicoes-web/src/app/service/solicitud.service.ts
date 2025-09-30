import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { InformeAprobacionResponse } from '../interface/informe-aprobacion.model';

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

  // DEPRECATED: Usar buscarBandejaAprobacionesInformesRenovacion en su lugar
  // Este endpoint ya no debe ser utilizado: /api/renovacion/informes
  // buscarInformesRenovacionAprobador(filtroInformeRenovacion): Observable<any> {
  //   const urlEndpoint = `${this._path_serve}/api/renovacion/informes`
  //   let params = functions.obtenerParams(filtroInformeRenovacion);
  //   
  //   // Parámetros requeridos según el nuevo endpoint
  //   if (filtroInformeRenovacion.page !== undefined) {
  //     params = params.set('page', filtroInformeRenovacion.page.toString());
  //   }
  //   if (filtroInformeRenovacion.size !== undefined) {
  //     params = params.set('size', filtroInformeRenovacion.size.toString());
  //   }
  //   if (filtroInformeRenovacion.nroExpediente) {
  //     params = params.set('numeroExpediente', filtroInformeRenovacion.nroExpediente);
  //   }
  //   if (filtroInformeRenovacion.idEstadoAprobacion) {
  //     params = params.set('estado', filtroInformeRenovacion.idEstadoAprobacion.toString());
  //   }
  //   if (filtroInformeRenovacion.idContratista) {
  //     params = params.set('idContratista', filtroInformeRenovacion.idContratista.toString());
  //   }
  //   
  //   // Filtrado por grupo usando el campo grupoLd del response
  //   // Este filtrado se hará en el componente después de recibir los datos
  //   
  //   return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  // }

  private obtenerTipoAprobador(grupoUsuario?: number): string {
    switch (grupoUsuario) {
      case 1:
        return 'G1';
      case 2:
        return 'G2';
      case 3:
      default:
        return 'G3'; // Por defecto G3 (anteriormente GRUPO_3)
    }
  }

  buscarHistorialAprobacionesInformesRenovacion(filtroInformeRenovacion): Observable<any> {

    const urlEndpoint = `${this._path_serve}/api/informe/renovacion/historial-aprobaciones`
    let params = functions.obtenerParams(filtroInformeRenovacion);

    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }

  buscarInformesRenovacionParaAprobar(filtroInformeRenovacion): Observable<Pageable<InformeAprobacionResponse>> {
    const urlEndpoint = `${this._path_serve}/api/informe/renovacion/aprobar/buscar`
    let params = functions.obtenerParams(filtroInformeRenovacion);
    
    if (filtroInformeRenovacion.nroExpediente) {
      params = params.set('numeroExpediente', filtroInformeRenovacion.nroExpediente);
    }
    if (filtroInformeRenovacion.empresaSupervisora) {
      params = params.set('razSocialSupervisora', filtroInformeRenovacion.empresaSupervisora);
    }
    if (filtroInformeRenovacion.idTipoInforme) {
      params = params.set('nombreItem', filtroInformeRenovacion.idTipoInforme.toString());
    }
    if (filtroInformeRenovacion.idEstadoEvaluacion) {
      params = params.set('estadoInforme', filtroInformeRenovacion.idEstadoEvaluacion.toString());
    }
    
    return this.http.get<Pageable<InformeAprobacionResponse>>(urlEndpoint, { params: params });
  }

  buscarInformesRenovacionNuevoEndpoint(filtroInformeRenovacion): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/informe/renovacion/informes`
    let params = functions.obtenerParams(filtroInformeRenovacion);
    
    if (filtroInformeRenovacion.nroExpediente) {
      params = params.set('numeroExpediente', filtroInformeRenovacion.nroExpediente);
    }
    if (filtroInformeRenovacion.empresaSupervisora) {
      params = params.set('empresaSupervisora', filtroInformeRenovacion.empresaSupervisora);
    }
    if (filtroInformeRenovacion.idTipoInforme) {
      params = params.set('tipoInforme', filtroInformeRenovacion.idTipoInforme.toString());
    }
    if (filtroInformeRenovacion.idEstadoEvaluacion) {
      params = params.set('estadoEvaluacion', filtroInformeRenovacion.idEstadoEvaluacion.toString());
    }
    
    return this.http.get<any>(urlEndpoint, { params: params });
  }

  descargarAdjuntoInformeRenovacion(uuid: string, nombreArchivo?: string): Observable<Blob> {
    const urlEndpoint = `${this._path_serve}/informe/renovacion/adjunto/descargar`;
    let params = functions.obtenerParams({ uuid: uuid });
    if (nombreArchivo) {
      params = params.set('nombreArchivo', nombreArchivo);
    }
    
    return this.http.get(urlEndpoint, { 
      params: params,
      responseType: 'blob'
    });
  }

  buscarInformesRenovacionGSE(filtroInformeRenovacion): Observable<any> {
    const urlEndpoint = `${this._path_serve}/informe/renovacion/aprobar/buscar`
    let params = functions.obtenerParams(filtroInformeRenovacion);
    
    if (filtroInformeRenovacion.nroExpediente) {
      params = params.set('numeroExpediente', filtroInformeRenovacion.nroExpediente);
    }
    if (filtroInformeRenovacion.tipoSector) {
      params = params.set('tipoSector', filtroInformeRenovacion.tipoSector);
    }
    if (filtroInformeRenovacion.tipoSubSector) {
      params = params.set('tipoSubSector', filtroInformeRenovacion.tipoSubSector);
    }
    if (filtroInformeRenovacion.nombreItem) {
      params = params.set('nombreItem', filtroInformeRenovacion.nombreItem);
    }
    if (filtroInformeRenovacion.razSocialSupervisora) {
      params = params.set('razSocialSupervisora', filtroInformeRenovacion.razSocialSupervisora);
    }
    if (filtroInformeRenovacion.estadoInforme) {
      params = params.set('estadoInforme', filtroInformeRenovacion.estadoInforme.toString());
    }
    if (filtroInformeRenovacion.grupoAprobador) {
      params = params.set('grupoAprobador', filtroInformeRenovacion.grupoAprobador.toString());
    }
    
    return this.http.get<any>(urlEndpoint, { params: params });
  }

  buscarBandejaAprobacionesInformesRenovacion(filtroInformeRenovacion): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/renovacion/bandeja/aprobaciones`;
    
    console.log('Servicio: Filtro recibido:', filtroInformeRenovacion);
    
    // Construir parámetros manualmente para evitar conflictos
    let params = new HttpParams();
    
    // Parámetros requeridos según el endpoint
    if (filtroInformeRenovacion.page !== undefined) {
      params = params.set('page', filtroInformeRenovacion.page.toString());
    }
    if (filtroInformeRenovacion.size !== undefined) {
      params = params.set('size', filtroInformeRenovacion.size.toString());
    }
    if (filtroInformeRenovacion.nroExpediente) {
      params = params.set('numeroExpediente', filtroInformeRenovacion.nroExpediente);
    }
    if (filtroInformeRenovacion.idEstadoAprobacion) {
      params = params.set('estadoAprobacionInforme', filtroInformeRenovacion.idEstadoAprobacion.toString());
      console.log('Servicio: Estado Aprobación enviado al backend:', filtroInformeRenovacion.idEstadoAprobacion);
      console.log('Servicio: Parámetro estadoAprobacionInforme configurado:', filtroInformeRenovacion.idEstadoAprobacion.toString());
    }
    if (filtroInformeRenovacion.idContratista) {
      params = params.set('idContratista', filtroInformeRenovacion.idContratista.toString());
    }
    if (filtroInformeRenovacion.nombreContratista) {
      params = params.set('nombreContratista', filtroInformeRenovacion.nombreContratista);
    }
    if (filtroInformeRenovacion.grupoUsuario !== undefined) {
      params = params.set('grupoUsuario', filtroInformeRenovacion.grupoUsuario.toString());
      console.log('Servicio: grupoUsuario enviado al backend:', filtroInformeRenovacion.grupoUsuario);
    }
    
    console.log('Servicio: URL final:', urlEndpoint, 'Params:', params.toString());
    return this.http.get<any>(urlEndpoint, { params: params });
  }

  aprobarInformesRenovacionBandeja(request: { idRequerimientosAprobacion: number[], observacion: string }): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/renovacion/bandeja/aprobar-informe-renovacion`;
    console.log('Servicio: Llamando a URL:', urlEndpoint);
    console.log('Servicio: Con request:', request);
    return this.http.post<any>(urlEndpoint, request);
  }

  /**
   * Obtiene el tipo de aprobador del usuario actual desde el backend (G1, G2, G3, etc.)
   */
  obtenerTipoAprobadorBackend(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/renovacion/bandeja/tipo-aprobador`;
    console.log('Servicio: Obteniendo tipo de aprobador desde:', urlEndpoint);
    return this.http.get<any>(urlEndpoint);
  }


}
