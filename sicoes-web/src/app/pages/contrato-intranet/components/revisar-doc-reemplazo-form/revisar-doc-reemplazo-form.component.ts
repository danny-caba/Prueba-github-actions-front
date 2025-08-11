import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-revisar-doc-reemplazo-form',
  templateUrl: './revisar-doc-reemplazo-form.component.html',
  styleUrls: ['./revisar-doc-reemplazo-form.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class RevisarDocReemplazoFormComponent extends BaseComponent implements OnInit {

  btnRegister: string = 'Registrar';
  btnGuardarAdenda: string = 'Guardar Adenda';
  idSolicitud: string = '';
  idReemplazoPersonal: string = '';
  uuidSolicitud: string= '';
  codRolRevisor: string = null;

  isCargaAdenda: boolean = false;
  puedeRegistrar: boolean = false;
  allDocsConforme: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if(data.isCargaAdenda){
        this.isCargaAdenda = data.isCargaAdenda;
      }
    });
    this.getParams();
  }

  toGoBandejaContratos() {
        functionsAlert.questionSiNo('¿Desea regresar a la sección de Revisar documento de Personal de Reemplazo?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST, Link.REEMPLAZO_PERSONAL_REVIEW, this.idSolicitud]);
            }
          });
  }

  getParams(): void {
    this.idSolicitud = this.route.snapshot.paramMap.get('idSolicitud');
    this.uuidSolicitud = this.route.snapshot.paramMap.get('solicitudUuid');
    this.idReemplazoPersonal = this.route.snapshot.paramMap.get('idReemplazo');
  }

  registrarRevision(): void {
    const body = {
        idReemplazo: this.idReemplazoPersonal,
        codRol: this.codRolRevisor
      }

      const mensajeConfirmacion = this.obtenerMensajeConfirmacion();
  
      functionsAlert.questionSiNo(mensajeConfirmacion).then((result) => {
        if (result.isConfirmed) {
          this.reemplazoService
          .guardarRevDocumentos(body)
          .subscribe(response => {
            this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST, Link.REEMPLAZO_PERSONAL_REVIEW, this.idSolicitud]);
          });
        }
      });
  }

  obtenerMensajeConfirmacion(){
    if (this.allDocsConforme) {
      return '¿Seguro de registrar la revisión de documentos del personal propuesto de reemplazo?';
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

