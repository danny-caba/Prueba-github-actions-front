import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Proceso } from '../interface/proceso.model';
import { Propuesta, PropuestaProfesional, PropuestaTecnica } from '../interface/propuesta.model';

@Injectable({
  providedIn: 'root'
})
export class PropuestaTecnicaService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerPropuestaTecnica(idPropuestaTecnica, propuestaUuid): Observable<PropuestaTecnica> {
    const urlEndpoint = `${this._path_serve}/api/propuestasTecnicas/${idPropuestaTecnica}?propuestaUuid=${propuestaUuid}`
    return this.http.get<PropuestaTecnica>(urlEndpoint);
  }

  guardarPropuestaTecnica(request: any, idPropuestaTecnica:number){
    let urlEndpoint = `${this._path_serve}/api/propuestasTecnicas/${idPropuestaTecnica}?propuestaUuid=${request.propuestaUuid}`
    return this.http.put<PropuestaTecnica>(urlEndpoint,request);
  }



}
