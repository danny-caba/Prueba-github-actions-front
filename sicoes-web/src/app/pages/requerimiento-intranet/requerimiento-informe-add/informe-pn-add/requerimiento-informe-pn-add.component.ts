import { Component, OnDestroy, OnInit, ViewChildren, QueryList } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { RequerimientoInformeDetalle } from 'src/app/interface/requerimiento.model';
import { LayoutInformeSeccionPNComponent } from 'src/app/shared/layout-informe-seccion/layout-informe-seccion-pn/layout-informe-seccion-pn.component';
import seccionesData from 'src/assets/data/req-secciones-informe.json';

@Component({
  selector: 'vex-requerimiento-informe-pn-add',
  templateUrl: './requerimiento-informe-pn-add.component.html',
  styleUrls: ['./requerimiento-informe-pn-add.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RequerimientoInformePnAddComponent implements OnInit, OnDestroy {

  @ViewChildren(LayoutInformeSeccionPNComponent) seccionesComponents: QueryList<LayoutInformeSeccionPNComponent>;

  secciones: any[] = seccionesData;

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  obtenerDatosInforme(): RequerimientoInformeDetalle {
    const datosInforme: RequerimientoInformeDetalle = new RequerimientoInformeDetalle();
    
    this.seccionesComponents?.forEach((seccionComponent, index) => {
      datosInforme[this.secciones[index].codigo] = seccionComponent.obtenerContenidoSeccion?.() || '';
    });

    return datosInforme;
  }
}
