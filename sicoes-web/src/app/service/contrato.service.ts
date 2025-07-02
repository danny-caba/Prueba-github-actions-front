import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { Observable } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { Pageable } from '../interface/pageable.model';
import { tap, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContratoDetalle } from '../interface/contrato.model';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerSolicitudPorId(idSolicitud: number) {
    let urlEndpoint = `${this._path_serve}/api/solicitudes/${idSolicitud}/proceso`
    return this.http.get<any>(urlEndpoint);
  }

  obtenerSolicitudesExterno(filtro): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/presentacion`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }

  obtenerSolicitudesInterno(filtro): Observable<any> {
    // const estado = '2';
    const urlEndpoint = `${this._path_serve}/api/solicitudes/proceso`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }

  obtenerContratos(filtro): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/contratos/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, { params: params });
  }

  registrarPerfeccionamiento(idSolicitud: number, tipoContratoSeleccionado: number, request: any) {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/${idSolicitud}/${tipoContratoSeleccionado}/registrar`
    return this.http.put<any>(urlEndpoint, request);
  }

  validarFechaPresentacion(idSolicitud: number) {
    const urlEndpoint = `${this._path_serve}/api/solicitud/${idSolicitud}/validar-fecha-presentacion`
    return this.http.get<any>(urlEndpoint);
  }

  finalizarEvaluacion(idSolicitud: number, request: any) {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/${idSolicitud}/finalizar`
    return this.http.put<any>(urlEndpoint, request);
  }

  enviarCorreoSancion(idSolicitud: number, request: any) {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/${idSolicitud}/enviar-correo-sancion`
    return this.http.post<any>(urlEndpoint, request);
  }

  enviarCorreoSancionPN(request: any, ruc) {
    const urlEndpoint = `${this._path_serve}/api/solicitudes/enviar-correo-sancion-pn/${ruc}`
    return this.http.post<any>(urlEndpoint, request);
  }

  validarSancionVigenteV2(ruc): Observable<any> {
    let params = functions.obtenerParams(ruc);
    return this.http.get<any>(`${this._path_serve}/api/solicitudes/sancion-vigente/V2`, { params: params });
  }

  validarRemype(numeroDocumento: number) {
    let urlEndpoint = `${this._path_serve}/api/solicitud/validar-remype/${numeroDocumento}`
    return this.http.get<any>(urlEndpoint);
  }

  obtenerContratoDetallePorId(idContrato: number): Observable<ContratoDetalle> {
    const urlEndpoint = `${this._path_serve}/api/contratos/${idContrato}`;
    return this.http.get<ContratoDetalle>(urlEndpoint);
  }

  actualizarContratoDetalle(contrato: ContratoDetalle): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/contratos/${contrato.idContrato}`;
    return this.http.put<any>(urlEndpoint, contrato);
  }

  aprobarPerfeccionamientosMasivo(request: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/contratos/acciones-masivas`;
    return this.http.post<any>(urlEndpoint, request);
  }

}
