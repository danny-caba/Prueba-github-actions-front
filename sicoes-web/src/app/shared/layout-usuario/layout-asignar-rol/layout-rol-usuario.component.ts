import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges, Input } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';;
import { EstadoProcesoEnum, ListadoEnum } from 'src/helpers/constantes.components';
import { BaseComponent } from '../../components/base.component';
import { PidoService } from 'src/app/service/pido.service';
import { Areas } from 'src/app/interface/pido.model';
import { functions } from 'src/helpers/functions';
import { ProcesoAddService } from 'src/app/pages/proceso-intranet/proceso-add.service';
import { LayoutService } from 'src/@vex/services/layout.service';
import { Link } from 'src/helpers/internal-urls.components';
import { ActivatedRoute, Router } from '@angular/router';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ProcesoService } from 'src/app/service/proceso.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { createMask } from '@ngneat/input-mask';
import { ModalInfoNroProcesoComponent } from '../../modal-info-nro-proceso/modal-info-nro-proceso.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'vex-layout-rol-usuario',
  templateUrl: './layout-rol-usuario.component.html',
  styleUrls: ['./layout-rol-usuario.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutRolUsuarioComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() PROCESO: any;
  @Input() editable: boolean = false;
  suscriptionProceso: Subscription;

  IS_NUEVO = false;
  bAdd = false;
  bEdit = false;
  bView = false;

  displayedColumns: string[] = [
    'nombreCompleto',
    'nombreUsuario',
    'roles',
    'estado',
    'habilitar/deshabilitar',
    'acciones'
  ];

  listTipoDocumento: any[] = []
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  listEstado: ListadoDetalle[]
  listTipoFacturacion: ListadoDetalle[]
  listAreas: Areas[]

  filteredStatesTecnico$: Observable<any[]>;

  formGroup = this.fb.group({
    numeroProceso: ['', Validators.required],
    nombreProceso: ['', Validators.required],
    numeroExpediente: ['', Validators.required],
    unidad: [null as Areas, Validators.required],
    sector: [null as ListadoDetalle, Validators.required],
    subsector: [null as ListadoDetalle, Validators.required],
    estado: [ null as ListadoDetalle ],
    tipoFacturacion: [null as ListadoDetalle, Validators.required],
  });

  isDesktop$ = this.layoutService.isDesktop$;

  //(nnn-yyyy-OSINERGMIN-DIV/GER-NN), nnn correlativo, yyyy año, DIV/GER Siglas, NN Número de convocatoria en arábigo. OSINERGMIN-DIV/GER
  //osiInputMask = createMask('999-9999-OSINERGMIN-DIV/GER-99{1,3}');

  osiInputMask = createMask<string>({
    alias: '999-9999-OSINERGMIN-DIV/GER-**',
    //regex: "",
    placeholder: 'nnn-yyyy-OSINERGMIN-DIV/GER-NN',
    parser: (value: string) => {
      let values = value.split('-');
      let anio = values[1]
      //console.info(anio);
      
      return value;
    },
  });

  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private activeRoute: ActivatedRoute,
    private procesoAddService: ProcesoAddService,
    private layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private procesoService: ProcesoService,
    private dialog: MatDialog,
    private pidoService: PidoService) {
    super();

  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe(data => {
      this.IS_NUEVO = data.bAdd;
      this.bAdd = data.bAdd;
      this.bEdit = data.bEdit;
      this.bView = data.bView;
    })

    this.cargarCombo();
    this.formGroup.get('sector').valueChanges.subscribe(value => {
      this.onChangeSector(value)
    })
    this.suscribirSolicitud();

    if(this.bView){
      this.formGroup.disable();
    }
  }

  private suscribirSolicitud(){
    this.suscriptionProceso = this.procesoService.suscribeSolicitud().subscribe(sol => {
      this.PROCESO = sol;
      let defaultValueObj:any;
      if(this.PROCESO){
        this.setValues();
        if(this.PROCESO.estado.codigo == EstadoProcesoEnum.EN_ELABORACION){
          this.formGroup.controls.estado.disable(); 
        }else{
          this.formGroup.disable();
          if(this.bEdit == true){
            this.formGroup.controls.estado.enable();
          } 
        }
      }else{
        this.formGroup.reset()
        defaultValueObj = this.listEstado.find(obj => obj.codigo == EstadoProcesoEnum.EN_ELABORACION);
        if (defaultValueObj) {
          this.formGroup.controls.estado.setValue(defaultValueObj);
          this.formGroup.controls.estado.disable(); 
        }
      }
    });
  }

  ngOnDestroy() {
    this.suscriptionProceso.unsubscribe();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.SECTOR,
      ListadoEnum.ESTADO_PROCESO,
      ListadoEnum.TIPO_FACTURACION
    ]).subscribe(listRes => {
      this.listSector = listRes[0];
      this.listEstado = listRes[1];
      this.listTipoFacturacion = listRes[2];
    })
    this.pidoService.listarAreas().subscribe(
      res=>{
        this.listAreas = res;
        this.filteredStatesTecnico$ = this.formGroup.controls.unidad.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.nombreUnidad),
          map(state => state ? this.filterStatesTec(state) : this.listAreas.slice())
        );

        if(functions.noEsVacio(this.PROCESO)){
          let unidad = this.listAreas.find(u => u.idUnidad == this.PROCESO.codigoArea);
          this.formGroup.controls.unidad.setValue(unidad);
        }
      }
    )
  }

  public getFormValues() {
    let obj:any = this.formGroup.getRawValue();
    obj.codigoArea =this.formGroup.controls.unidad.value.idUnidad;
    obj.nombreArea =this.formGroup.controls.unidad.value.nombreUnidad;
    return obj;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.PROCESO) {
      this.setValues();
    }
  }

  setValues() {
    this.formGroup.patchValue(this.PROCESO)
  }

  onChangeSector(obj) {
    if (!obj) return;
    this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, obj.idListadoDetalle).subscribe(res => {
      this.listSubSector = res
    });
  }

  public validar() {
    this.formGroup.markAllAsTouched();
    return this.formGroup.valid;
  }

  openDrawer() {
    this.procesoAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }

  borrador(continuar: boolean){
    if (!this.validar()) {
      return;
    }
    functionsAlertMod2.preguntarSiNoIcono("¿Seguro que desea guardar proceso?'").then((result) => {
      if (result.isConfirmed) {
        let formValues = this.getFormValues();

        if(this.IS_NUEVO == true){
          this.procesoService.registrarBorrador(formValues).subscribe(obj => {
            functionsAlertMod2.success('Datos Guardados').then((result) => {
              if(continuar){
                this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, obj.procesoUuid, 'fecha']);
              }else{
                this.cancelar()
              }
            });
          });
        }else{
          this.procesoService.actualizarBorrador(formValues, this.PROCESO.procesoUuid).subscribe(obj => {
            this.procesoService.setSolicitud(obj);
            functionsAlertMod2.success('Datos Guardados').then((result) => {
              if(continuar){
                this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, obj.procesoUuid, 'fecha']);
              }else{
                this.cancelar()
              }
            });
          });
        }
      }
    });
  }

  filterStatesTec(nombreUsuario: string) {
    return this.listAreas.filter(state =>
      state.nombreUnidad?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.unidad.value instanceof Object)) {
        this.formGroup.controls.unidad.setValue(null);
        this.formGroup.controls.unidad.markAsTouched();
      }
    }, 200);
  }

  displayFn(codi: any): string {
    return codi && codi.nombreUnidad ? codi.nombreUnidad : '';
  }

  siguienteView(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, this.PROCESO.procesoUuid, 'fecha']);
  }

  openInfo(){
    this.dialog.open(ModalInfoNroProcesoComponent, {
      width: '400px',
      maxHeight: '100%',
    });
  }

  pegarSoloNumeros(event: any) {
    const pastedText = event.clipboardData.getData('text/plain');
    if (!(/^\d+$/.test(pastedText))) {
      event.preventDefault();
    }
  }
}
