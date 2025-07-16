import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-contrato-evaluar-docs-inicio-form',
  templateUrl: './contrato-evaluar-docs-inicio-form.component.html',
  styleUrls: ['./contrato-evaluar-docs-inicio-form.component.scss']
})
export class ContratoEvaluarDocsInicioFormComponent extends BaseComponent implements OnInit {

  btnRegister: string = 'Registrar';
  idSolicitud: string = '';
  uuidSolicitud: string= '';
  isCargaDocsInicio: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if(data.isCargaDocsInicio){
        this.isCargaDocsInicio = data.isCargaDocsInicio;
      }
    });
    this.getIdSolicitud();
  }

  toGoBandejaContratos() {
        functionsAlert.questionSiNo('¿Desea regresar a la sección de Evaluar Documento de Personal de Reeemplazo?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/intranet/contratos/' + Link.EVAL_DOCS_INICIO + '/' , this.idSolicitud]);
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
