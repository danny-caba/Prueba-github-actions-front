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
export class EstudioService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerEstudio(idPerfil): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/estudios/academicos/${idPerfil}`
    return this.http.get<PerfilInscripcion>(urlEndpoint);
  }

  buscarEstudios(filtro) {
    let urlEndpoint = `${this._path_serve}/api/estudios/academicos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrar(request: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/academicos`
    return this.http.post<PerfilInscripcion>(urlEndpoint,request);
  }

  actualizar(request: any, idRequisito: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/academicos/${idRequisito}`
    return this.http.put<PerfilInscripcion>(urlEndpoint,request);
  }

  evaluarGrado(request: any, idRequisito: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/academicos/${idRequisito}/evaluar`
    return this.http.put<PerfilInscripcion>(urlEndpoint,request);
  }

  eliminar(id: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/academicos/${id}`
    return this.http.delete<PerfilInscripcion>(urlEndpoint);
  }

  actualizarFile(request: any, idRequisito: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/academicos/${idRequisito}/modificar`
    return this.http.put<PerfilInscripcion>(urlEndpoint,request);
  }
}
