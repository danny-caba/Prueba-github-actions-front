import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ConfigService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { functions } from 'src/helpers/functions';
import { ListadoDetalle } from '../interface/listado.model';
import { Division } from '../interface/division.model';

@Injectable({
  providedIn: 'root'
})
export class ParametriaService {

  private _path_serve: string;

  constructor(
    private http: HttpClient, 
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerMultipleListadoDetalle(endpoinds:any[]):Observable<any> {
    let request: Observable<any>[] = [];
    endpoinds.forEach(async element => {
      let dato = this.getParamSession(element);
      if(dato == null || dato == undefined){
        let urlEndpoint = `${this._path_serve}/api/listado/${element}`
        let nuevoDato = await this.http.get<ListadoDetalle[]>(urlEndpoint).toPromise();
        sessionStorage.setItem(element, JSON.stringify(nuevoDato));
        request.push(of(nuevoDato));
      }else{
        request.push(of(dato))
      }
    });

    return forkJoin(request);
  }

  obtenerSubListado(codigo, idSuperior):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado/${codigo}/detalles/${idSuperior}`
    return this.http.get<ListadoDetalle>(urlEndpoint);
  }

  obtenerSubListadoPublico(codigo, idSuperior):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-publico/${codigo}/detalles/${idSuperior}`
    return this.http.get<ListadoDetalle>(urlEndpoint);
  }

  getParamSession(endpinds){
    let dato = sessionStorage.getItem(endpinds);
    if(functions.esVacio(dato)){
      return null;
    }
    if(dato !== 'undefined'){
      return JSON?.parse(dato);
    }
  }

  buscarPerfiles():Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado/perfiles`
    return this.http.get<any>(urlEndpoint);
  }

  filtrarPerfiles(idSubSector):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado/perfiles?idSubSector=${idSubSector}`
    return this.http.get<any>(urlEndpoint);
  }

  obtenerMultipleListadoDetallePublico(endpoinds:any[]):Observable<any> {
    let request: Observable<any>[] = [];
    endpoinds.forEach(async element => {
      let dato = this.getParamSession(element);
      if(dato == null || dato == undefined){
        let urlEndpoint = `${this._path_serve}/api/listado-publico/${element}`
        let nuevoDato = await this.http.get<ListadoDetalle[]>(urlEndpoint).toPromise();
        sessionStorage.setItem(element, JSON.stringify(nuevoDato));
        request.push(of(nuevoDato));
      }else{
        request.push(of(dato))
      }
    });

    return forkJoin(request);
  }

  listarProfesiones(): Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/profesiones/todas`;
    return this.http.get<any>(urlEndpoint);
  }

  listarDivisionesPorProfesion(idProfesion: number): Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/divisiones/${idProfesion}`;
    return this.http.get<any>(urlEndpoint);
  }

  listarPerfilesPorProfesionDivision(idProfesion: number, idDivision: number): Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado/perfiles/${idProfesion}/${idDivision}`;
    return this.http.get<any>(urlEndpoint);
  }

  listarDivision(idDivision: number):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado/perfiles/division/${idDivision}`
    return this.http.get<any>(urlEndpoint);
  } 

  obtenerListadoDetallePorCodigo(codigo):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-detalle/${codigo}`
    return this.http.get<ListadoDetalle>(urlEndpoint);
  }

  listarDivisiones(): Observable<Division[]> {
    let urlEndpoint = `${this._path_serve}/api/divisiones`;
    return this.http.get<Division[]>(urlEndpoint);
  }

  listarDivisionesPorUsuario(idUsuario: number): Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/divisiones/perfiles/${idUsuario}`;
    return this.http.get<any>(urlEndpoint);
  }

}

