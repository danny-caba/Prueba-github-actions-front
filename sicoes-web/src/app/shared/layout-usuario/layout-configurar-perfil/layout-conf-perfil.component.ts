import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges, Input, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { throws } from 'assert';
import { Division } from 'src/app/interface/division.model';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MatSort } from '@angular/material/sort';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'vex-layout-conf-perfil',
  templateUrl: './layout-conf-perfil.component.html',
  styleUrls: ['./layout-conf-perfil.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutConfPerfilComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() PROCESO: any;
  @Input() editable: boolean = false;
  suscriptionProceso: Subscription;

  IS_NUEVO = false;
  bAdd = false;
  bEdit = false;
  bView = false;
  displayedColumns: string[] = [
    'nombreSector',
    'nombreSubSector',
    'actividad',
    'unidad',
    'subcategoria',
    'perfil',
    'acciones'
  ];
  public role: string = '';
  totalElements: number;
  currentPage = 0; // Página actual
  pageSize = 5;   // Tamaño de página
  listTipoDocumento: any[] = []
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  listEstado: ListadoDetalle[]
  listTipoFacturacion: ListadoDetalle[]
  listAreas: Areas[]
  usuarioRoles:any[]
  filteredStatesTecnico$: Observable<any[]>;
  public dataSourcePerfil = new MatTableDataSource<any>();
  public dataSourceRol = new MatTableDataSource<any>();
  dataSourceRoles = new MatTableDataSource<any>();
  panelInformationPerfil = true;
  listDivision: Division[];
  listDivisionesUsuario: any;
  listAllPerfilesDetalle: any;

  formGroup = this.fb.group({
    usuario: ['', Validators.required],
    roles: ['', Validators.required],
    selectedPerfil: ['' as any],
    selectedDivision: [''],
  });
  idUsuario:number;
  idRol:number;
  rolNombre:string;
  isDesktop$ = this.layoutService.isDesktop$;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSourceRoles.sort = this.sort;

    this.dataSourceRoles.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'nombreSector': return item.sector?.nombre?.toLowerCase() || '';
        case 'nombreSubSector': return item.subsector?.nombre?.toLowerCase() || '';
        case 'actividad': return item.actividad?.nombre?.toLowerCase() || '';
        case 'unidad': return item.unidad?.nombre?.toLowerCase() || '';
        case 'subcategoria': return item.subCategoria?.nombre?.toLowerCase() || '';
        case 'perfil': return item.perfil?.nombre?.toLowerCase() || '';
        default:
          return item[property];
      }
    }
  }

