import { Injectable } from '@angular/core';
import { ProcesoConsulta } from '../interface/proceso.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { functions } from 'src/helpers/functions';
import { Requisito, Seccion } from '../interface/seccion.model';

@Injectable({
  providedIn: 'root'
})
export class RequisitoService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }
  
  obtenerRequisito(filtro){
    let urlEndpoint = `${this._path_serve}/api/requisitos/listar`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<Requisito>>(urlEndpoint, {
      params
    });
  }

  registrar(request: Requisito){
    let urlEndpoint = `${this._path_serve}/api/sicoes/secciones/requisito`
    return this.http.post<Requisito>(urlEndpoint, request);
  }

  actualizar(request: Requisito){
    let urlEndpoint = `${this._path_serve}/api/sicoes/secciones/requisito`
    return this.http.put<Requisito>(urlEndpoint, request);
  }

  eliminar(request: Requisito){
    let urlEndpoint = `${this._path_serve}/api/sicoes/secciones/requisito`
    return this.http.delete<Seccion>(urlEndpoint, { body: request });
  }

  obtenerRequisitosPorSeccion(idSeccion: number, tipoContratoSeleccionado: number){
    const filtro = this.obtenerFiltro();
    filtro.size = 999;
    let urlEndpoint = `${this._path_serve}/sicoes/solicitud/secciones/requisitos/${idSeccion}/${tipoContratoSeleccionado}`;
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<any>>(urlEndpoint, {
      params
    });
  }

  obtenerRequisitosPorPersonal(idSoliPersProp: number, tipoContratoSeleccionado: number){
    let urlEndpoint = `${this._path_serve}/sicoes/solicitud/personas/requisitos/${idSoliPersProp}/${tipoContratoSeleccionado}`;
    return this.http.get<any>(urlEndpoint);
  }

  evaluarRequisito(request: any) {
    const urlEndpoint = `${this._path_serve}/sicoes/solicitud/evaluacion/requisito`
    return this.http.put<any>(urlEndpoint, request);
  }

  evaluarRequisitoPersonal(request: any) {
    const urlEndpoint = `${this._path_serve}/sicoes/solicitud/evaluacion/requisito/personal`
    return this.http.put<any>(urlEndpoint, request);
  }

  modificarFlagRequisito(request: any) {
    const urlEndpoint = `${this._path_serve}/sicoes/solicitud/seccion/estado`
    return this.http.put<any>(urlEndpoint, request);
  }

  descartarFlagRequisitoPersonal(request: any) {
    const urlEndpoint = `${this._path_serve}/sicoes/solicitud/seccion/estado/personal`
    return this.http.put<any>(urlEndpoint, request);
  }

  obtenerRequisitosConFlagActivo(filtro: any) {
    let urlEndpoint = `${this._path_serve}/sicoes/solicitud/personas/requisitos`
    return this.http.get<Pageable<any>>(urlEndpoint, {
      params: functions.obtenerParams(filtro)
    });
  }
  obtenerFiltro(): any {
    return {};
  }

}
