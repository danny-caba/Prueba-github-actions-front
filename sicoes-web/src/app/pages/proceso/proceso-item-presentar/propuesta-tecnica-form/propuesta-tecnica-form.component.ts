import { ChangeDetectorRef, Component, OnDestroy, OnInit, Input,SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { EvidenciaService } from 'src/app/service/evidencia.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { ModalDocumentoTecnicoComponent } from 'src/app/shared/modal-documento-tecnico/modal-documento-tecnico.component';
import { ModalDocumentosInformativos } from 'src/app/shared/modal-documentos-informativos/modal-documentos-informativos.component';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { FormBuilder, Validators } from "@angular/forms";
import { ListadoEnum } from 'src/helpers/constantes.components';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { LayoutService } from 'src/@vex/services/layout.service';
import { PropuestaTecnicaService } from 'src/app/service/propuesta-tecnica.service';
import { ProcesoItemAddService } from '../../proceso-item-add.service';
import { Link } from 'src/helpers/internal-urls.components';
import { Router } from '@angular/router';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-propuesta-tecnica-form',
  templateUrl: './propuesta-tecnica-form.component.html',
  styleUrls: ['./propuesta-tecnica-form.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class PropuestaTecnicaFormComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  suscriptionPropuesta: Subscription;

  solitidud: Partial<Solicitud>
  @Input() PROPUESTA: any;
  @Input() PROCESO_ITEM: any;

  listConsorcio:any[]

  displayedColumns: string[] = [
    'descripcion',
    'archivo',
    'acciones'
  ];

  serviceTable(filtro: any) {
    filtro.codigo = 'TA19';
    return this.propuestaService.buscarArchivosPropuestaTecnica(filtro);
  }

  obtenerFiltro() {
    return {
      propuestaUuid: this.PROPUESTA.propuestaUuid
    };
  }


  formGroup = this.fb.group({
    consorcio: [null as any, Validators.required],
  });

  isDesktop$ = this.layoutService.isDesktop$;

  constructor(
    private fb:FormBuilder,
    private dialog: MatDialog,
    private evidenciaService: EvidenciaService,
    private propuestaTecnicaService: PropuestaTecnicaService,
    private propuestaService: PropuestaService,
    private parametriaService: ParametriaService,
    private router: Router,
    private layoutService: LayoutService,
    private procesoItemAddService: ProcesoItemAddService,
    private cd: ChangeDetectorRef,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.CUENTA_CONFORMIDAD,
    ]).subscribe(listRes => {
      this.listConsorcio=listRes[0]
    })
    this.suscribirPropuestaService();
  }

  private suscribirPropuestaService(){
    this.suscriptionPropuesta = this.propuestaService.suscribePropuesta().subscribe(pro => {
      if(pro){
        this.PROPUESTA = pro;
        this.cargarTabla();
        this.propuestaTecnicaService.obtenerPropuestaTecnica(this.PROPUESTA.propuestaTecnica?.idPropuestaTecnica, this.PROPUESTA.propuestaUuid).subscribe(propTec => {
          this.formGroup.controls.consorcio.setValue(propTec.consorcio?.idListadoDetalle);
        });
      }
    });
  }

  ngOnDestroy() {
    this.suscriptionPropuesta.unsubscribe();
  }

  agregarDocumento() {
    this.dialog.open(ModalDocumentoTecnicoComponent, {
      width: '800px',
      maxHeight: '100%',
      data: {
        propuesta: this.PROPUESTA,
        accion: 'add'
      },
    }).afterClosed().subscribe(result => {
      this.cargarTabla();
    });
  }

  actualizarVer(obj, action) {
    this.dialog.open(ModalDocumentoTecnicoComponent, {
      width: '800px',
      maxHeight: '100%',
      data: {
        propuesta: this.PROPUESTA,
        accion: action,
        evidencia: obj
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  verModalDocumentosInformativos() {
    this.dialog.open(ModalDocumentosInformativos, {
      width: '800px',
      maxHeight: '100%',
    });
  }

  eliminarDocumento(obj) {
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar el archivo?').then((result) => {
      if (result.isConfirmed) {
        this.evidenciaService.eliminar(obj.idArchivo).subscribe(sol => {
          functionsAlertMod2.success('Archivo Eliminado').then((result) => {
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

  cancelar(){
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
  }

  guardarPropuestaTecnica(continuar: boolean){
    let idConsorcio = this.formGroup.controls.consorcio.getRawValue();
    let consor = this.listConsorcio.find(x => x.idListadoDetalle == idConsorcio)

    let propTec = {
      propuestaUuid: this.PROPUESTA.propuestaUuid,
      consorcio: consor
    }
    this.propuestaTecnicaService.guardarPropuestaTecnica(propTec, this.PROPUESTA.propuestaTecnica?.idPropuestaTecnica).subscribe(sol => {
      functionsAlertMod2.success('Guardado').then((result) => {
        if(continuar){
          this.actualizarPropuesta();
          this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid, 'invitar-profesionales']);
        }else{
          this.cancelar()
        }
      });
    });
  }

  openDrawer() {
    this.procesoItemAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  actualizarPropuesta(){
    this.propuestaService.obtenerPropuesta(this.PROPUESTA.propuestaUuid).subscribe( resp => {
      this.PROPUESTA = resp;
      this.propuestaService.setPropuesta(resp);
    })
  }

}
