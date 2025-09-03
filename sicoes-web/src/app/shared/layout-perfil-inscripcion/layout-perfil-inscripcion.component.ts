import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of, Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { PerfilService } from 'src/app/service/perfil.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from '../components/base-page.component';
import { ModalPerfilComponent } from '../modal-perfil/modal-perfil.component';
import { ModalPerfilAsignacionComponent } from '../modal-perfil-asignacion/modal-perfil-asignacion.component';
import { UsuarioService } from 'src/app/service/usuario.service';
import { CmpPerfilComponent } from '../cmp-perfil/cmp-perfil.component';

@Component({
  selector: 'vex-layout-perfil-inscripcion',
  templateUrl: './layout-perfil-inscripcion.component.html',
  styleUrls: ['./layout-perfil-inscripcion.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutPerfilInscripcionComponent extends BasePageComponent<any> implements OnInit, OnDestroy, OnChanges {

  suscriptionSolicitud: Subscription;
  solitidud: Partial<Solicitud>
  sector: any
  @Input() ES_PERS_NAT: boolean = true
  @ViewChild(CmpPerfilComponent) cmpPerfil: CmpPerfilComponent;

  displayedColumns: string[] = [];

  serviceTable(filtro: any) {
    return this.perfilService.buscarPerfiles(filtro);
  }

  obtenerFiltro() {
    return {
      solicitudUuid: this.solitidud?.solicitudUuid
    };
  }

  constructor(
    private dialog: MatDialog,
    private solicitudService: SolicitudService,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ES_PERS_NAT == false) {
      this.displayedColumns = [
        'sector',
        'subSector',
        'acciones'
      ];
    }
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.actualizarColumnas();
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  private suscribirSolicitud() {
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      this.solitidud = sol;
      if (this.solitidud?.solicitudUuid) {
        this.cargarTabla();
      }
    });
  }

  private actualizarColumnas() {
    let tipoUser = this.usuarioService.getTipoUser();
    console.log("tipoUser -->",  tipoUser);

    if (tipoUser == "Externo") {
      this.displayedColumns = [
        'sector',
        'subSector',
        'actividad',
        'unidad',
        'categoria',
        'perfil',
        'division',
        'areaSubCategoria',
        'fechaAsignacion',
        'acciones'
      ];
    }
    else {
      this.displayedColumns = [
        'sector',
        'subSector',
        'actividad',
        'unidad',
        'categoria',
        'perfil',
        'division',
        'areaSubCategoria',
        'evaluador',
        'fechaAsignacion',
        'acciones'
      ];
    }
  }

  getDivisionCode(codigo: string): string {
    return codigo ? codigo.split('_')[0] : '';
  }

  agregarPerfil() {
      if(this.dataSource.data.length>0) {
        this.sector = this.dataSource.data[0].sector;
      }else{
        this.sector = null;
      }

    this.dialog.open(ModalPerfilComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        accion: 'add',
        esPersonaNat: this.ES_PERS_NAT,
        sector: this.sector
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();

      
    });
  }

  actualizarVer(obj, action) {
    this.dialog.open(ModalPerfilComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        accion: action,
        perfil: obj,
        esPersonaNat: this.ES_PERS_NAT
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  eliminarPerfil(obj) {
    functionsAlert.questionSiNo('¿Seguro que desea eliminar el registro?').then((result) => {
      if (result.isConfirmed) {
        this.perfilService.eliminar(obj.idOtroRequisito).subscribe(sol => {
          functionsAlert.success('Registro Eliminado').then((result) => {
            this.cargarTabla();
    setTimeout(() => {
      const hayPerfiles = this.itemsTable?.length > 0;
      const quedanDelGrupo = this.itemsTable?.some(p => p.grupo === obj.grupo);

      if (!hayPerfiles || !quedanDelGrupo) {
        this.cmpPerfil?.recargarFiltros(); 
      }
      if(!hayPerfiles){
                const formValues = this.obtenerDatos();
                this.solicitudService.actualizarBorradorPN(formValues).subscribe();
              this.cmpPerfil?.recargarFiltros();
              }
    }, 800); 
          });
        });
      }
    });
  }

  obtenerDatos() {
    let profesion = null
    let division = null
    let formValues: any = {
    ...this.solitidud,
      profesion: profesion,
      division: division,
    }

    return formValues;
  }

  asignarPerfil(obj) {
    this.dialog.open(ModalPerfilAsignacionComponent, {
      width: '600px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        //accion: action,
        perfil: obj,
        esPersonaNat: this.ES_PERS_NAT
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  registrarRevertirEvaluacion(obj) {
    functionsAlert.questionSiNo('¿Aprobar la solicitud de revertir evaluación?').then((result) => {
      if (result.isConfirmed) {
        this.perfilService.aprobarRevertirEvaluacion(obj).subscribe(sol => {
          functionsAlert.success('Solicitud para revertir evaluación aprobada').then((result) => {
            this.cargarTabla();
          });
        });
      } else {
        this.perfilService.rechazarRevertirEvaluacion(obj).subscribe(sol => {
          functionsAlert.success('Solicitud para revertir evaluación rechazada').then((result) => {
            this.cargarTabla();
          });
        });
      }
    });
  }

  actualizarEvaluador(obj,action){
    this.dialog.open(ModalPerfilAsignacionComponent, {
      width: '600px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        accion: action,
        perfil: obj,
        esPersonaNat: this.ES_PERS_NAT
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

}
