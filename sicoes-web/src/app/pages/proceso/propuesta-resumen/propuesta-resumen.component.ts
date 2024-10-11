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
import { PropuestaService } from 'src/app/service/propuesta.service';
import { PropuestaTecnicaService } from 'src/app/service/propuesta-tecnica.service';
import { InvitacionService } from 'src/app/service/invitacion.service';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { ProcesoItemAddService } from '../proceso-item-add.service';

@Component({
  selector: 'vex-propuesta-resumen',
  templateUrl: './propuesta-resumen.component.html',
  styleUrls: ['./propuesta-resumen.component.scss'],
  animations: [ 
    fadeInUp400ms,
    stagger80ms
  ]
})

export class PropuestaResumenComponent extends BaseComponent implements OnInit {
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
  cantidadElementos: number;
  isDesktop$ = this.layoutService.isDesktop$;
  displayedColumnsProfesionalesInvitados: string[] = ['perfil', 'nombre', 'estado'];
  displayedColumnsPropuestaTecnica: string[] = ['archivo', 'descripcion'];
  displayedColumnsPropuestaEconomica: string[] = ['archivo', 'descripcion'];
  dataProfesionalesInvitados:any;
  dataArchivosPropuestaTecnica:any;
  dataArchivosPropuestaEconomica:any;

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private procesoItemsService: ProcesoItemsService,
    private layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    private procesoItemAddService: ProcesoItemAddService,
    private propuestaService: PropuestaService,
    private propuestaTecnicaService: PropuestaTecnicaService,
    private invitacionService: InvitacionService,
    private activeRoute: ActivatedRoute,
    private adjuntoService: AdjuntosService
  ) {
    super();
    this.formGroup.disable();
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe(data => {
      this.bPresentarPropuesta = data.bPresentarPropuesta;
    })
    let propuestaUuid = this.activeRoute.snapshot.paramMap.get('propuestaUuid');
    if(propuestaUuid){
      this.propuestaService.obtenerPropuesta(propuestaUuid).subscribe( resp => {
        this.PROPUESTA = resp;
        this.PROCESO_ITEM = this.PROPUESTA.procesoItem;
        this.propuestaService.setPropuesta(this.PROPUESTA);
      })
    }
  }
}
