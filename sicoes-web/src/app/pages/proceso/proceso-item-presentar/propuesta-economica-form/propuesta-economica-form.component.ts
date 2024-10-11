import { ChangeDetectorRef, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { EvidenciaService } from 'src/app/service/evidencia.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { FormBuilder, Validators } from "@angular/forms";
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ModalDocumentoEconomicoComponent } from 'src/app/shared/modal-documento-economico/modal-documento-economico.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ProcesoItemAddService } from '../../proceso-item-add.service';
import { LayoutService } from 'src/@vex/services/layout.service';
import { Link } from 'src/helpers/internal-urls.components';
import { Router } from '@angular/router';
import { PropuestaEconomicaService } from 'src/app/service/propuesta-economica.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-propuesta-economica-form',
  templateUrl: './propuesta-economica-form.component.html',
  styleUrls: ['./propuesta-economica-form.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class PropuestaEconomicaFormComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  suscriptionPropuesta: Subscription;

  solitidud: Partial<Solicitud>
  @Input() PROPUESTA: any;
  @Input() PROCESO_ITEM: any;

  displayedColumns: string[] = [
    'descripcion',
    'archivo',
    'acciones'
  ];

  serviceTable(filtro: any) {
    filtro.codigo = 'TA20';
    return this.propuestaService.buscarArchivosPropuestaEconomica(filtro);
  }

  obtenerFiltro() {
    return {
      propuestaUuid: this.PROPUESTA.propuestaUuid
    };
  }

  formGroup = this.fb.group({
    tipoMoneda: ["", Validators.required],
    importe: ["", [Validators.required, Validators.pattern("^[0-9]*\.?[0-9]*$")]],
  });
  isDesktop$ = this.layoutService.isDesktop$;
  constructor(
    private fb:FormBuilder,
    private dialog: MatDialog,
    private evidenciaService: EvidenciaService,
    private propuestaService: PropuestaService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private layoutService: LayoutService,
    private procesoItemAddService: ProcesoItemAddService,
    private propuestaEconomicaService: PropuestaEconomicaService,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup.get('tipoMoneda').disable();
    this.suscribirPropuestaService();
  }

  private suscribirPropuestaService(){
    this.suscriptionPropuesta = this.propuestaService.suscribePropuesta().subscribe(pro => {
      if(pro){
        this.PROPUESTA = pro;
        this.PROCESO_ITEM = pro.procesoItem;
        this.cargarTabla();
        this.formGroup.controls.tipoMoneda.setValue(this.PROCESO_ITEM.divisa.nombre);
        this.propuestaEconomicaService.obtenerPropuestaEconomica(this.PROPUESTA.propuestaEconomica?.idPropuestaEconomica, this.PROPUESTA.propuestaUuid).subscribe(propTec => {
          if(propTec?.importe){
            this.formGroup.controls.importe.setValue(propTec.importe + '')
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.suscriptionPropuesta.unsubscribe();
  }

  agregarDocumento() {
    this.dialog.open(ModalDocumentoEconomicoComponent, {
      width: '800px',
      maxHeight: '100%',
      data: {
        propuesta: this.PROPUESTA,
        accion: 'add'
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  actualizarVer(obj, action) {
    this.dialog.open(ModalDocumentoEconomicoComponent, {
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
  openDrawer() {
    this.procesoItemAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  cancelar(){
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
  }

  guardarPropuestaEconomica(continuar: boolean){

    let propEco = {
      propuestaUuid: this.PROPUESTA.propuestaUuid,
      importe: this.formGroup.controls.importe.getRawValue()
    }
    this.propuestaService.guardarPropuestaEconomica(propEco, this.PROPUESTA.propuestaEconomica?.idPropuestaEconomica).subscribe(sol => {
      functionsAlertMod2.success('Guardado').then((result) => {
        if(continuar){
          this.actualizarPropuesta();
          this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid, 'propuesta-resumen']);
        }else{
          this.cancelar()
        }
      });
    });
  }

  presentar(){
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid, 'propuesta-resumen']);
  }

  actualizarPropuesta(){
    this.propuestaService.obtenerPropuesta(this.PROPUESTA.propuestaUuid).subscribe( resp => {
      this.PROPUESTA = resp;
      this.propuestaService.setPropuesta(resp);
    })
  }
}
