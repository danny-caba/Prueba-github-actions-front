import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { Requerimiento, RequerimientoDocumento, RequerimientoDocumentoDetalle, RequerimientoInformeDetalle } from '../interface/requerimiento.model';
import { Pageable } from '../interface/pageable.model';
import { functions } from 'src/helpers/functions';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { RequerimientoInvitacion } from '../interface/requerimientoInvitacion.model';

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
    return this.http.get<Pageable<Requerimiento>>(urlEndpoint, { params }).pipe(
      map(respuesta => {
        const requerimientos = respuesta.content;
        requerimientos.map(req => {
          if (req.supervisora?.tipoDocumento?.codigo === 'DNI') {
            req.nombresApellidos = req.supervisora.nombres +
             ' ' + req.supervisora.apellidoPaterno + 
             ' ' + req.supervisora.apellidoMaterno;
          } else if (req.supervisora?.tipoDocumento?.codigo === 'RUC') {
            req.nombresApellidos = req.supervisora.nombreRazonSocial;
          } else if (req.supervisora?.tipoDocumento?.codigo === 'CARNET_EXTRA') {
            req.nombresApellidos = req.supervisora?.nombres +
             ' ' + req.supervisora?.apellidoPaterno + 
             ' ' + req.supervisora?.apellidoMaterno;
          } else {
            req.nombresApellidos = '';
          }
        });
        respuesta.content = requerimientos;
        return respuesta;
      })
    );
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
    let urlEndpoint = `${this._path_serve}/api/aprobaciones`;
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, {
      params: params,
    });
  }

  obtenerHistorialAprobacion(uuid: string): Observable<any> {
    const url = `${this._path_serve}/api/aprobaciones/${uuid}/historial`;
    return this.http.get<any>(url);
  }

  enviarInvitacion(requerimientoInvitacion: RequerimientoInvitacion): Observable<RequerimientoInvitacion> {
    const url = `${this._path_serve}/api/invitaciones`;
    return this.http.post<RequerimientoInvitacion>(url, requerimientoInvitacion);
  }

  listarDocumentos(filtro: any) {
    let urlEndpoint = `${this._path_serve}/api/requerimientos/documentos`
    let params = functions.obtenerParams(filtro)
    return this.http.get<Pageable<RequerimientoDocumento>>(urlEndpoint, { params }).pipe(
      map(respuesta => {
        const requerimientos = respuesta.content;
        requerimientos.map(req => {
          if (req.requerimiento?.supervisora?.tipoDocumento?.codigo === 'DNI') {
            req.nombresApellidos = req.requerimiento.supervisora.nombres +
             ' ' + req.requerimiento.supervisora.apellidoPaterno + 
             ' ' + req.requerimiento.supervisora.apellidoMaterno;
          } else if (req.requerimiento.supervisora?.tipoDocumento?.codigo === 'RUC') {
            req.nombresApellidos = req.requerimiento.supervisora.nombreRazonSocial;
          } else if (req.requerimiento.supervisora?.tipoDocumento?.codigo === 'CARNET_EXTRA') {
            req.nombresApellidos = req.requerimiento.supervisora?.nombres +
             ' ' + req.requerimiento.supervisora?.apellidoPaterno + 
             ' ' + req.requerimiento.supervisora?.apellidoMaterno;
          } else {
            req.nombresApellidos = '';
          }
        });
        respuesta.content = requerimientos;
        return respuesta;
      })
    );
  }

  obtenerDocumentoDetalle(requerimientoUuid: string) {
    const url = `${this._path_serve}/api/requerimientos/documentos/${requerimientoUuid}/detalle`;
    return this.http.get<RequerimientoDocumentoDetalle[]>(url)
      .pipe(
        map(respuesta => {
          return respuesta.map(res => {
            return {
              ...res,
              requerimientoDocumento: {
                requerimientoDocumentoUuid: requerimientoUuid
              }
            }
          });
        })
      );
  }

  registrarDocumento(requisitos: RequerimientoDocumentoDetalle[]) {
    const url = `${this._path_serve}/api/requerimientos/documentos/detalle`;
    return this.http.post<RequerimientoDocumentoDetalle[]>(url, requisitos);
  }

  listarDocumentosCoordinador(filtro: any) {
    let urlEndpoint = `${this._path_serve}/api/requerimientos/documentos/coordinador`
    let params = functions.obtenerParams(filtro)
    return this.http.get<Pageable<RequerimientoDocumento>>(urlEndpoint, { params }).pipe(
      map(respuesta => {
        const requerimientos = respuesta.content;
        requerimientos.map(req => {
          if (req.requerimiento?.supervisora?.tipoDocumento?.codigo === 'DNI') {
            req.nombresApellidos = req.requerimiento.supervisora.nombres +
            ' ' + req.requerimiento.supervisora.apellidoPaterno + 
            ' ' + req.requerimiento.supervisora.apellidoMaterno;
          } else if (req.requerimiento.supervisora?.tipoDocumento?.codigo === 'RUC') {
            req.nombresApellidos = req.requerimiento.supervisora.nombreRazonSocial;
          } else if (req.requerimiento.supervisora?.tipoDocumento?.codigo === 'CARNET_EXTRA') {
            req.nombresApellidos = req.requerimiento.supervisora?.nombres +
            ' ' + req.requerimiento.supervisora?.apellidoPaterno + 
            ' ' + req.requerimiento.supervisora?.apellidoMaterno;
          } else {
            req.nombresApellidos = '';
          }
        });
        respuesta.content = requerimientos;
        return respuesta;
      })
  );
  }

}
