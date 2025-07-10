import { Component, OnDestroy, OnInit, ViewChildren, QueryList } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { RequerimientoInformeDetalle } from 'src/app/interface/requerimiento.model';
import { LayoutInformeSeccionPNComponent } from 'src/app/shared/layout-informe-seccion/layout-informe-seccion-pn/layout-informe-seccion-pn.component';

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

  secciones: any[] = [
    {
      "idListadoDetalle": "234",
      "orden": "1",
      "descripcion": "Objetivo",
      "codigo": "objetivo",
      "obligatorio": true
    },
    {
      "idListadoDetalle": "235",
      "orden": "2",
      "descripcion": "Perfil Requerido",
      "codigo": "perfilRequerido",
      "obligatorio": true
    },
    {
      "idListadoDetalle": "236",
      "orden": "3",
      "descripcion": "Plazo de Ejecución Contractual",
      "codigo": "plazoEjecucion",
      "obligatorio": true
    },
    {
      "idListadoDetalle": "237",
      "orden": "4",
      "descripcion": "Costo del Servicio",
      "codigo": "costoServicio",
      "obligatorio": true
    },
    {
      "idListadoDetalle": "238",
      "orden": "5",
      "descripcion": "Terminos del Servicio",
      "codigo": "terminoServicio",
      "obligatorio": false
    },
    {
      "idListadoDetalle": "239",
      "orden": "6",
      "descripcion": "Entregables",
      "codigo": "entregables",
      "obligatorio": false
    },
    {
      "idListadoDetalle": "240",
      "orden": "7",
      "descripcion": "Penalidades a Aplicar",
      "codigo": "penalidades",
      "obligatorio": true
    },
    {
      "idListadoDetalle": "241",
      "orden": "8",
      "descripcion": "Tipos y Caracteristicas de Seguro",
      "codigo": "tipoSeguro",
      "obligatorio": true
    },
    {
      "idListadoDetalle": "242",
      "orden": "9",
      "descripcion": "Disponibilidad Presupuestal",
      "codigo": "disponibilidadPresupuestal",
      "obligatorio": true
    },
    {
      "idListadoDetalle": "243",
      "orden": "10",
      "descripcion": "Declaración Jurada",
      "codigo": "declaracionJurada",
      "obligatorio": true
    }
  ];

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
