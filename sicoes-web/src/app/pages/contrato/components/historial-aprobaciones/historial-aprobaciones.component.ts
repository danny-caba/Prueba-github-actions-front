import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { Solicitud } from 'src/app/interface/solicitud.model';

@Component({
  selector: 'historial-aprobaciones',
  templateUrl: './historial-aprobaciones.component.html',
  styleUrls: ['./historial-aprobaciones.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class HistoriaAprobacionesComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;


  displayedColumns: string[] = [
    'tipo',
    'grupo',
    'desinacion',
    'aprobador',
    'aprobacion',
    'resultado',
    'observacion'
  ];
 

  constructor(
    private router: Router,
    private intUrls: InternalUrls,
  ) {
    super();
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.cargarTabla();

  }


  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 

  public mostrarAccion(row: any) { }

  serviceTable(filtro: any) {
    
  }

  obtenerFiltro() {
    
  }

  regresar(){
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST,Link.SOLICITUDES_LIST_APROBACION])
  }

}
