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
export class OtroRequisitoService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  obtenerOtroRequisitos(idOtroRequisito): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/requisitos/otrosRequisitos/${idOtroRequisito}`
    return this.http.get<OtroRequisito>(urlEndpoint);
  }

  buscarOtroRequisitos(filtro) {
    let urlEndpoint = `${this._path_serve}/api/requisitos/otrosRequisitos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<OtroRequisito>>(urlEndpoint,{params:params});
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

  evaluarOtroRequisito(request: any){
    let urlEndpoint = `${this._path_serve}/api/requisitos/otrosRequisitos/${request.idOtroRequisito}/evaluar`
    return this.http.put<Documento>(urlEndpoint,request);
  }

  finalizarOtroRequisito(request: any){
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil/${request.idOtroRequisito}/finalizar`
    return this.http.put<Documento>(urlEndpoint,request);
  }

  solicitarRevertirEvaluacion(request: any){
    let urlEndpoint = `${this._path_serve}/api/requisitos/perfil/${request.idOtroRequisito}/revertir/solicita`
    return this.http.put<Documento>(urlEndpoint,request);
  }
}
