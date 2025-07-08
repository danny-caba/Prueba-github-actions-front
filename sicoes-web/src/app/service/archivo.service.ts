import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerArchivoPorProceso(idProceso): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/archivos/procesos/${idProceso}`
    return this.http.get<any>(urlEndpoint);
  }

  getPersonalPropuesto(idSolicitud: number): Observable<any[]> {
    return this.http.get<any[]>(`${this._path_serve}/api/solicitud/${idSolicitud}/personal-propuesto`);
  }

  listarAdicionales(idContrato: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/contratos/${idContrato}/archivos`);
  }

  subirAdicional(idContrato: number, tipoRequisito: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoRequisito', tipoRequisito);
    return this.http.post<any>(`/api/contratos/${idContrato}/archivos`, formData);
  }

  descargarArchivo(idArchivo: number): Observable<Blob> {
    return this.http.get(`/api/contratos/0/archivos/${idArchivo}/descargar`, { responseType: 'blob' });
  }

  eliminarArchivo(idArchivo: number): Observable<void> {
    return this.http.delete<void>(`/api/contratos/0/archivos/${idArchivo}`);
  }

}
