import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Solicitud, SolicitudListado } from '../interface/solicitud.model';
import { Proceso, ResponseUsuario, Usuario } from '../interface/proceso.model';

@Injectable({
  providedIn: 'root'
})
export class GestionUsuarioService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }
  obtenerUsuarios(offset: number, pageSize: number,nombreUsuario:string): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/usuarios/listar-bandeja-usuarios`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('pageSize', pageSize.toString())
      .set('nombreUsuario',nombreUsuario)

    return this.http.get<any>(urlEndpoint, { params });
  }

  obtenerUsuariosSIGED(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/usuarios/listar-usuarios-siged`;
    return this.http.get<any>(urlEndpoint);
  }

  buscarProcesosEtapa(filtro) {
    let urlEndpoint = `${this._path_serve}/api/etapas/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }

  registrarUsuario(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/registrar-usuario`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }

  editarUsuario(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/modificar-usuario`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }

  listarRoles(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/usuarios/listar-roles`;
    return this.http.get<any>(urlEndpoint);
  }

  listarPerfiles(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/listado-publico/PERFILES`;
    return this.http.get<any>(urlEndpoint);
  }


  listarDivisiones(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/confbandejas/obtener-divisiones`;
    return this.http.get<any>(urlEndpoint);
  }

  asignarRolUsuario(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/registrar-usuario-rol`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }

  obtenerRolUsuarios(offset: number, pageSize: number,idUsuario:number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/usuarios/listar-bandeja-usuario-rol`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('pageSize', pageSize.toString())
      .set('idUsuario',idUsuario)

    return this.http.get<any>(urlEndpoint, { params });
  }

  actualizarEstadoUsuario(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/actualizar-estado-usuario`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }

  actualizarEstadoRolUsuario(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/actualizar-estado-usuario-rol`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }


  actualizarEstadoPerfilUsuario(request: any){
    let urlEndpoint = `${this._path_serve}/api/confbandejas/actualizar-estado-config-bandeja`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }

  asignarPerfilRolUsuario(request: any){
    let urlEndpoint = `${this._path_serve}/api/confbandejas/registrar-config-bandeja`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }

  obtenerPerfiles(offset: number, pageSize: number,idUsuario:number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/confbandejas/listar-perfiles`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('idUsuario',idUsuario)
      .set('offset', offset.toString())
      .set('pageSize', pageSize.toString())
    return this.http.get<any>(urlEndpoint, { params });
  }

  obtenerPerfilRolUsuarios(offset: number, pageSize: number,idUsuario:number, idRol: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/confbandejas/listar-config-bandeja`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('idUsuario',idUsuario)
      .set('idRol',idRol)
      .set('offset', offset.toString())
      .set('pageSize', pageSize.toString())
    return this.http.get<any>(urlEndpoint, { params });
  }

  obtenerListaReasignacion(idUsuario: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/confbandejas/listar-config-reasignadas`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('idUsuario',idUsuario)
    return this.http.get<any>(urlEndpoint, { params });
  }

  registrarUsuarioReasignacion(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/registrar-usuario-reasignacion`
    return this.http.post<ResponseUsuario>(urlEndpoint,request);
  }

  listarHistorialReasignaciones(offset: number, pageSize: number): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/confbandejas/listar-historial-reasignaciones`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('pageSize', pageSize.toString())

    return this.http.get<any>(urlEndpoint, { params });
  }

  filtroHistorialReasignaciones(offset: number, pageSize: number,nombreUsuario:string,fechaInicio:string,fechaFin:string,idDivision:string): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/confbandejas/listar-historial-reasignaciones`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('pageSize', pageSize.toString())
      .set('nombreUsuario',nombreUsuario)
      .set('fechaInicio',fechaInicio)
      .set('fechaFin',fechaFin)
      .set('idDivision',idDivision)

    return this.http.get<any>(urlEndpoint, { params });
  }

  obtenerUsuariosXCodigoRol(idUsuario: number,codigoRol:string): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/usuarios/listar-usuarios-codigo-rol`;

    // Construir los parámetros de la URL
    const params = new HttpParams()
      .set('idUsuario', idUsuario)
      .set('codigoRol',codigoRol)

    return this.http.get<any>(urlEndpoint, { params });
  }

  listarPerfilesDetalle(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/listado-publico/perfiles/detalle`;
    return this.http.get<any>(urlEndpoint);
  }

  listarPerfilesPorDivisionDetalle(idDivision: number): Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-publico/perfiles/division/${idDivision}/detalle`;
    return this.http.get<any>(urlEndpoint);
  }
  
}