opciones: string[] = ["SI", "NO"];
  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private activeRoute: ActivatedRoute,
    private procesoAddService: ProcesoAddService,
    private layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private gestioUsuarioService: GestionUsuarioService) {
    super();
  }

  ngOnInit(): void {
    this.listarPerfiles();
    this.listarRoles();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    this.idUsuario = userData.idUsuario;
    this.formGroup.get('usuario').setValue(userData.nombreUsuario);

    const rolesData = JSON.parse(sessionStorage.getItem('rolesData'));
    this.usuarioRoles = rolesData;
    const rolesNombres = rolesData.map(role => role.rol?.nombre).join(', ');
    this.formGroup.get('roles').setValue(rolesNombres);

    this.obtenerPerfiles();
    this.obtenerDivisiones();
    this.obtenerDivisionesPorUsuario();
  }
  public listarPerfiles(): void {

    this.gestioUsuarioService.listarPerfilesDetalle()
      .subscribe(respuesta => {
        this.dataSourcePerfil.data = respuesta;
        this.listAllPerfilesDetalle = this.dataSourcePerfil.data;
        this.setListPerfilesDetalle(this.listAllPerfilesDetalle);
      });
  }

  setListPerfilesDetalle(list: any) {
    this.filteredStatesTecnico$ = this.formGroup.controls.selectedPerfil.valueChanges.pipe(
      startWith(''),
      map((value: any) => typeof value === 'string' ? value : value?.detalle),
      map(state => state ? this.filterStatesTec(state) : list.slice())
    );
  }

  filterStatesTec(nombreUsuario: string) {
    return this.dataSourcePerfil.data.filter(state =>
      state.detalle?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >=
      0);
  }

  private obtenerDivisiones() {
    this.parametriaService.listarDivisiones().subscribe(
      (response) => {
        this.listDivision = response || [];
      }
    );
  }

  private obtenerDivisionesPorUsuario() {
    this.parametriaService.listarDivisionesPorUsuario(this.idUsuario).subscribe(
      (response) => {
        this.listDivisionesUsuario = response || [];
      }
    );
  } 

  public listarRoles(): void {

    this.gestioUsuarioService.listarRoles()
      .subscribe(respuesta => {
        this.dataSourceRol.data = respuesta.content;

      });
  }
  ngOnChanges(changes: SimpleChanges) {

  }

  setValues() {

  }

  onChangeSector(obj) {

  }

  public obtenerPerfiles() {
    this.gestioUsuarioService.obtenerPerfiles(this.currentPage, this.pageSize,this.idUsuario)
      .subscribe(respuesta => {
        this.dataSourceRoles.data = respuesta.lista;
        this.totalElements = respuesta.totalRegistros;
      });
  }

  public obtenerPerfilRolesUsuario(event: any): void {
    console.log("obtener perfil");
    this.idRol = event.value;
    const roleSeleccionado = this.usuarioRoles.find(role => role.rol?.idRol === this.idRol);
    const nombreRole = roleSeleccionado ? roleSeleccionado.nombre : '';
    this.rolNombre = nombreRole;
    this.gestioUsuarioService.obtenerPerfilRolUsuarios(this.currentPage, this.pageSize,this.idUsuario,this.idRol)
      .subscribe(respuesta => {
        this.dataSourceRoles.data = respuesta.lista;
        this.totalElements = respuesta.totalRegistros;
        this.paginator.firstPage();
      });
  }

  public obtenerPerfilRolesUsuarioResponse(idRol: any): void {
    const roleSeleccionado = this.usuarioRoles.find(role => role.rol?.idRol === idRol);
    const nombreRole = roleSeleccionado ? roleSeleccionado.nombre : '';
    this.rolNombre = nombreRole;
    console.log("Nombre del radio button:", nombreRole);
    this.gestioUsuarioService.obtenerPerfilRolUsuarios(this.currentPage, this.pageSize,this.idUsuario,idRol)
      .subscribe(respuesta => {
        this.dataSourceRoles.data = respuesta.lista;
        this.totalElements = respuesta.totalRegistros;
      });
  }

  agregarPerfilRolUsuario() {
    //if(this.idRol != undefined){
      const selectedPerfilRolId = this.formGroup.get('selectedPerfil').value;
      const idDivision = this.formGroup.get('selectedDivision').value;
      if(!this.validarSeleccion()){
        // const countPerfil = this.dataSourceRoles.data.filter(element => element.perfil.idListadoDetalle === selectedPerfilRoleId).length;
        // if (countPerfil < 1) {
            const request = {
              usuario: {
                idUsuario: this.idUsuario,
              },
              division: {
                idDivision,
              },
              perfil: {
                idListadoDetalle: selectedPerfilRolId?.idListadoDetalle,
              },
              idUsuarioRolC: this.idRol,
            };
            this.realizarAsignacion(request);
        // } else {
        //   functionsAlertMod2.warningMensage('El perfil ya se encuentra asignado al usuario ' + this.formGroup.get('usuario').value).then((result) => {
        //   });
        // }


      }else{
        functionsAlertMod2.alertArribaDerrecha('Seleccione un perfil o una división');
        return;
      }
    //}else{
    //  functionsAlertMod2.alertArribaDerrecha('Seleccione un rol');
    //  return;
    //}


  }
  realizarAsignacion(request: any) {
    // console.log(request);
    // return
    this.gestioUsuarioService.asignarPerfilRolUsuario(request).subscribe(
      (response) => {
        const { existentes, nuevas } = response[0];
        const existentesStr = existentes.map((conf) => conf.perfil.nombre).join(', ');
        const nuevasStr = nuevas.map((conf) => conf.perfil.nombre).join(', ');

        if (existentes.length > 0 && nuevas.length < 1) {
          functionsAlertMod2.warningMensage('No se registró ningún perfil, porque los perfiles <span class="font-normal text-sm">' + existentesStr + '</span> ya se encuentran asignados');
        } else if (existentes.length > 0 && nuevas.length > 0) {
          functionsAlertMod2.successButtonDistinto('Perfiles registrados exitosamente, excepto los perfiles <span class="font-normal text-sm">' + existentesStr + '</span> porque ya se encuentran asignados', 'Aceptar').then((result) => {
            this.obtenerPerfiles();
            this.obtenerDivisionesPorUsuario();
          });
        } else if (existentes.length < 1 && nuevas.length > 0) {
          functionsAlertMod2.successButtonDistinto('Perfiles asignados exitosamente', 'Aceptar').then((result) => {
            this.obtenerPerfiles();
            this.obtenerDivisionesPorUsuario();
          });
        } else {
          functionsAlertMod2.warningMensage('No se asignaron perfiles, comuníquese con el administrador');
        }
        
        // functionsAlertMod2.success('Perfil asignado exitosamente').then((result) => {
        //   if (response.idUsuarioRolC!=null) {
        //     this.obtenerPerfilRolesUsuarioResponse(response.idUsuarioRolC);
        //   }else{
        //     this.obtenerPerfiles();
        //   }

        // });
      },
      (error) => {
        functionsAlertMod2.alertaConfigurable('Error al asignar el perfil', 'Aceptar', 'error');
      }
    );
  }

  pageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.idRol!=null) {
      this.obtenerPerfilRolesUsuarioResponse(this.idRol);
    }else{
      this.obtenerPerfiles();
    }

  }


  eliminarPerfil(element: any) {
    const index = this.dataSourceRoles.data.indexOf(element);
    if (index !== -1) {
      functionsAlertMod2.preguntarSiNo('¿Estás seguro de eliminar el perfil?', 'Sí, eliminar').then((result) => {
        if (result.isConfirmed) {
          const request = {
            "idConfiguracionBandeja": element.idConfiguracionBandeja,
            "estadoConfiguracion": '0'
          };

          this.gestioUsuarioService.actualizarEstadoPerfilUsuario(request).subscribe(
            (response) => {
              if (this.idRol!=null) {
                this.obtenerPerfilRolesUsuarioResponse(this.idRol);
              }else{
                this.obtenerPerfiles();
                this.obtenerDivisionesPorUsuario();
              }

            },
            (error) => {
              console.error('Error al actualizar el estado del perfil usuario', error);
            }
          );
        }
      });

    }
  }

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.GESTION_USUARIO]);
  }

  protected validarSeleccion(): boolean {
    return (this.formGroup.get('selectedPerfil').value === null || this.formGroup.get('selectedPerfil').value === '') 
      && (this.formGroup.get('selectedDivision').value === null || this.formGroup.get('selectedDivision').value === '');
  }

  limpiar() {
    this.formGroup.get('selectedPerfil').setValue('');
    this.formGroup.get('selectedDivision').setValue('');
    this.setListPerfilesDetalle(this.listAllPerfilesDetalle);
  }

  listarPerfilesPorDivision(event) {
    this.formGroup.get('selectedPerfil').setValue('');
    const perfilesPorDivision = this.listAllPerfilesDetalle.filter(perfil => perfil.idDivision === event.value);
    this.setListPerfilesDetalle(perfilesPorDivision);
    
  }

  displayFn(codi: any): string {
    return codi && codi.detalle ? codi.detalle : '';
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.selectedPerfil.value instanceof Object)) {
        this.formGroup.controls.selectedPerfil.setValue("");
        this.formGroup.controls.selectedPerfil.markAsTouched();
      }
    }, 200);
  }

}
