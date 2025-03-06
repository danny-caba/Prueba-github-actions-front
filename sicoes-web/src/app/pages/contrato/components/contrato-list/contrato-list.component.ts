import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { Constantes } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';
import { solicitudContrato } from '../../../../../helpers/constantes.components';
import { ProcesoService } from 'src/app/service/proceso.service';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-contrato-list',
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})


export class ContratoListComponent extends BasePageComponent<Contrato> implements OnInit {

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
    private procesoService: ProcesoService
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
    return this.contratoService.obtenerSolicitudesExterno(filtro);
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
    this.contratoService.validarSancionVigenteV2(contrato.supervisora.numeroDocumento).subscribe(res =>{
      if(res.resultado === '1'){
        this.contratoService.enviarCorreoSancion(contrato.idSolicitud, res).subscribe((response) => {
          functionsAlert.vigente('No es posible realizar su registro.', 'Mantiene una sancion por parte del OSCE.').then((result) => {
          });
        });
      }else{
        this.contratoService.validarFechaPresentacion(contrato.idSolicitud).subscribe((response) => {
          if (response) {
            this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, accion === this.ACCION_VER ? Link.CONTRATO_SOLICITUD_VIEW : Link.CONTRATO_SOLICITUD_ADD, contrato.idSolicitud]);
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

  formRequisitos(solicitud: any){
    return solicitud.estadoProcesoSolicitud === '1'
  }

  textoRequisito(solicitud: any){
    return solicitud.tipoSolicitud === '1' ? 'requisitos' : 'subsanar';
  }

}
