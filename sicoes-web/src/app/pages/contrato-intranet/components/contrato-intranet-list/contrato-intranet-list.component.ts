import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Contrato } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { solicitudContrato } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-contrato-intranet-list',
  templateUrl: './contrato-intranet-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})


export class ContratoIntranetListComponent extends BasePageComponent<Contrato> implements OnInit {

  // dataSource: MatTableDataSource<any>;
  // dataSource: any;
  displayedColumns: string[] = ['concurso', 'convocatoria', 'item', 'fechaPresentacion', 'fechaSubsanacion', 'estado', 'tipo', 'actions'];
  ACCION_VER: string = solicitudContrato.ACCION_VER;
  ACCION_EDITAR: string = solicitudContrato.ACCION_EDITAR;

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
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.obtenerDetalleSolicitud();
  }

  obtenerDetalleSolicitud() {
    this.cargarTabla();
  }

  serviceTable(filtro: any) {
    return this.contratoService.obtenerSolicitudesInterno(filtro);
  }

  obtenerFiltro() {
    let filtro: any = {
      nroConcurso: this.formGroup.get('nroConcurso').value,
      item: this.formGroup.get('item').value,
      convocatoria: this.formGroup.get('convocatoria').value,
      estado: this.formGroup.get('estadoProcesoSolicitud').value,
      tipoSolicitud: this.formGroup.get('tipoSolicitud').value
    };
    return filtro;
  }

  goToBandejaSolicitudes() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

  goToFormContrato(contrato: any, accion: string) {
    this.contratoService.validarFechaPresentacion(contrato.idSolicitud).subscribe((response) => {
      if (response) {
        this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST, accion === this.ACCION_VER ? Link.CONTRATO_SOLICITUD_VIEW : Link.CONTRATO_SOLICITUD_EVALUAR, contrato.idSolicitud]);
      } else {
        functionsAlert.error('La fecha límite de presentación ha expirado.');
      }
    });
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  estadoSolicitud(solicitud: any) {
    switch (solicitud.estadoProcesoSolicitud) {
      case "1":
        return "Preliminar";
      case "2":
        return "En Proceso";
      case "3":
        return "Observado";
      case "4":
        return "Concluido";
      case "5":
        return "Archivado";
    
      default:
        return "otro";
    }
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  formRequisitos(solicitud: any){
    return solicitud.estadoProcesoSolicitud === '2'
  }
}
