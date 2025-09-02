import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { estadosIndexPerfCont, estadosPerfCont, tipoSolicitudPerfCont } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';
import { solicitudContrato } from '../../../../../helpers/constantes.components';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Subject, takeUntil } from 'rxjs';
import * as CryptoJS from 'crypto-js';

const URL_ENCRIPT = '3ncr1pt10nK3yuR1';

@Component({
  selector: 'vex-contrato-perfeccionamiento',
  templateUrl: './contrato-perfeccionamiento.component.html',
  styleUrls: ['./contrato-perfeccionamiento.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ContratoPerfeccionamientoComponent extends BasePageComponent<Contrato> implements OnInit, OnDestroy {

  displayedColumns: string[] = ['concurso', 'convocatoria', 'item', 'fechaPresentacion', 'fechaSubsanacion', 'estado', 'estadoDocInicioServicio', 'tipo', 'actions'];
  ACCION_VER: string = solicitudContrato.ACCION_VER;
  ACCION_EDITAR: string = solicitudContrato.ACCION_EDITAR;
  private destroy$ = new Subject<void>();

  formGroup = this.fb.group({
    nroConcurso: [null],
    item: [null],
    convocatoria: [''],
    estadoProcesoSolicitud: [''],
    tipoSolicitud: [''],
  });
  
  constructor(
    private router: Router,
    private contratoService: ContratoService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  serviceTable(filtro: any) {
    return this.contratoService.obtenerSolicitudesExterno(filtro);
  }

  obtenerFiltro() {
    let filtro: any = {
      nroConcurso: this.formGroup.get('nroConcurso').value,
      item: this.formGroup.get('item').value,
      convocatoria: this.formGroup.get('convocatoria').value ? `%${this.formGroup.get('convocatoria').value.trim()}%` : null,
      estado: this.formGroup.get('estadoProcesoSolicitud').value,
      tipoSolicitud: this.formGroup.get('tipoSolicitud').value
    };
    return filtro;
  }

  goToBandejaSolicitudes() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

  goToFormContrato(contrato: any, accion: string) {
    this.contratoService.validarSancionVigenteV2(contrato.supervisora.numeroDocumento)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res =>{
      if(res.resultado === '1'){
        this.contratoService.enviarCorreoSancion(contrato.idSolicitud, res)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response) => {
          functionsAlert.vigente('No es posible realizar su registro.', 'Mantiene una sancion por parte del OSCE.').then((result) => {
          });
        });
      }else{

        let encodedId = this.encrypt(contrato.idSolicitud.toString());
        this.contratoService.validarFechaPresentacion(contrato.idSolicitud)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response) => {
          if (response) {
            this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, accion === this.ACCION_VER ? Link.CONTRATO_SOLICITUD_VIEW : Link.CONTRATO_SOLICITUD_ADD, encodedId]);
          } else {
            functionsAlert.error('La fecha límite de presentación ha expirado.');
          }
        }); 
      }
    });
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  estadoSolicitud(contrato: Contrato): string {
    const estados: { [key: string]: string } = {
      "1": estadosPerfCont.PRELIMINAR,
      "2": estadosPerfCont.EN_PROCESO,
      "3": estadosPerfCont.OBSERVADO,
      "4": estadosPerfCont.CONCLUIDO,
      "5": estadosPerfCont.ARCHIVADO
    };
    return estados[contrato?.estadoProcesoSolicitud] || "Otro";
  }

  formRequisitos(contrato: Contrato): boolean {
    return contrato.estadoProcesoSolicitud === estadosIndexPerfCont.PRELIMINAR;
  }

  textoRequisito(contrato: Contrato): string {
    return contrato.tipoSolicitud === tipoSolicitudPerfCont.INSCRIPCION 
      ? 'requisitos' : 'subsanar';
  }

  encrypt(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, URL_ENCRIPT).toString();
    return encrypted;
  }

  getEstadoDocInicioServicio(contrato: Contrato): string {
    const estados: { [key: string]: string } = {
      "1": "Pendiente",
      "2": "Enviado",
      "3": "Observado",
      "4": "Aprobado"
    };
    return contrato.idDocInicio ? estados[contrato.idDocInicio.toString()] || "" : "";
  }

  irACargaDocInicio(contrato: Contrato): void {
    this.router.navigate(['/', Link.EXTRANET, Link.CONTRATOS_LIST, 'cargar-documentacion-inicio', contrato.idSolicitud]);
  }
}
