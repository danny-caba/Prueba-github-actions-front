import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Proceso } from '../interface/proceso.model';
import { Propuesta, PropuestaProfesional, PropuestaTecnica } from '../interface/propuesta.model';
import { functions } from 'src/helpers/functions';
import { AprobadoresDTO, PacesAprobarDivisionDTO, PacesListado, PacesObservarDivisionDTO, PacesUpdateDTO } from '../interface/pace';
import { PlazoConfirmacion } from '../interface/plazo-confirmacion.model';

@Injectable({
    providedIn: 'root'
})
export class PlazoConfirmacionService {

    private _path_serve: String;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        this._path_serve = this.configService.getAPIUrl();
    }

    buscarPlazoConfirmacion(estado?: string): Observable<PlazoConfirmacion[]> {
        let urlEndpoint = `${this._path_serve}/api/renovacion/buscarPlazoConfirmacion`;
        
        if (estado) {
            urlEndpoint += `?estado=${encodeURIComponent(estado)}`;
        }
        
        return this.http.get<PlazoConfirmacion[]>(urlEndpoint);
    }

    registrarPlazoConfirmacion(requestDTO: PlazoConfirmacion): Observable<PlazoConfirmacion> {
        const urlEndpoint = `${this._path_serve}/api/renovacion/registrarPlazoConfirmacion`;
        return this.http.post<PlazoConfirmacion>(urlEndpoint, requestDTO);
    }
}
