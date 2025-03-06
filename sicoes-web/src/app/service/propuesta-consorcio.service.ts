import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/services';
import { PropuestaConsorcio } from '../interface/propuesta.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PropuestaConsorcioService {

    private _path_serve: String;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        this._path_serve = this.configService.getAPIUrl();
    }

    guardarEmpresaConsorcio(request: any){
        let urlEndpoint = `${this._path_serve}/api/propuestaConsorcio`
        return this.http.put<PropuestaConsorcio>(urlEndpoint,request);
    }

    obtenerEmpresasConsorcio(idPropuestaTecnica:number, idSector:number) {
        let urlEndpoint = `${this._path_serve}/api/propuestaConsorcio/obtenerEmpresas/${idPropuestaTecnica}/${idSector}`
        return this.http.get<PropuestaConsorcio[]>(urlEndpoint);
    }

    obtenerEmpresasSupervisoraSector(idSector:number) {
        let urlEndpoint = `${this._path_serve}/api/propuestaConsorcio/empresasSupervisoraSector/${idSector}`
        return this.http.get<any[]>(urlEndpoint);
    }

    registrarParticipacion(request: any[]) {
        let urlEndpoint = `${this._path_serve}/api/propuestaConsorcio/registrarParticipacion`
        return this.http.put<Boolean>(urlEndpoint,request);
    }

    eliminarEmpresaConsorcio(idProConsorcio: number): Observable<any> {
        let urlEndpoint = `${this._path_serve}/api/propuestaConsorcio/${idProConsorcio}`;
        return this.http.delete(urlEndpoint); 
    }
}