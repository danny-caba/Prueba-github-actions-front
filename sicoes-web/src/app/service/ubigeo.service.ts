import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ubigeo } from '../interface/ubigeo.model';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  private _path_serve = environment.pathServe;

  codigoDepartamento: any
  codigoProvincia: any
  codigoDistrito: any

  constructor(
    private http: HttpClient
  ) { }

  findAllDepartamento():Observable<Ubigeo[]>{
    const urlEndpoint = `${this._path_serve}/api/departamentos`
    return this.http.get<Ubigeo[]>(urlEndpoint)
  }

  findProvinciaByDepartamento(codigoDepartamento: string):Observable<Ubigeo[]>{   
    this.codigoDepartamento=codigoDepartamento
    const urlEndpoint = `${this._path_serve}/api/departamentos/${codigoDepartamento}/provincias`    
    return this.http.get<Ubigeo[]>(urlEndpoint)
  }

  findDistritoByProvincia(codigoProvincia):Observable<Ubigeo[]>{        
    this.codigoProvincia=codigoProvincia   
    const urlEndpoint = `${this._path_serve}/api/provincias/${codigoProvincia}/distritos`
    return this.http.get<Ubigeo[]>(urlEndpoint)
  }

  obtenerDistrito(codigo){        
    this.codigoDistrito=codigo   
  }

  cargarUbigeo():any {
    const ubigeo = {
      codigoDepartamento: this.codigoDepartamento,
      codigoProvincia: this.codigoProvincia,
      codigoDistrito: this.codigoDistrito
    }    
    return ubigeo;
  }

}
