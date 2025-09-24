import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from '../core/services';
const base_url = `${environment.URL_MRTD}/organizacion-funciones-rest/oyf`;
@Injectable({
    providedIn: 'root',
})

export class FirmaDigitalService {
    _path_serve: string;
    constructor(private readonly configService: ConfigService) {
        this._path_serve = this.configService.getAPIUrl();
    }
    private readonly http = inject(HttpClient)
    firmarArchivo(body: any): Observable<any> {

    const url = `${base_url}/reemplazo/solicitud/firmar/`;
        console.log('firmarArchivo - URL:', url);
        console.log('firmarArchivo - Body:', body);

        return this.http.post(url, body).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error en la solicitud:', error);
            return throwError(() => error);
        })
    );
    }

finalizarFirmaArchivo(idDocumento: number, cookie: string, hayMotivo: boolean): Observable < any > {
    const url = `${base_url}/elaborar/expediente/perfil/puesto/informe/grh/finalizar-firma`;

    const body = {
        idDocumento: idDocumento,
        cookie: cookie,
        hayMotivo: hayMotivo
    };
    console.log('finalizarFirmaArchivo - idDocumento:', idDocumento);
    console.log('finalizarFirmaArchivo - URL:', url);
    console.log('finalizarFirmaArchivo - Body:', body);

    return this.http.post(url, body).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error en finalizarFirmaArchivo:', error);
            return throwError(() => error);
        })
    );
}

revertirFirma(request: { idDocumento: number }): Observable < any > {
    const url = `${base_url}/elaborar/expediente/perfil/puesto/informe/grh/firmar/revertir`;
    console.log('revertirFirma - URL:', url);
    console.log('revertirFirma - Body:', request);

    return this.http.post(url, request).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error en revertirFirma:', error);
            return throwError(() => error);
        })
    );
}

descargarDocumento(nroExpediente: string, idArchivoSiged: number, nombreDocumento: string): Observable < Blob > {
    const url = `${base_url}/elaborar/expediente/perfil/puesto/descargar`;
    const params = {
        nroExpediente,
        idArchivoSiged: idArchivoSiged.toString(),
        nombreDocumento
    };

    return this.http.get(url, { params, responseType: 'blob' }).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error al descargar el documento:', error);
            return throwError(() => error);
        })
    );
}
}