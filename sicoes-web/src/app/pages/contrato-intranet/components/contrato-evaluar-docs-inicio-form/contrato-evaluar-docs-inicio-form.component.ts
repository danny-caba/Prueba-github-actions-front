import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
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
  idReemplazoPersonal: string;

  isCargaDocsInicio: boolean = false;
  seccionesCompletadasFlag: boolean = false;
  conformidadFlag: boolean = false;

  codigoRevisor: string = null;
  fechaInicioContrato: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reemplazoService: PersonalReemplazoService
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
    this.idReemplazoPersonal = this.route.snapshot.paramMap.get('idReemplazo');
  }

  registrarActaInicioServicio(): void {
    const body = {
      idReemplazo: Number(this.idReemplazoPersonal)
    }

    functionsAlert.questionSiNo(this.obtenerMensajeConfirmacion()).then((result) => {
      if (result.isConfirmed) {
        this.reemplazoService
          .registrarActaInicio(this.conformidadFlag, body)
          .subscribe(response => {
            this.router.navigate(['/intranet/contratos/' + Link.EVAL_DOCS_INICIO + '/' , this.idSolicitud]);
        });
      }
    });
  }

  obtenerMensajeConfirmacion(){
    if (this.conformidadFlag){
      return '¿Seguro de finalizar la conformidad de la documentación de inicio de servicio?';
    } else {
      return '¿Se encontró al menos un No, seguro de enviar para que subsane la empresa supervisora?'
    }
  }

  recibirSeccionesCompletadas(valor: boolean){
    this.seccionesCompletadasFlag = valor;
    console.log("secciones completadas flag recibido -> ", this.seccionesCompletadasFlag);
  }

  recibirCodigoRevisor(valor: string){
    this.codigoRevisor = valor;
    console.log("codigo revisor recibido -> ", this.codigoRevisor);
  }

  recibirConformidad(valor: boolean){
    this.conformidadFlag = valor;
    console.log("conformidad flag recibido -> ", this.conformidadFlag);
  }

  recibirFechaInicio(valor: string){
    this.fechaInicioContrato = valor;
    console.log("fecha inicio recibida -> ", this.fechaInicioContrato);
  }

}
