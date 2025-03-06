import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcesoConsulta } from 'src/app/interface/proceso.model';
import { ProcesoService } from 'src/app/service/proceso.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { ModalFormulacionConsultasComponent } from 'src/app/shared/modal-formulacion-consultas/modal-formulacion-consultas.component';
import { ProcesoConsultaService } from '../../../service/proceso-consulta.service';
import { functionsAlertMod2 } from '../../../../helpers/funtionsAlertMod2';
import { Location } from '@angular/common';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';


@Component({
  selector: 'vex-formulacion-consultas',
  templateUrl: './formulacion-consultas.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class FormulacionConsultasComponent extends BasePageComponent<ProcesoConsulta> implements OnInit {
  
  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  numeroProceso: string;
  nombreProceso: string;
  estadoProceso: string;
  subscriptionProceso$: any;

  PROCESO: any;
  consultas: any[] = [];
  displayedColumns: string[] = [
    'numero',
    'seccion',
    'numeral',
    'literal',
    'pagina',
    'descripcion',
    'articuloNorma',
    'estado',
    'actions'
  ];

  constructor(
    private procesoService: ProcesoService,
    private authFacade: AuthFacade,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private intUrls: InternalUrls,
    private procesoConsultaService: ProcesoConsultaService,
    private location: Location,
    private router: Router
  ) {
    super();
    this.intenalUrls = intUrls;
  }
  
  ngOnInit(): void {
    this.obtenerDetalleProceso();
  }
  
  serviceTable(filtro: any) {
    return this.procesoConsultaService.obtenerConsultasUsuario(filtro);
  }

  obtenerFiltro() {
    let filtro: any = {
      idProceso: this.PROCESO.idProceso
    };
    return filtro;
  }

  ngOnDestroy(): void {
    this.subscriptionProceso$.unsubscribe();
  }

  obtenerDetalleProceso(){
    let procesoUuid = this.activeRoute.snapshot.paramMap.get('procesoUuid');

    if(procesoUuid){
      this.subscriptionProceso$ = this.procesoService.obtenerProceso(procesoUuid).subscribe((data: any) => {
        this.PROCESO = data;
        
        const { numeroProceso, nombreProceso, estado: { nombre: estadoProceso } } = this.PROCESO;
        this.numeroProceso = numeroProceso;
        this.nombreProceso = nombreProceso;
        this.estadoProceso = estadoProceso;
        
        this.cargarTabla();
      });
    }
  }

  nuevaConsulta(accion: string, consulta: any = null) {
    this.dialog
      .open(ModalFormulacionConsultasComponent, {
        disableClose: true,
        width: "800px",
        maxHeight: "auto",
        data: {
          accion,
          proceso: this.PROCESO,
          consulta
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.cargarTabla();
          this.paginator.firstPage();
        }
      });
  }

  enviarConsulta() {
    
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea enviar la lista de consultas?').then((result) => {
      if (result.isConfirmed) {
        this.procesoConsultaService.actualizarEstadoEnvio(this.PROCESO.idProceso).subscribe(sol => {
          if (sol !== null) {
            functionsAlertMod2.success('Envío satisfactorio').then(() => {
              this.cargarTabla();
              this.paginator.firstPage();
            });
          }	
        });
      }
    });
  }

  eliminarConsulta(consulta) {
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar la consulta?').then((result) => {
      if (result.isConfirmed) {
        this.procesoConsultaService.eliminar(consulta.procesoConsultaUuid).subscribe(() => {
          functionsAlertMod2.success('Consulta Eliminada').then(() => {
            this.cargarTabla();
          });
        });
      }
    });
  }


  goBack(): void {
    this.location.back();
  }

  goToBandejaProceso() {
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
  }

}
