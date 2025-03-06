import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject, timeout } from 'rxjs';
import { Constantes, TipoDocumentoEnum } from 'src/helpers/constantes.components';
import { AuthUser } from '../auth/store/auth.models';
import { ConfigService } from '../core/services';
import { Pageable } from '../interface/pageable.model';
import { Pido, Sne, Sunedu,Areas, Usuario } from '../interface/pido.model';
import { functions } from 'src/helpers/functions';
import { SolicitudListado } from '../interface/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class PidoService {

  private pidoReniecSub = new Subject<Pido>();
  private sneSub = new Subject<Sne>();
  private _path_serve: String;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  loadReniec(): Observable<Pido> {
    return this.pidoReniecSub.asObservable();
  }

  loadSne(): Observable<Sne>{
    return this.sneSub.asObservable();
  }

  buscarNroDocumento(tipoDocumentoCodigo, numeroDocumento){
    let tipoDoc = tipoDocumentoCodigo;
    if(tipoDoc == TipoDocumentoEnum.DNI){
      return this.buscarReniec(numeroDocumento)
    }else if(tipoDoc == TipoDocumentoEnum.RUC){
      return this.buscarSunat(numeroDocumento)
    }else{
      return this.buscarCE(numeroDocumento)
    }
  }

  buscarCE(nroDocumento) {
    let urlEndpoint = `${this._path_serve}/api/pido/migracion/${nroDocumento}`
    return this.http.get<Pido>(urlEndpoint);
  }

  buscarSunat(nroDocumento) {
    let urlEndpoint = `${this._path_serve}/api/pido/sunat/${nroDocumento}`
    return this.http.get<Pido>(urlEndpoint);
  }

  buscarReniec(nroDocumento) {
    let urlEndpoint = `${this._path_serve}/api/pido/reniec/${nroDocumento}`
    return this.http.get<Pido>(urlEndpoint);
  }

  setReniecPido(pido: Pido){
    this.pidoReniecSub.next(pido);
  }

  setSne(sne: Sne){
    this.sneSub.next(sne);
  }

  validarSNE(usu: AuthUser){
    let urlEndpoint = `${this._path_serve}/api/pido/SNE?tipoDocumento=1&nroDocumento=${usu.numeroDocumento}`
    return this.http.get<Sne>(urlEndpoint);
  }

  validarEmail(correo: string){
    let urlEndpoint = `${this._path_serve}/api/usuarios/publico/enviar-codigo-validacion`
    let req = {
      correo: correo,
      codigoTipo:'VERIFICACION'
    }
    return this.http.post<Pido>(urlEndpoint, req);
  }

  validarCodigoEmail(codigo: string){
    let urlEndpoint = `${this._path_serve}/api/usuarios/validar-codigo-validacion`
    let req = {
      codigo: codigo
    }
    return this.http.post<Pido>(urlEndpoint, req);
  }

  buscarSunedu(solicitudUuid) {
    let urlEndpoint = `${this._path_serve}/api/estudios/sunedu?solicitudUuid=${solicitudUuid}`
    /*return this.http.get<any>(urlEndpoint).pipe(
      timeout(2000) //5 seconds
    );*/
    return this.http.get<any>(urlEndpoint);
  }
  eliminarEstudio(id: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/${id}`
    return this.http.delete<Sunedu>(urlEndpoint);
  }
  registrarEstudio(request: any){
    let urlEndpoint = `${this._path_serve}/api/estudios`
    return this.http.post<Sunedu>(urlEndpoint,request);
  }
  listarEstudios(solicitudUuid) {
    const urlEndpoint = `${this._path_serve}/api/estudios?solicitudUuid=${solicitudUuid}`
    return this.http.get<Pageable<any>>(urlEndpoint);
  }
  actualizarEstudio(id: any,request: any){
    let urlEndpoint = `${this._path_serve}/api/estudios/${id}`
    return this.http.put<any>(urlEndpoint,request);
  }
  obtenerEstudios(id: any) {
    let urlEndpoint = `${this._path_serve}/api/estudios/${id}`
    return this.http.get<any>(urlEndpoint);
  }

  //Proceso

  listarAreas() {
    const urlEndpoint = `${this._path_serve}/api/pido/listar-unidad`
    return this.http.get<Areas[]>(urlEndpoint);
  }

  listarUsuarios() {
    const urlEndpoint = `${this._path_serve}/api/pido/listar-usuarios`
    return this.http.get<Usuario[]>(urlEndpoint);
  }

  obtenerListadoEstadoPublic(codigo):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-publico/${codigo}`
    return this.http.get<any>(urlEndpoint);
  }
  obtenerListadoUnidadesPublic():Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-publico-unidad`
    return this.http.get<any>(urlEndpoint);
  }

  listadoProcesoPublic(filtro):Observable<any>{
    let urlEndpoint = `${this._path_serve}/api/listado-publico/listar-procesos`
    let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint,{params:params});
  }
  obtenerProcesosPublic(procesoUuid):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-publico-procesos/${procesoUuid}`
    // let params = functions.obtenerParams(filtro);
    return this.http.get<Pageable<SolicitudListado>>(urlEndpoint);
  }
  listarEtapasPublic(procesoUuid):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-publico-procesos/listar-etapas?procesoUuid=${procesoUuid}`
    return this.http.get<Pageable<any>>(urlEndpoint);
  }
  obtenerDocEtapaPublic(idProceso):Observable<any> {
    let urlEndpoint = `${this._path_serve}/api/listado-publico-procesos/listar-documento-etapas?idProceso=${idProceso}`
    return this.http.get<Pageable<any>>(urlEndpoint);
  }
  public descargarWindowPublic(uuid, nombre):Observable<any>{
    // const accessToken = this.tokenStorageService.getAccessToken();

    // let anchor = document.createElement("a");
    // document.body.appendChild(anchor);
    let file = `${this._path_serve}/api/listado-publico/archivos/${uuid}/descarga`;
    return this.http.get(file,{responseType:'arraybuffer'});
    // let headers = new Headers();
    // headers.append('Authorization', `Bearer ${accessToken}`);

    // fetch(file)
    //     .then(response => response.blob())
    //     .then(blobby => {
    //         let objectUrl = window.URL.createObjectURL(blobby);

    //         anchor.href = objectUrl;
    //         anchor.download = nombre;
    //         anchor.click();

    //         window.URL.revokeObjectURL(objectUrl);
    // });
  }

  buscarNroDocumentoRepresentante(tipoDocumentoCodigo, numeroDocumento){
    let tipoDoc = tipoDocumentoCodigo;
    if(tipoDoc == TipoDocumentoEnum.DNI){
      return this.buscarRepresentanteReniec(numeroDocumento)
    }else if(tipoDoc == TipoDocumentoEnum.RUC){
      return this.buscarRepresentanteSunat(numeroDocumento)
    }else{
      return this.buscarCE(numeroDocumento)
    }
  }

  buscarRepresentanteSunat(nroDocumento) {
    let urlEndpoint = `${this._path_serve}/api/pido/sunat/representante/${nroDocumento}`
    return this.http.get<Pido>(urlEndpoint);
  }

  buscarRepresentanteReniec(nroDocumento) {
    let urlEndpoint = `${this._path_serve}/api/pido/reniec/representante/${nroDocumento}`
    return this.http.get<Pido>(urlEndpoint);
  }

}
