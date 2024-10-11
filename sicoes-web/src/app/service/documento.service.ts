import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';
import { Documento } from '../interface/documento.model';
import { OtroRequisito } from '../interface/otro-requisito.model';
import { Pageable } from '../interface/pageable.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerDocumento(idDocumento): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/documentos/${idDocumento}`
    return this.http.get<Documento>(urlEndpoint);
  }

  buscarDocumentos(filtro) {
    let urlEndpoint = `${this._path_serve}/api/documentos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<Documento>>(urlEndpoint,{params:params});
  }

  registrar(request: any){
    let urlEndpoint = `${this._path_serve}/api/documentos`
    return this.http.post<Documento>(urlEndpoint,request);
  }

  actualizar(request: any){
    let urlEndpoint = `${this._path_serve}/api/documentos/${request.idDocumento}`
    return this.http.put<Documento>(urlEndpoint,request);
  }

  eliminar(id: any){
    let urlEndpoint = `${this._path_serve}/api/documentos/${id}`
    return this.http.delete<Documento>(urlEndpoint);
  }

  evaluarDocumento(request: any, idRequisito: any){
    let urlEndpoint = `${this._path_serve}/api/documentos/${idRequisito}/evaluar`
    return this.http.put<Documento>(urlEndpoint,request);
  }
}
