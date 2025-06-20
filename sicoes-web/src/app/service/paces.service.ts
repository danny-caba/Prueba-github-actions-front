import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Proceso } from '../interface/proceso.model';
import { Propuesta, PropuestaProfesional, PropuestaTecnica } from '../interface/propuesta.model';
import { functions } from 'src/helpers/functions';
import { AprobadoresDTO, PacesAprobarDivisionDTO, PacesListado, PacesObservarDivisionDTO, PacesUpdateDTO } from '../interface/pace';

@Injectable({
    providedIn: 'root'
})
export class PacesService {

    private _path_serve: String;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        this._path_serve = this.configService.getAPIUrl();
    }

    // buscarPor(idArea: number, idEstado: number): Observable<PropuestaTecnica> {
    //     const urlEndpoint = `${this._path_serve}/api/paces/obtenerPor/${idArea}/${idEstado}`;
    //     return this.http.get<PropuestaTecnica>(urlEndpoint);
    // }

    buscarPor(filtro) {
        let urlEndpoint = `${this._path_serve}/api/paces/obtenerPor`
        let params = functions.obtenerParams(filtro);
        return this.http.get<Pageable<PacesListado>>(urlEndpoint, { params: params });
    }

    buscarAsignacionG2Por(filtro) {
        let urlEndpoint = `${this._path_serve}/api/paces/obtenerAsignadosG2Por`
        let params = functions.obtenerParams(filtro);
        return this.http.get<Pageable<PacesListado>>(urlEndpoint, { params: params });
    }

    buscarAsignacionG3Por(filtro) {
        let urlEndpoint = `${this._path_serve}/api/paces/obtenerAsignadosG3Por`
        let params = functions.obtenerParams(filtro);
        return this.http.get<Pageable<PacesListado>>(urlEndpoint, { params: params });
    }

    buscarAceptadosEnviadosPor(filtro) {
        let urlEndpoint = `${this._path_serve}/api/paces/obtenerAceptadosEnviadosPor`
        let params = functions.obtenerParams(filtro);
        return this.http.get<Pageable<PacesListado>>(urlEndpoint, { params: params });
    }

    actualizar(request: any) {
        let urlEndpoint = `${this._path_serve}/api/paces/actualizar`
        return this.http.put<PacesUpdateDTO>(urlEndpoint, request);
    }

    observarPaceDivision(request: any) {
        let urlEndpoint = `${this._path_serve}/api/paces/observarPaceDivision`
        return this.http.put<PacesObservarDivisionDTO>(urlEndpoint, request);
    }

    aprobarPaceDivision(request: any) {
        let urlEndpoint = `${this._path_serve}/api/paces/aprobarPaceDivision`
        return this.http.put<PacesObservarDivisionDTO>(urlEndpoint, request);
    }

    aprobacionMasivaPaceDivision(request: PacesAprobarDivisionDTO[]) {
        let urlEndpoint = `${this._path_serve}/api/paces/aprobacionMasivaPaceDivision`
        return this.http.put<PacesAprobarDivisionDTO[]>(urlEndpoint, request);
    }

    eliminar(id: any): Observable<any> {
        let urlEndpoint = `${this._path_serve}/api/paces/eliminar/${id}`
        return this.http.delete<any>(urlEndpoint);
    }
 
    cancelarPACE(request: any) {
        let urlEndpoint = `${this._path_serve}/api/paces/cancelar`
        return this.http.put<PacesObservarDivisionDTO>(urlEndpoint, request);
    }
    aprobarEnviar(request: any) {
        let urlEndpoint = `${this._path_serve}/api/paces/aprobarEnviar`
        return this.http.put<PacesObservarDivisionDTO>(urlEndpoint, request);
    }

    aprobarEnviarMasivaPaceGerencia(request: PacesAprobarDivisionDTO[]) {
        let urlEndpoint = `${this._path_serve}/api/paces/aprobadoEnviadoMasivaPaceGerencia`
        return this.http.put<PacesAprobarDivisionDTO[]>(urlEndpoint, request);
    }

    actualizarAprobadores(request: any) {
        let urlEndpoint = `${this._path_serve}/api/paces/actualizarAprobadores`
        return this.http.put<AprobadoresDTO>(urlEndpoint, request);
    }
}
