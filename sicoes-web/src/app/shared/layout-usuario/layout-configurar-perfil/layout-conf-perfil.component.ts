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
    'rol',
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

  formGroup = this.fb.group({
    usuario: ['', Validators.required],
    roles: ['', Validators.required],
    selectedPerfil: ['', Validators.required],
  });
  idUsuario:number;
  idRol:number;
  rolNombre:string;
  isDesktop$ = this.layoutService.isDesktop$;

  @ViewChild('paginator') paginator: MatPaginator;

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
    this.formGroup.get('usuario').setValue(userData.usuario);

    const rolesData = JSON.parse(sessionStorage.getItem('rolesData'));
    this.usuarioRoles = rolesData;
    console.log("usuarioRoles",this.usuarioRoles);
    const rolesNombres = rolesData.map(role => role.rol?.nombre).join(', ');
    this.formGroup.get('roles').setValue(rolesNombres);



    this.obtenerPerfiles();

  }
  public listarPerfiles(): void {

    this.gestioUsuarioService.listarPerfiles()
      .subscribe(respuesta => {

        this.dataSourcePerfil.data = respuesta;
      });
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
    console.log("obtener todos los perfiles");

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
      const selectedPerfilRoleId = this.formGroup.get('selectedPerfil').value;
      if(selectedPerfilRoleId != ""){
        const countPerfil = this.dataSourceRoles.data.filter(element => element.perfil.idListadoDetalle === selectedPerfilRoleId).length;
        if (countPerfil < 1) {
            const request = {
              usuario: {
                idUsuario: this.idUsuario,
              },
              perfil: {
                idListadoDetalle: selectedPerfilRoleId,
              },
              idUsuarioRolC: this.idRol,
            };
            this.realizarAsignacion(request);
        } else {
          functionsAlertMod2.warningMensage('El perfil ya se encuentra asignado al usuario ' + this.formGroup.get('usuario').value).then((result) => {
          });
        }


      }else{
        functionsAlertMod2.alertArribaDerrecha('Seleccione un perfil');
        return;
      }
    //}else{
    //  functionsAlertMod2.alertArribaDerrecha('Seleccione un rol');
    //  return;
    //}


  }
  realizarAsignacion(request: any) {
    this.gestioUsuarioService.asignarPerfilRolUsuario(request).subscribe(
      (response) => {
        functionsAlertMod2.success('Perfil asignado exitosamente').then((result) => {
          if (response.idUsuarioRolC!=null) {
            this.obtenerPerfilRolesUsuarioResponse(response.idUsuarioRolC);
          }else{
            this.obtenerPerfiles();
          }

        });
      },
      (error) => {
        console.error('Error al asignar perfil', error);
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
    this.router.navigate([Link.EXTRANET, Link.GESTION_USUARIO]);
  }
}
