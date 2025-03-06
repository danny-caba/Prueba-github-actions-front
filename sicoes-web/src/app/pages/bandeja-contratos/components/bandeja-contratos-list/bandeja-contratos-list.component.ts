import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ContratoService } from 'src/app/service/contrato.service';
import { ProcesoService } from 'src/app/service/proceso.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { solicitudContrato } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-bandeja-contratos-list',
  templateUrl: './bandeja-contratos-list.component.html'
})
export class BandejaContratosListComponent extends BasePageComponent<any> implements OnInit {

  // dataSource: MatTableDataSource<any>;
  // dataSource: any;
  displayedColumns: string[] = ['expediente', 'contratista', 'tipoContrato', 'areaSolicitante', 'actions'];

  ACCION_VER: string = solicitudContrato.ACCION_VER;
  ACCION_EDITAR: string = solicitudContrato.ACCION_EDITAR;

  formGroup = this.fb.group({
    expediente: [''],
    contratista: [''],
    tipoContrato: [null],
    areaSolicitante: [null],
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
    return this.contratoService.obtenerContratos(filtro);
  }

  obtenerFiltro() {
    let filtro: any = {
      expediente: this.formGroup.get('expediente').value,
      contratista: this.formGroup.get('contratista').value,
      tipoContrato: this.formGroup.get('tipoContrato').value,
      areaSolicitante: this.formGroup.get('areaSolicitante').value
    };
    return filtro;
  }

  goToBandejaSolicitudes() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

  // goToFormContrato(contrato: any, accion: string) {
  //   this.contratoService.validarSancionVigenteV2(contrato.supervisora.numeroDocumento).subscribe(res =>{
  //     if(res.resultado === '1'){
  //       this.contratoService.enviarCorreoSancion(contrato.idSolicitud, res).subscribe((response) => {
  //         functionsAlert.vigente('No es posible realizar su registro.', 'Mantiene una sancion por parte del OSCE.').then((result) => {
  //         });
  //       });
  //     }else{
  //       this.contratoService.validarFechaPresentacion(contrato.idSolicitud).subscribe((response) => {
  //         if (response) {
  //           this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, accion === this.ACCION_VER ? Link.CONTRATO_SOLICITUD_VIEW : Link.CONTRATO_SOLICITUD_ADD, contrato.idSolicitud]);
  //         } else {
  //           functionsAlert.error('La fecha límite de presentación ha expirado.');
  //         }
  //       }); 
  //     }
  //   });
  // }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  // estadoSolicitud(solicitud: any) {
  //   switch (solicitud.estadoProcesoSolicitud) {
  //     case "1":
  //       return "Preliminar";
  //     case "2":
  //       return "En Proceso";
  //     case "3":
  //       return "Observado";
  //     case "4":
  //       return "Concluido";
  //     case "5":
  //       return "Archivado";
    
  //     default:
  //       return "otro";
  //   }
  // }

  // formRequisitos(solicitud: any){
  //   return solicitud.estadoProcesoSolicitud === '1'
  // }

}
