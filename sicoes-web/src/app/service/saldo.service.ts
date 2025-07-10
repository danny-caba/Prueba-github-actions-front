import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { functions } from 'src/helpers/functions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerSaldoSupervisora(idSupervisora: number) {
    let urlEndpoint = `${this._path_serve}/api/saldos/supervisora`
    let params = new HttpParams();
    params = functions.paramsAdd(params, 'idSupervisora', idSupervisora);
    return this.http.get<any>(urlEndpoint, { params }).pipe(
      map(respuesta => {
        if (respuesta.cantidad) {
          // Transformamos cantidad(dias) a formato legible
          const anios = Math.floor(respuesta.cantidad / 365);
          const meses = Math.floor((respuesta.cantidad % 365) / 30.44);
          const dias = Math.floor(respuesta.cantidad % 30.44);
          respuesta.saldoContrato = `${anios} años ${meses} meses ${dias} días`;
        }
        return respuesta;
      })
    );
  }

}
