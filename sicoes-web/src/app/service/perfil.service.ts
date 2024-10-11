import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { PerfilInscripcion } from '../interface/perfil-insripcion.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerPerfil(idPerfil): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/requisitos/perfil/${idPerfil}`
    return this.http.get<PerfilInscripcion>(urlEndpoint);
  }

  buscarPerfiles(filtro) {
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<PerfilInscripcion>>(urlEndpoint,{params:params});
  }

  registrar(request: any){
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil`
    return this.http.post<PerfilInscripcion>(urlEndpoint,request);
  }

  actualizar(request: any){
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil/${request.idOtroRequisito}`
    return this.http.put<PerfilInscripcion>(urlEndpoint,request);
  }

  eliminar(id: any){
    let urlEndpoint = `${this._path_serve}/api/requisitos/${id}`
    return this.http.delete<PerfilInscripcion>(urlEndpoint);
  }

  evaluarPerfil(request: any){
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil/${request.idOtroRequisito}/evaluar`
    return this.http.put<PerfilInscripcion>(urlEndpoint,request);
  }

  asignarEvaluadorPerfil(request: any, idOtroRequisito: number) {
    let urlEndpoint = `${this._path_serve}/api/requisitos/asignarEvaluadorPerfil/${idOtroRequisito}`;
    return this.http.put<PerfilInscripcion>(urlEndpoint, request);
  }

  aprobarRevertirEvaluacion(request: any) {
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil/${request.idOtroRequisito}/revertir/aprobar`
    return this.http.put<PerfilInscripcion>(urlEndpoint,request);
  }

  rechazarRevertirEvaluacion(request: any) {
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil/${request.idOtroRequisito}/revertir/rechazar`
    return this.http.put<PerfilInscripcion>(urlEndpoint,request);
  }

  modificarEvaluadorPerfil(request: any, idOtroRequisito: number) {
    let urlEndpoint = `${this._path_serve}/api/requisitos/modificarEvaluadorPerfil/${idOtroRequisito}`;
    return this.http.put<PerfilInscripcion>(urlEndpoint, request);
  }
}
