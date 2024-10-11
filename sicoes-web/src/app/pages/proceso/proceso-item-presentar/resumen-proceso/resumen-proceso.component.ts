import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/@vex/services/layout.service';
import { ProcesoItemAddService } from '../../proceso-item-add.service';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { PropuestaTecnicaService } from 'src/app/service/propuesta-tecnica.service';
import { InvitacionService } from 'src/app/service/invitacion.service';
import { Console } from 'console';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { Location } from '@angular/common';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { ProcesoService } from 'src/app/service/proceso.service';
import { ProcesoItemsPerfilService } from 'src/app/service/proceso-items-perfil.service';

import { functionsAlert } from 'src/helpers/functionsAlert';



@Component({
  selector: 'vex-resumen-proceso',
  templateUrl: './resumen-proceso.component.html',
  styleUrls: ['./resumen-proceso.component.scss'],
  animations: [ 
    fadeInUp400ms,
    stagger80ms
  ]
})

export class ResumenPropuestaComponent extends BaseComponent implements OnInit {
  suscriptionProcesoItem: Subscription;
  suscriptionPropuesta: Subscription;
  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$; 
  @Input() PROCESO_ITEM: any;
  PROPUESTA

  bPresentarPropuesta = true;

  formGroup = this.fb.group({
    numeroProceso: ['', Validators.required],
    nombreProceso: ['', Validators.required],
    numeroExpediente: ['', Validators.required],
    unidad: ['', Validators.required],
    sector: ['', Validators.required],
    subsector: ['', Validators.required],
    estado: ['', Validators.required],
    descripcionItem: ['', Validators.required],
    etapa: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    numeroItem: ['', Validators.required],
    divisa: ['', Validators.required],
    montoReferencial: ['', Validators.required],
    montoTipoCambio: ['', Validators.required],
    montoReferencialSoles: ['', Validators.required],
    facturacionMinima: ['', Validators.required],
    estadoItem: ['', Validators.required],
  
  });

  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  codigoDivisa: string;
  cantidadElementos: number = 0;
  isDesktop$ = this.layoutService.isDesktop$;
  displayedColumnsProfesionalesInvitados: string[] = ['perfil', 'nombre', 'estado'];
  displayedColumnsPropuestaTecnica: string[] = ['archivo', 'descripcion'];
  displayedColumnsPropuestaEconomica: string[] = ['archivo', 'descripcion'];
  dataProfesionalesInvitados:any = [];
  dataArchivosPropuestaTecnica:any;
  dataArchivosPropuestaEconomica:any;
  page: number = 0;
  pageInvitadosAceptados: number = 0;
  isCompleteInvitadosAceptados: boolean = false;
  cantidadElementosAceptados: number = 0;

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private procesoItemsService: ProcesoItemsService,
    private layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    private procesoItemAddService: ProcesoItemAddService,
    private procesoService: ProcesoService,
    private propuestaService: PropuestaService,
    private procesoItemsPerfilService: ProcesoItemsPerfilService,
    private propuestaTecnicaService: PropuestaTecnicaService,
    private invitacionService: InvitacionService,
    private activeRoute: ActivatedRoute,
    private adjuntoService: AdjuntosService,
    private _location: Location
  ) {
    super();
    this.formGroup.disable();
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe(data => {
      this.bPresentarPropuesta = data.bPresentarPropuesta;
    })
    this.suscribirProcesoItemService();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(this.PROCESO_ITEM){
      this.setValues();
    }
  }



  private suscribirProcesoItemService(){
    this.propuestaService.suscribePropuesta().subscribe(pro => {
      if(pro?.procesoItem){
        this.PROPUESTA = pro;
        this.PROCESO_ITEM = pro.procesoItem;
        let filtro = {
          codigo : 'TA19',
          propuestaUuid: this.PROPUESTA.propuestaUuid
        }
        this.propuestaService.buscarArchivosPropuestaTecnica(filtro).subscribe(archivos =>{
          this.dataArchivosPropuestaTecnica = archivos.content;
        });   
        filtro.codigo='TA20';
        this.propuestaService.buscarArchivosPropuestaEconomica(filtro).subscribe(archivos =>{
          this.dataArchivosPropuestaEconomica = archivos.content;
        });
        this.cargarProfesionalesInvitadosAceptados();
        this.propuestaService.obtenerPropuesta(this.PROPUESTA.propuestaUuid).subscribe(propuesta=>{
          this.PROPUESTA = propuesta;
          this.setValues();    
        });
        this.buscarItemsPerfilesProfesional();
      }
    });

  }

  setValues(){
    
    this.formGroup.controls.nombreProceso.setValue(this.PROCESO_ITEM.proceso?.nombreProceso),
    this.formGroup.controls.numeroProceso.setValue(this.PROCESO_ITEM.proceso?.numeroProceso),
    this.formGroup.controls.numeroExpediente.setValue(this.PROCESO_ITEM.proceso?.numeroExpediente),
    this.formGroup.controls.sector.setValue(this.PROCESO_ITEM.proceso?.sector.nombre),
    this.formGroup.controls.subsector.setValue(this.PROCESO_ITEM.proceso?.subsector.nombre),
    this.formGroup.controls.unidad.setValue(this.PROCESO_ITEM.proceso?.nombreArea),
    this.formGroup.controls.estado.setValue(this.PROCESO_ITEM.proceso?.estado.nombre),
    this.formGroup.controls.etapa.setValue(this.PROCESO_ITEM.etapa?.etapa?.nombre),
    this.formGroup.controls.fechaInicio.setValue(this.PROCESO_ITEM.etapa?.fechaInicio),
    this.formGroup.controls.fechaFin.setValue(this.PROCESO_ITEM.etapa?.fechaFin),
    this.formGroup.controls.numeroItem.setValue(this.PROCESO_ITEM.numeroItem),
    this.formGroup.controls.divisa.setValue(this.PROCESO_ITEM.divisa.nombre),
    this.codigoDivisa = this.PROCESO_ITEM.divisa.codigo,
    this.formGroup.controls.montoReferencial.setValue(this.PROCESO_ITEM.montoReferencial),
    this.formGroup.controls.montoTipoCambio.setValue(this.PROCESO_ITEM.montoTipoCambio),
    this.formGroup.controls.montoReferencialSoles.setValue(this.PROCESO_ITEM.montoReferencialSoles),
    this.formGroup.controls.facturacionMinima.setValue(this.PROCESO_ITEM.facturacionMinima),
    this.formGroup.controls.estadoItem.setValue(this.PROCESO_ITEM.estado.nombre)
    this.formGroup.controls.descripcionItem.setValue(this.PROCESO_ITEM.descripcionItem)
  }

  openDrawer() {
    this.procesoItemAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  cancelar(){
    //this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
    this._location.back();
  }

  registrarPropuesta(next: boolean){

  }

  salir(){

  }

  presentar(){
    //functionsAlertMod2.preguntarSiNoIcono('¿Está seguro de presentar su propuesta?<br>Considere que una vez confirmada, esta no podrá ser cambiada').then((result) =>{
    //  if(result.isConfirmed){
        this.validarPrePresetacionPropuesta();
    //  }
    //});  
  }

  validarPrePresetacionPropuesta(){
    let msjFinal = '¿Esta seguro de realizar la presentación de la propuesta? Una vez presentada la propuesta, no se podrá modificar.';

    this.procesoService.validarSancionVigente(this.PROPUESTA?.propuestaUuid).subscribe(res =>{
      if(!res){
        functionsAlert.vigente('No es posible realizar su registro.', 'Mantiene una sancion por parte del OSCE.').then((result) => {
        });
      }else{
    this.propuestaService.validaPropuesta(this.PROPUESTA?.propuestaUuid).subscribe(res =>{
      
      if(res?.length){
        msjFinal = res.join('\n') + '\n' + msjFinal; 
      }
    
      functionsAlertMod2.preguntarSiNoIcono(msjFinal).then((result) => {
        if(result.isConfirmed){
          this.presentarPropuesta();
        }
      });
          
        }); 
      }
    }); 


  }

  presentarPropuesta(){
    this.propuestaService.presentarPropuesta(this.PROPUESTA,this.PROPUESTA.propuestaUuid).subscribe(res =>{
      functionsAlertMod2.success('La propuesta fue presentada').then((result) => {
        this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
      });
    }); 
  }

  nombreProfesional(obj){
    return obj?.supervisora?.nombres + ' ' + obj?.supervisora?.apellidoPaterno + ' ' + obj?.supervisora?.apellidoMaterno;
  }

  descargarArchivo(adj){
    let nombreAdjunto = adj.nombre != null ? adj.nombre : adj.nombreReal
    this.adjuntoService.descargarWindowsJWT(adj.codigo, nombreAdjunto);
  }

  private cargarProfesionalesInvitadosAceptados() {
    this.propuestaService.buscarInvitacionesProfesionalesAceptados({'page': this.pageInvitadosAceptados},this.PROPUESTA?.propuestaUuid).subscribe(profesionales =>{
      profesionales.content.map(profesional => {
        this.dataProfesionalesInvitados.push(profesional);
      });

      if (
            profesionales.totalPages === this.pageInvitadosAceptados + 1 ||
            profesionales.totalPages === 0
        ) {
        this.isCompleteInvitadosAceptados = true;
        return;
      }

      this.pageInvitadosAceptados++;
      this.cargarProfesionalesInvitadosAceptados();
    });
  }

  private buscarItemsPerfilesProfesional() {
    let suma = this.cantidadElementos;
    this.procesoItemsPerfilService.buscarItemsPerfiles({'page': this.page}, this.PROCESO_ITEM?.procesoItemUuid).subscribe(listRes => {
     let listNroProfesionales = listRes.content.map(n=>n.nroProfesionales);
     listNroProfesionales.forEach(element =>
      suma += element
      );
      this.cantidadElementos = suma;
      if (
            listRes.totalPages === this.page + 1 ||
            listRes.totalPages === 0
      ) {
        return;
      }
      this.page++;
      this.buscarItemsPerfilesProfesional();
    })
  }
}
