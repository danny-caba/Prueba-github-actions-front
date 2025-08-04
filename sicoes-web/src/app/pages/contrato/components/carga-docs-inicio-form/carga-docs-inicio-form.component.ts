import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-carga-docs-inicio-form',
  templateUrl: './carga-docs-inicio-form.component.html',
  styleUrls: ['./carga-docs-inicio-form.component.scss']
})
export class CargaDocsInicioFormComponent extends BaseComponent implements OnInit {

  btnRegister: string = 'Registrar';
  idSolicitud: string = '';
  uuidSolicitud: string= '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
   
  }

  toGoBandejaContratos() {
        functionsAlert.questionSiNo('¿Desea regresar a la sección de reemplazo de personal propuesto?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.CARGA_DOCS_INICIO, this.idSolicitud]);
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
