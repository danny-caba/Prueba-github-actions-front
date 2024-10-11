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
export class UsuarioService {

  private solicitudSubject = new BehaviorSubject<Partial<Solicitud>>(null);
  private _path_serve: String;
  private tipoUser: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  setTipoUser(tipoUser: String) {
    this.tipoUser = tipoUser;
  }

  getTipoUser(): String {
    return this.tipoUser;
  }

  obtenerMenu(): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/usuarios/menu`
    return this.http.get<any>(urlEndpoint);
  }

  validarEmail(correo: string){
    let urlEndpoint = `${this._path_serve}/api/usuarios/publico/enviar-codigo-validacion`
    let req = {
      correo: correo,
      codigoTipo:'CONTRASENIA'
    }
    return this.http.post<any>(urlEndpoint, req);
  }

  validarCodigoEmail(codigo: string){
    let urlEndpoint = `${this._path_serve}/api/usuarios/publico/validar-codigo-validacion`
    let req = {
      codigo: codigo
    }
    return this.http.post<any>(urlEndpoint, req);
  }

  registrar(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/publico`
    return this.http.post<any>(urlEndpoint,request);
  }

  obtenerCorreo(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/publico/obtener-correo?idPais=${request.pais.idListadoDetalle}&idTipoDocumento=${request.tipoDocumento.idListadoDetalle}&nroDocumento=${request.codigoRuc}`
    return this.http.get<any>(urlEndpoint);
  }

  recuperarContrasenia(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/publico/recuperar-contrasenia`
    return this.http.post<any>(urlEndpoint,request);
  }

  cambiarContrasenia(request: any){
    let urlEndpoint = `${this._path_serve}/api/usuarios/publico/cambiar-contrasenia`
    return this.http.post<any>(urlEndpoint,request);
  }

  validarTipoPersona(){
    let urlEndpoint = `${this._path_serve}/api/usuarios/tipo-negocio`
    return this.http.get<any>(urlEndpoint);
  }

}
