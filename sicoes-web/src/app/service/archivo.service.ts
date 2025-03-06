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

}
