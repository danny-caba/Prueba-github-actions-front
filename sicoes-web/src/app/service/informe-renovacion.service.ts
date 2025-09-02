import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { functions } from 'src/helpers/functions';
import { ConfigService } from '../core/services';

@Injectable({
  providedIn: 'root'
})
export class InformeRenovacionService {

  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  aprobarInformeRenovacion(request: any): Observable<any> {
    const urlEndpoint = `${this._path_serve}/api/informes-renovacion/aprobar`;
    return this.http.put<any>(urlEndpoint, request);
  }
}