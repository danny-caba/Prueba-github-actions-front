import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  id:number;
dataSourceHistorial = new MatTableDataSource<any>();
  @ViewChild('paginatorHistorial') paginatorHistorial: MatPaginator;
  constructor(
    private readonly router: Router,
    private readonly intUrls: InternalUrls,
     private readonly solicitudService: SolicitudService,
  ) {
    super();
    this.intenalUrls = intUrls;
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const row = navigation.extras.state['rowData'];
      console.log('Datos recibidos:', row);
      this.id=row.id;
    }
  }

  ngOnInit(): void {
    this.buscar();

  }


  buscar() {
    this.solicitudService.historialReemplazo(86).subscribe(resp => {
      console.log("data")
      this.dataSourceHistorial.data= resp.content;
      this.paginatorHistorial.length =this.dataSourceHistorial.data.length;
    });
    
  }


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  serviceTable(filtro: any) {
    console.log("service")
  }

  obtenerFiltro() {
console.log("filtro")
  }

  regresar() {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_LIST_APROBACION])
  }

}
