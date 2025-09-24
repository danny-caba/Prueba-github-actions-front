import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ContratoService } from 'src/app/service/contrato.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-carga-docs-inicio',
  templateUrl: './carga-docs-inicio.component.html',
  styleUrls: ['./carga-docs-inicio.component.scss']
})
export class CargaDocsInicioComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaInicioContractual', 'estadoReemplazo', 'estadoDocumento', 'actions'];
  allowedToReplace: boolean = true;
  private destroy$ = new Subject<void>();
  id: number = 0;
  dummyDataSource = [
    {
      tipoDocumento: "DNI",
      numeroDocumento: '09856442',
      nombreCompleto: 'CLAUDIA ROSA JIMENEZ PEREZ',
      perfil: 'DB1_456',
      fechaRegistro: '2023-10-01',
      fechaInicioContractual: '2023-10-01',
      estadoReemplazo: 'Preliminar',
      estadoDocumento: 'Aprobado'
    }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly contratoService: ContratoService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('idSolicitud'));
    console.log('ID de contrato:', this.id);
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  doNothing(): void {

  }

  cargarDatos() {
    this.contratoService.obtenerPersonalPropuesto(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        let dataobtenida = res.content;
        if (dataobtenida.length > 0) {
          dataobtenida.forEach((element, i) => {
            this.dummyDataSource[i].tipoDocumento = element?.personaPropuesta?.tipoDocumento?.descripcion;
            this.dummyDataSource[i].numeroDocumento = element?.personaPropuesta?.numeroDocumento;
            this.dummyDataSource[i].nombreCompleto = element?.personaPropuesta?.nombres +' '+ element?.personaPropuesta?.apellidoPaterno+' '+ element?.personaPropuesta?.apellidoMaterno;
            this.dummyDataSource[i].perfil = element?.perfil?.codigo;
            this.dummyDataSource[i].fechaRegistro = '';
            this.dummyDataSource[i].fechaInicioContractual = '';
            this.dummyDataSource[i].estadoReemplazo = element?.estadoReemplazo?.codigo;
            this.dummyDataSource[i].estadoDocumento = element?.estadoEvalDocIniServ?.codigo;
          });
        }else{
          this.dummyDataSource=[]
        }



        console.log("res", res);
      })
  }
  toGoDocumentosInicioServicioForm(row: any) {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.CARGA_DOCS_INICIO_FORM, encryptedId], { state: { rowData: row } });
  }

  toGoBandejaContratos() {
    functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
      if (result.isConfirmed) {
        this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST]);
      }
    });
  }
}
