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
import { ModalEmpresaConsorcio } from 'src/app/shared/modal-empresa-consorcio/modal-empresa-consorcio.component';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { PropuestaConsorcioService } from 'src/app/service/propuesta-consorcio.service';

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

  isEmpresaConsorcio: number;
  isDisabledAddCompany = false;
  displayedColumnsCompany: string[] = [
    'empresa',
    'ruc',
    'facturacion',
    'participacion',
    'acciones'
  ];
  datosEmpresas:any[];
  participacionTotal: number;
  facturacionTotal: number;
  facturacionMinima: number;

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
    private adjuntoService: AdjuntosService,
    private supervisoraService:SupervisoraService,
    private propuestaConsorcioService: PropuestaConsorcioService
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
        this.facturacionMinima = pro.procesoItem.facturacionMinima;
        this.obtenerInformacionConsorcio(pro.propuestaTecnica?.idPropuestaTecnica, pro.procesoItem.proceso.sector.idListadoDetalle);
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

  openModalEmpresaConsorcio() {
    //Obtener listado de empresas (655 persona juridica, 678 persona natural postor)
    this.propuestaConsorcioService.obtenerEmpresasSupervisoraSector(this.PROPUESTA.procesoItem.proceso.sector.idListadoDetalle).subscribe(res => {
      this.dialog.open(ModalEmpresaConsorcio, {
        width: '800px',
        maxHeight: '100%',
        data: {
          empresas: res,
          propuestaTecnica: this.PROPUESTA.propuestaTecnica,
          supervisora: this.PROPUESTA.supervisora,
          primerRegistro: !this.isDisabledAddCompany,
          sector: this.PROPUESTA.procesoItem.proceso.sector.idListadoDetalle
        },
      }).afterClosed().subscribe(() => {
        this.isDisabledAddCompany = true;
        this.obtenerInformacionConsorcio(this.PROPUESTA.propuestaTecnica?.idPropuestaTecnica, this.PROPUESTA.procesoItem.proceso.sector.idListadoDetalle);
      });
    })
  }

  obtenerInformacionConsorcio(idPropuestaTecnica, idSector) {
    this.propuestaConsorcioService.obtenerEmpresasConsorcio(idPropuestaTecnica, idSector).subscribe(res => {
      if (res.length > 0) {
        this.facturacionTotal = 0;
        this.participacionTotal = 0;
        this.datosEmpresas = res;
        
        for (let i = 0; i < this.datosEmpresas.length; i++) {
          this.facturacionTotal = this.facturacionTotal + this.datosEmpresas[i].facturacion;
          this.participacionTotal = this.participacionTotal + this.datosEmpresas[i].participacion;
        }

        this.isDisabledAddCompany = true;
      }
    });
  }

  agregarEmpresaConsorcio() {
    
    if (this.isEmpresaConsorcio == 128) { //SI
      this.openModalEmpresaConsorcio();
    }
    else if (this.isEmpresaConsorcio == 129) { //NO
      
    }
  }

  verificarParticipacion() {

    if (this.datosEmpresas[0].participacion != 0 && this.datosEmpresas[0].participacion < 50) {
      functionsAlert.error("La participación de la empresa debe ser mayor o igual al 50%").then(res => {
        this.datosEmpresas[0].participacion = 0;
        this.calcularParticipacionTotal();
      });
    }
    else {
      this.calcularParticipacionTotal();
    }
  }

  eliminarMiembroConsorcio(element: any) {
  functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar este miembro del consorcio?').then((result) => {
    if (result.isConfirmed) {
      // Llamar al servicio para eliminar la empresa en el backend
      this.propuestaConsorcioService.eliminarEmpresaConsorcio(element.idPropuestaConsorcio).subscribe(() => {
        // Actualizar el frontend eliminando la empresa de la tabla
        this.datosEmpresas = this.datosEmpresas.filter(emp => emp !== element);

        // Recalcular la facturación total y la participación total
        this.facturacionTotal = this.datosEmpresas.reduce((acc, curr) => acc + curr.facturacion, 0);
        this.calcularParticipacionTotal();

        // Mostrar mensaje de éxito
        functionsAlertMod2.success('Miembro del consorcio eliminado correctamente');
      }, (error) => {
        // Mostrar mensaje de error en caso de fallo
        functionsAlert.error('Error al eliminar el miembro del consorcio. Inténtelo de nuevo.');
      });
    }
  });
}


  calcularParticipacionTotal() {

    let checkParticipacionNula = false;
    this.participacionTotal = 0;

    for (let i = 0; i < this.datosEmpresas.length; i++) {
      this.participacionTotal = this.participacionTotal + this.datosEmpresas[i].participacion;

      if (this.datosEmpresas[i].participacion == 0) checkParticipacionNula = true;
    }
    
    if (this.participacionTotal > 100) {
      functionsAlert.error("La participación total ingresada es mayor al 100%").then(res => {

      });
    }
    else if (this.participacionTotal == 100) {
      if (checkParticipacionNula) {
        functionsAlert.error("Ingrese la participación de todas las empresas.").then(res => {

        });
      }
      else {
        functionsAlert.info("La participación total es igual a 100%").then(res => {
          
        });
      }
    }
  }

  registrarParticipacion() {

    if (this.facturacionTotal >= this.facturacionMinima) {
      if (this.participacionTotal == 100) {
        this.propuestaConsorcioService.registrarParticipacion(this.datosEmpresas).subscribe(res => {
          if (res) {
            functionsAlert.success("Participación Registrada..");
          }
          else {
            functionsAlert.error("Error al registrar la participación");
          }
        });
      }
      else {
        functionsAlert.error("Verifique las participaciones de cada empresa");
      }
    }
    else {
      functionsAlert.error("La facturación total del consorcio es menor a la facturación mínima de: S/ " + this.facturacionMinima).then(res => {

      });
    }
  }
}
