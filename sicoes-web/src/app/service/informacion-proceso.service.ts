import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { functions } from 'src/helpers/functions';

@Injectable({
  providedIn: 'root'
})
export class InformacionProcesoService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  listarInfoProceso(idProceso) {
    let urlEndpoint = `${this._path_serve}/api/proceso-documento/listar?idProceso=${idProceso}`
    return this.http.get<any>(urlEndpoint);
  }
  eliminarInfoProceso(idProceso) {
    let urlEndpoint = `${this._path_serve}/api/proceso-documento/${idProceso}`
    return this.http.delete<any>(urlEndpoint);
  }

  guardarInfoProceso(formData) {
    let urlEndpoint = `${this._path_serve}/api/proceso-documento`
    return this.http.post<any>(urlEndpoint,formData);
  }
}
