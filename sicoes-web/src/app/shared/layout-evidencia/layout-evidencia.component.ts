import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { EvidenciaService } from 'src/app/service/evidencia.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from '../components/base-page.component';
import { ModalEvidenciaComponent } from '../modal-evidencia/modal-evidencia.component';

@Component({
  selector: 'vex-layout-evidencia',
  templateUrl: './layout-evidencia.component.html',
  styleUrls: ['./layout-evidencia.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutEvidenciaComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  suscriptionSolicitud: Subscription;
  solitidud: Partial<Solicitud>

  displayedColumns: string[] = [
    'descripcion',
    'archivo',
    'acciones'
  ];

  serviceTable(filtro: any) {
    filtro.codigo = 'TA10';
    return this.evidenciaService.buscarEvidencias(filtro);
  }

  obtenerFiltro() {
    return {
      solicitudUuid: this.solitidud.solicitudUuid
    };
  }

  constructor(
    private dialog: MatDialog,
    private solicitudService: SolicitudService,
    private evidenciaService: EvidenciaService,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  private suscribirSolicitud() {
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      if (sol?.solicitudUuid) {
        this.solitidud = sol;
        this.cargarTabla();
      }
    });
  }

  agregarEvidencia() {
    this.dialog.open(ModalEvidenciaComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        accion: 'add'
      },
    }).afterClosed().subscribe(() => {
      this.cargarTablaInit();
    });
  }

  actualizarVer(obj, action) {
    this.dialog.open(ModalEvidenciaComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        accion: action,
        evidencia: obj
      },
    }).afterClosed().subscribe(() => {
      this.cargarTablaInit();
    });
  }

  eliminarEvidencia(obj) {
    functionsAlert.questionSiNo('¿Seguro que desea eliminar la evidencia?').then((result) => {
      if (result.isConfirmed) {
        this.evidenciaService.eliminar(obj.idArchivo).subscribe(sol => {
          functionsAlert.success('Evidencia Eliminada').then((result) => {
            this.cargarTabla();
          });
        });
      }
    });
  }

  descargarArchivo(adj) {
    let nombreAdjunto = adj.nombre != null ? adj.nombre : adj.nombreReal
    this.adjuntoService.descargarWindowsJWT(adj.codigo, nombreAdjunto);
  }
}
