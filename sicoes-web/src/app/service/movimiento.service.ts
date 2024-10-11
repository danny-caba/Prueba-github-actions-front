import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  buscarMovimientos(filtro) {
    let urlEndpoint = `${this._path_serve}/api/supervisora-perfiles/profesionales`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint,{params:params});
  }

  buscarHistorial(idSupervisora,filtro) {
    let urlEndpoint = `${this._path_serve}/api/movimientos/${idSupervisora}/historial`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint,{params:params});
  }

  registrarMovimiento(movimiento) {
    let urlEndpoint = `${this._path_serve}/api/movimientos`
    return this.http.post<any>(urlEndpoint,movimiento);
  }

}
