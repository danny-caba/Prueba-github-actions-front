import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../core/services';
import { Adjunto, AdjuntoRequisto } from '../interface/adjuntos.model';
import { Pageable } from '../interface/pageable.model';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AdjuntosService {

  private _path_serve = environment.pathServe;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService) { }

  buscarAdjuntosSolicitud(): Observable<Pageable<AdjuntoRequisto>> {
    let urlEndpoint = `${this._path_serve}/api/adjuntos-solicitud-acreditacion?size=1000`
    return this.http.get<Pageable<AdjuntoRequisto>>(urlEndpoint);
  }

  findAll(requisitoAdjunto: number):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/${requisitoAdjunto}`
    return this.http.get<Adjunto>(urlEndpoint);
  }

  public upload(formData, adjuntoRequisito) {
    return this.http.post<any>(`${this._path_serve}/api/archivos`, formData, {  
      reportProgress: true,  
      observe: 'events'
    });  
  }

  public uploadActualizar(formData, idArchivo) {
    return this.http.put<any>(`${this._path_serve}/api/archivos/${idArchivo}`, formData, {  
      reportProgress: true,  
      observe: 'events'
    });  
  }

  public uploadActualizarProceso(formData) {
    return this.http.post<any>(`${this._path_serve}/api/archivos`, formData, {  
      reportProgress: true,  
      observe: 'events'
    });  
  }

  /*public uploadActualizar(formData, codDocumento) {
    return this.http.put<any>(`${this._path_serve}/api/adjuntos/${codDocumento}`, formData, {  
      reportProgress: true
    });  
  }*/

  public downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
  }


  public descargarWindowsJWT(uuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/archivos/${uuid}/descarga`;

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }

  public reporteEmpresaSupervisora(uuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/supervisora-perfiles/export`;

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }

  public reporteSuspCanc(uuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/suspension-cancelacion/export`;
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }

  public reporteVerProfesionales(procesItemUuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/propuestasProfesionales/${procesItemUuid}/export`;
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }

  public downloadFormato(uuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/formato/${nombre}/descarga`;

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }

  public downloadFormatoPublico(uuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/formato-publico/${nombre}/descarga`;

    let headers = new Headers();
    //headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }


  public downloadPropuestaZip(propuestaUuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/archivos/propuesta-zip?propuestaUuid=${propuestaUuid}`;

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }

  public downloadResumenProcesoItem(procesoItemUuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/propuestas/${procesoItemUuid}/export`;

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    fetch(file, { headers })
        .then(response => response.blob())
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();

            window.URL.revokeObjectURL(objectUrl);
    });
  }

  public downloadProcesoItemZip(uuid, nombre){
    const accessToken = this.tokenStorageService.getAccessToken();

    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/archivos/procesoItem-zip?procesoItemUuid=${uuid}`;

    functionsAlertMod2.loadProcesoDownload();

    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    
    fetch(file, { headers })
        .then((response) => {
          return response.blob()
        })
        .then(blobby => {
            let objectUrl = window.URL.createObjectURL(blobby);

            anchor.href = objectUrl;
            anchor.download = nombre;
            anchor.click();
            Swal.close()
            window.URL.revokeObjectURL(objectUrl);
    });
  }
  
}

