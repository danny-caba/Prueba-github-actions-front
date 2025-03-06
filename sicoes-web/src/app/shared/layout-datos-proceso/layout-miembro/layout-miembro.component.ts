import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BasePageComponent } from '../../components/base-page.component';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoAddService } from 'src/app/pages/proceso-intranet/proceso-add.service';
import { ProcesoService } from 'src/app/service/proceso.service';
import { LayoutService } from 'src/@vex/services/layout.service';
import { ProcesoMiembtoService } from 'src/app/service/proceso-miembro.service';
import { CmpMiembroComponent } from '../../cmp-miembo/cmp-miembro.component';
import { ModalProcesoMiembroComponent } from '../../modal-proceso-miembro/modal-proceso-miembro.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { Solicitud } from 'src/app/interface/solicitud.model';

@Component({
  selector: 'vex-layout-miembro',
  templateUrl: './layout-miembro.component.html',
  styleUrls: ['./layout-miembro.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutMiemboComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  flagActivo: string | null = null;

  @ViewChild('cmpMiembroComponent', { static: false }) cmpMiembroComponent: CmpMiembroComponent;

  suscriptionProceso: Subscription;
  PROCESO: Partial<Proceso>
  solicitud: Partial<Solicitud>
  bAdd = false;
  bEdit = false;
  bView = false;

  displayedColumns: string[] = [
    'fechaAsignacion',
    'cargo',
    'nombreUsuario',
    'estadoMiembro',
    'estado'
  ];

  formGroup = this.fb.group({
    terminos: [false, Validators.required],
  });

  serviceTable(filtro: any) {
    return this.procesoMiembtoService.buscarProcesosMiembro(filtro);
  }

  obtenerFiltro() {
    return {
      procesoUuid: this.PROCESO?.procesoUuid
    };
  }
  isDesktop$ = this.layoutService.isDesktop$;
  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private procesoMiembtoService: ProcesoMiembtoService,
    private procesoAddService: ProcesoAddService,
    private cd: ChangeDetectorRef,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.activeRoute.data.subscribe(data => {
      this.bAdd = data.bAdd;
      this.bEdit = data.bEdit;
      this.bView = data.bView;
    })
  }

  ngOnDestroy() {
    this.suscriptionProceso.unsubscribe();
  }

  private suscribirSolicitud(){
    this.suscriptionProceso = this.procesoService.suscribeSolicitud().subscribe(sol => {
      this.PROCESO = sol;
      this.listArchivosMiembreProceso();
      if(this.PROCESO?.procesoUuid){
        this.cargarTabla();
      }
    });
  }

  eliminarMiembro(obj){
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea inactivar al miembro del comité?').then((result) => {
      if (result.isConfirmed) {
        this.procesoMiembtoService.inactivarProcesoMiembro(obj.idProcesoMiembro,this.PROCESO?.procesoUuid).subscribe(obj => {
          functionsAlertMod2.success('Datos Guardados').then((result) => {
            this.actualizarProceso();
          });
        });
      }
    });
  }

  actualizarMiembro(obj){
    this.dialog.open(ModalProcesoMiembroComponent, {
      width: '800px',
      maxHeight: '100%',
      panelClass: 'modal-editar-comite',
      data: {
        proceso: this.PROCESO,
        accion: 'edit',
        miembro: obj
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  openDrawer() {
    this.procesoAddService.drawerOpen.next(true);
    this.cd.markForCheck();
  }
  cancelar(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST]);
  }

  actualizarProceso(){
    this.procesoService.obtenerProceso(this.PROCESO.procesoUuid).subscribe( resp => {
      this.PROCESO = resp;
      this.procesoService.setSolicitud(resp);

    })
  }


  setValueChecked(event: any) {
    this.flagActivo = event.checked ? '1' : null;
  }
  contentArchivo:any = null
  listArchivosMiembreProceso(){
    let filter ={
      codigo:'TA23',
      idProceso:this.PROCESO.idProceso,
      size:100
    }
    this.procesoMiembtoService.buscarArchivosProcesoMiembro(filter).subscribe(res=>{
      this.contentArchivo = res.content[0]
    })
  }
  validarEdicion() {
    return true;
  }
  esValido() {

    return this.contentArchivo != null;

  }

  siguiente(){

    if(this.bView){
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, this.PROCESO.procesoUuid, 'items']);
    }else{
      this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_EDIT, this.PROCESO.procesoUuid, 'items']);
    }
  }

}
