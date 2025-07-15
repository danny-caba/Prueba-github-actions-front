import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
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
  uuidSolicitud: string= '';

  isCargaAdenda: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if(data.isCargaAdenda){
        this.isCargaAdenda = data.isCargaAdenda;
      }
    });
    this.getIdSolicitud();
  }

  toGoBandejaContratos() {
        functionsAlert.questionSiNo('¿Desea regresar a la sección de Revisar documento de Personal de Reemplazo?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.REEMPLAZO_PERSONAL_REVIEW, this.idSolicitud]);
            }
          });
  }

  getIdSolicitud(): void {
    this.idSolicitud = this.route.snapshot.paramMap.get('idSolicitud');
    this.uuidSolicitud = this.route.snapshot.paramMap.get('solicitudUuid');
    console.log("idSolicitud -> ", this.idSolicitud);
    console.log("uuidSolicitud -> ", this.uuidSolicitud);
  }

  doNothing(): void {

  }

}

