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




@Component({
  selector: 'vex-datos-proceso-form',
  templateUrl: './datos-proceso-form.component.html',
  styleUrls: ['./datos-proceso-form.component.scss'],
  animations: [ 
    fadeInUp400ms,
    stagger80ms
  ]
})

export class DatosProcesoFormComponent extends BaseComponent implements OnInit, OnDestroy {

  suscriptionProcesoItem: Subscription;
  suscriptionPropuesta: Subscription;

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$; 
  @Input() PROCESO_ITEM: any;
  PROPUESTA

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

  listEstado: any[]
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]

  isDesktop$ = this.layoutService.isDesktop$;

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private procesoItemsService: ProcesoItemsService,
    private layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    private procesoItemAddService: ProcesoItemAddService,
    private propuestaService: PropuestaService
  ) {
    super();
    this.formGroup.disable();
  }

  ngOnInit(): void {
    this.suscribirProcesoItemService();
  }

  ngOnDestroy() {
    this.suscriptionProcesoItem.unsubscribe();
    this.suscriptionPropuesta.unsubscribe();
  }

  private suscribirProcesoItemService(){
    this.suscriptionProcesoItem = this.procesoItemsService.suscribeProcesoItem().subscribe(sol => {
      if(sol){
        this.PROCESO_ITEM = sol;
        this.setValues();
      }
    });
    this.suscriptionPropuesta = this.propuestaService.suscribePropuesta().subscribe(pro => {
      if(pro?.procesoItem){
        this.PROPUESTA = pro;
        this.PROCESO_ITEM = pro.procesoItem;
        this.setValues();
      }
      
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.PROCESO_ITEM){
      this.setValues();
    }
  }

  displayedColumns: string[] = ['nombre', 'fechaInicio', 'fechaFin'];
  displayedColumns2: string[] = ['perfil', 'cantidad'];
  dataSource:any;
  datosPerfiles:any;

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
    this.formGroup.controls.montoReferencial.setValue(this.PROCESO_ITEM.montoReferencial),
    this.formGroup.controls.montoTipoCambio.setValue(this.PROCESO_ITEM.montoTipoCambio),
    this.formGroup.controls.montoReferencialSoles.setValue(this.PROCESO_ITEM.montoReferencialSoles),
    this.formGroup.controls.facturacionMinima.setValue(this.PROCESO_ITEM.facturacionMinima),
    this.formGroup.controls.estadoItem.setValue(this.PROCESO_ITEM.estado.nombre)
    this.formGroup.controls.descripcionItem.setValue(this.PROCESO_ITEM.descripcionItem)
    
    const valores = [
      {'nombre':this.PROCESO_ITEM.etapa?.etapa?.nombre, 'fechaInicio':this.PROCESO_ITEM.etapa?.fechaInicio, 'fechaFin':this.PROCESO_ITEM.etapa?.fechaFin}
    ];
    this.dataSource = valores;
    this.datosPerfiles = this.PROCESO_ITEM?.listProcesoItemPerfil;
  }

  openDrawer() {
    this.procesoItemAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  cancelar(){
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
  }

  registrarPropuesta(next: boolean){
    let obj={
      procesoItem:{
        procesoItemUuid:this.PROCESO_ITEM.procesoItemUuid,
        idProcesoItem:this.PROCESO_ITEM.idProcesoItem
      }  
    }
    if(this.PROCESO_ITEM.propuesta){
      this.propuestaService.obtenerPropuesta(this.PROCESO_ITEM.propuesta?.propuestaUuid).subscribe( resp => {
        this.PROPUESTA = resp;
        this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid]);
      });
    }else{
      this.propuestaService.registrarPropuesta(obj).subscribe( resp => {
        this.PROPUESTA = resp;
        this.PROCESO_ITEM = this.PROPUESTA.procesoItem
        //this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid]);
        if(next){
          this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid, 'propuesta-tecnica']);
        }else{
          this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST]);
        }
      });
    }
  }

  siguiente(){
    this.router.navigate([Link.EXTRANET, Link.PROCESOS_LIST, Link.PROCESOS_PROPUESTA, this.PROPUESTA.propuestaUuid, 'propuesta-tecnica']);
  }

}
