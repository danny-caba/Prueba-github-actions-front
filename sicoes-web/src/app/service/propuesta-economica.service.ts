import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../core/services';
import { PropuestaEconomica } from '../interface/propuesta.model';

@Injectable({
  providedIn: 'root'
})
export class PropuestaEconomicaService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerPropuestaEconomica(idPropuestaEconomica, propuestaUuid): Observable<PropuestaEconomica> {
    const urlEndpoint = `${this._path_serve}/api/propuestasEconomicas/${idPropuestaEconomica}?propuestaUuid=${propuestaUuid}`
    return this.http.get<PropuestaEconomica>(urlEndpoint);
  }

  guardarPropuestaEconomica(request: any, idPropuestaEconomica:number){
    let urlEndpoint = `${this._path_serve}/api/propuestasEconomicas/${idPropuestaEconomica}?propuestaUuid=${request.propuestaUuid}`
    return this.http.put<PropuestaEconomica>(urlEndpoint,request);
  }

}
