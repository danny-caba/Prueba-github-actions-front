import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-contrato-form-eval-reemp',
  templateUrl: './contrato-form-eval-reemp.component.html',
  styleUrls: ['./contrato-form-eval-reemp.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ContratoFormEvalReempComponent extends BaseComponent implements OnInit {

  btnApprove: string = 'Aprobar';
  btnReject: string = 'Rechazar';
  idSolicitud: string = '';
  idReemplazoPersonal: string = '';
  codRolRevisor: string = null;
  listaObservaciones: any;

  isCargaAdenda: boolean = false;
  puedeRegistrar: boolean = false;
  allDocsConforme: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly reemplazoPersonalService: PersonalReemplazoService,
    private readonly adjunto:AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getIdSolicitud();
  }

  toGoBandejaContratos() {
      functionsAlert.questionSiNo('¿Desea regresar a la sección de evaluación de reemplazo de personal propuesto?').then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/intranet/contratos/' + Link.REEMPLAZO_PERSONAL_ADD + '/' + this.idSolicitud]);
        }
      });
  }

  getIdSolicitud(): void {
    this.idSolicitud = this.route.snapshot.paramMap.get('idSolicitud');
    this.idReemplazoPersonal = this.route.snapshot.paramMap.get('idReemplazo');
  }

  aprobarRechazar(accion: string): void {
    const body = {
        idReemplazo: Number(this.idReemplazoPersonal)
    }

    const mensajeConfirmacion = this.obtenerMensajeConfirmacion(accion);

    functionsAlert.questionSiNo(mensajeConfirmacion).then((result) => {
        if (result.isConfirmed) {
          this.reemplazoPersonalService
          .registrarAprobacionRechazo(accion, this.allDocsConforme, body)
          .subscribe(response => {
            console.log("response",response)
            if(response.archivo!=undefined && response.archivo!=null){
              this.adjunto.descargarWindowsJWT(response.archivo.codigo,response.archivo.nombreReal);
              
            }
            this.router.navigate(['/intranet/contratos/' + Link.REEMPLAZO_PERSONAL_ADD + '/' + this.idSolicitud]); 
          });
        }
      });
  }

  obtenerMensajeConfirmacion(accion: string){
    console.log(this.allDocsConforme);

    if ('R' === accion){
      return '¿Seguro de rechazar al reemplazo del personal propuesto?';
    }

    if (this.allDocsConforme) {
      return '¿Seguro de aprobar al personal de reemplazo?';
    } else {
      return 'Se encontró al menos un No, seguro de enviar para que subsane la empresa supervisora';
    }
  }

  recibirFlagSeccionesCompletadas(flag: boolean): void {
    this.puedeRegistrar = flag;
  }

  recibirCodigoRevisor(codigoRevisor: string){
    this.codRolRevisor = codigoRevisor;
  }

  recibirConformidades(allConforme: boolean){
    this.allDocsConforme = allConforme;
  }
}
