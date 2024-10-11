import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { InvitacionService } from 'src/app/service/invitacion.service';
import { MovimientoService } from 'src/app/service/movimiento.service';
import { ModalHistorialProfesionalComponent } from 'src/app/shared/modal-historial-profesional/modal-historial-profesional.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDesbloquearProfesionalComponent } from 'src/app/shared/modal-desbloquear-profesional/modal-desbloquear-profesional.component';

@Component({
  selector: 'vex-liberar-personal-list',
  templateUrl: './liberar-personal-list.component.html',
  styleUrls: ['./liberar-personal-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LiberarPersonalListComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_PROCESAR = 'ACC_PROCESAR';
  ACC_VER = 'ACC_VER';

  formGroup = this.fb.group({
    sector: [null as ListadoDetalle, Validators.required],
    subsector: [null as ListadoDetalle, Validators.required],
    ruc: [''],
    estado: [null],
    item: [''],
    nombreProceso: [''],
    //estadoItem: [null],
  });

  listEstado: any[]
  //listEstadoItem: any[]
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]

  displayedColumns: string[] = [
    'ruc',
    'profesional',
    'sector',
    'subsector',
    'estado',
    'proceso',
    'item',
    'postor',
    'perfil',
    'tipo',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private movimiento: MovimientoService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    //this.cargarTabla();
    this.formGroup.get('sector').valueChanges.subscribe(value => {
      this.onChangeSector(value)
    })
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ESTADO_SUP_PERFIL,
      //ListadoEnum.ESTADO_ITEM,
      ListadoEnum.SECTOR
    ]).subscribe(listRes => {
      this.listEstado = listRes[0]
      //this.listEstadoItem = listRes[1]
      this.listSector = listRes[1];
    })
  }

  serviceTable(filtro) {
    return this.movimiento.buscarMovimientos(filtro);
  }

  buscar() {
    if (!this.validar()) {
      return;
    }
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar() {
    this.formGroup.reset();
    this.paginator.pageIndex = 0;
    this.dataSource = null;
  }

  obtenerFiltro() {
    let filtro: any = {
      idSector: this.formGroup.controls.sector.value?.idListadoDetalle,
      idEstado: this.formGroup.controls.estado.value?.idListadoDetalle,
      //idEstadoItem: this.formGroup.controls.estadoItem.value?.idListadoDetalle,
      proceso: this.formGroup.controls.nombreProceso.value,
      idSubsector: this.formGroup.controls.subsector.value?.idListadoDetalle,
      item: this.formGroup.controls.item.value,
      codigoRuc:this.formGroup.controls.ruc.value
    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST, sol.idPropuestaProfesional, sol.propuesta.propuestaUuid]);
  }

  mostrarOpcion(opt, objSol) {
    if(opt == this.ACC_PROCESAR && objSol.estado?.codigo == SolicitudEstadoEnum.EN_PROCESO) return true;
    return false;
  }

  onChangeSector(obj) {
    if (!obj) return;
    this.formGroup.controls.subsector.setValue(null);

    this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, obj.idListadoDetalle).subscribe(res => {
      this.listSubSector = res
    });
  }

  public validar() {
    this.formGroup.markAllAsTouched();
    return this.formGroup.valid;
  }
  
  historial(movimiento){
    const filtro: any = {
      idSector: this.formGroup.controls.sector.value?.idListadoDetalle,
      idSubsector: this.formGroup.controls.subsector.value?.idListadoDetalle,
    }
    this.dialog.open(ModalHistorialProfesionalComponent, {
      width: '1000px',
      maxHeight: '100%',
      panelClass: 'sin-padding',
      data: {
        movimiento: movimiento,
        filtro: filtro,
        accion: 'view'
      },
    }).afterClosed().subscribe(() => {

    });
  }

  verBtn(row){
    return (row?.movimiento?.estado?.codigo === 'BLOQUEADO');
  }

  desbloquear(movimiento){
    this.dialog.open(ModalDesbloquearProfesionalComponent, {
      width: '1000px',
      maxHeight: '100%',
      panelClass: 'sin-padding',
      data: {
        movimiento: movimiento,
        accion: 'view'
      },
    }).afterClosed().subscribe(() => {
      this.buscar()      
    });
  }

  mostrarPostor(element){
    const codigoRucPostor = element.movimiento?.propuestaProfesional?.propuesta?.supervisora?.codigoRuc;
    const nombrePostor =  element.movimiento?.propuestaProfesional?.propuesta?.supervisora?.nombreRazonSocial;
    if(codigoRucPostor && nombrePostor){
      return codigoRucPostor + ' ' + nombrePostor;
    }
    return '';
  }
}
