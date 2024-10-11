import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { Proceso } from '../interface/proceso.model';
import { Propuesta, PropuestaProfesional, PropuestaTecnica } from '../interface/propuesta.model';

@Injectable({
  providedIn: 'root'
})
export class PropuestaService {

  private propuestaSubject = new BehaviorSubject<Partial<any>>(null);
  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  suscribePropuesta(): Observable<Partial<any>> {
    return this.propuestaSubject.asObservable();
  }

  setPropuesta(solicitud: any){
    this.propuestaSubject.next(solicitud);
  }

  clearPropuesta(){
    this.propuestaSubject.next(null);
  }

  obtenerPropuesta(propuestaUuid): Observable<Proceso> {
    const urlEndpoint = `${this._path_serve}/api/propuestas/${propuestaUuid}`
    return this.http.get<Proceso>(urlEndpoint);
  }

  /* listarPerfiles(filtro) {
    let urlEndpoint = `${this._path_serve}/api/itemPerfiles/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  } */

  buscarInvitacionesProfesionales(filtro,propuestaUuid) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales/listar/${propuestaUuid}`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, { params: params });
  }

  buscarInvitacionesProfesionalesAceptados(filtro,propuestaUuid) {
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales/aceptados/${propuestaUuid}`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, { params: params });
  }

  buscarArchivosPropuesta(filtro) {
    let urlEndpoint = `${this._path_serve}/api/archivos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, { params: params });
  }

  buscarArchivosPropuestaEconomica(filtro) {
    let urlEndpoint = `${this._path_serve}/api/archivos/propuestaEconomica`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, { params: params });
  }

  buscarArchivosPropuestaTecnica(filtro) {
    let urlEndpoint = `${this._path_serve}/api/archivos/propuestaTecnica`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint, { params: params });
  }

  registrarPropuesta(request: any){
    let urlEndpoint = `${this._path_serve}/api/propuestas`
    return this.http.post<Propuesta>(urlEndpoint,request);
  }
  
  guardarPropuestaEconomica(request: any, idPropuestaEconomica:number){
    let urlEndpoint = `${this._path_serve}/api/propuestasEconomicas/${idPropuestaEconomica}?propuestaUuid=${request.propuestaUuid}`
    return this.http.put<PropuestaTecnica>(urlEndpoint,request);
  }

  presentarPropuesta(request: any,propuestaUuid:string){
    let urlEndpoint = `${this._path_serve}/api/propuestas/${propuestaUuid}/presentar`
    return this.http.put<Propuesta>(urlEndpoint,request);
  }

  listarInvitaciones(request: any){
    let urlEndpoint = `${this._path_serve}/api/propuestasProfesionales`
    return this.http.get<Pageable<PropuestaProfesional>>(urlEndpoint,request);
  }

  listarPostulantes(procesoItemUuid:string){
    let urlEndpoint = `${this._path_serve}/api/propuestas/item/${procesoItemUuid}`;
    return this.http.get<Pageable<Propuesta>>(urlEndpoint);
  }

  seleccionarGanador(request: any, propuestaUuid: string){
    let urlEndpoint = `${this._path_serve}/api/propuestas/${propuestaUuid}/seleccionar`
    return this.http.put<Propuesta>(urlEndpoint,request);
  }

  generarPropuetaZip(request: any,propuestaUuid:string){
    let urlEndpoint = `${this._path_serve}/api/propuestas/generar-zip/${propuestaUuid}`
    return this.http.get<Propuesta>(urlEndpoint,request);
  }

  validaPropuesta(propuestaUuid:string){
    let urlEndpoint = `${this._path_serve}/api/propuestas/validaciones/${propuestaUuid}`
    return this.http.get<any[]>(urlEndpoint);
  }
}
