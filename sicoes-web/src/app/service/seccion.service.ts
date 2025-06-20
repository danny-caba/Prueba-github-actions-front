import { Injectable } from '@angular/core';
import { ProcesoConsulta } from '../interface/proceso.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { functions } from 'src/helpers/functions';
import { Seccion } from '../interface/seccion.model';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }
  
  obtenerSeccion(filtro){
    let params = functions.obtenerParams(filtro);
    let urlEndpoint = `${this._path_serve}/api/secciones/listar`
    return this.http.get<Pageable<Seccion>>(urlEndpoint, {
      params
    });
  }

  registrar(request: Seccion){
    let urlEndpoint = `${this._path_serve}/api/secciones/seccion`
    return this.http.post<Seccion>(urlEndpoint, request);
  }

  actualizar(request: Seccion){
    let urlEndpoint = `${this._path_serve}/api/secciones/seccion`
    return this.http.put<Seccion>(urlEndpoint, request);
  }

  eliminar(request: Seccion){
    let urlEndpoint = `${this._path_serve}/api/secciones/seccion`
    return this.http.delete<Seccion>(urlEndpoint, { body: request });
  }

  obtenerSeccionPorSolicitud(idSolicitud: number){
    let urlEndpoint = `${this._path_serve}/api/secciones/${idSolicitud}`
    return this.http.get<Seccion>(urlEndpoint);
  }
  
  obtenerSeccionMaestraPorId(idSeccion: number){
    let urlEndpoint = `${this._path_serve}/api/secciones/${idSeccion}/maestra`
    return this.http.get<Seccion>(urlEndpoint);
  }
}
