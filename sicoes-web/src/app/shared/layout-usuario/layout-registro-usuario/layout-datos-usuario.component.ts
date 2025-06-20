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
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Usuario } from 'src/app/interface/proceso.model';
import { PageEvent } from '@angular/material/paginator';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'vex-layout-datos-usuario',
  templateUrl: './layout-datos-usuario.component.html',
  styleUrls: ['./layout-datos-usuario.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutDatosUsuarioComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() PROCESO: any;
  @Input() editable: boolean = false;
  suscriptionProceso: Subscription;

  IS_NUEVO = false;
  bAdd = false;
  bEdit = false;
  bView = false;

  title:string;
  disableEdit:boolean = false;
  selectedUsuarioId: number;
  listTipoDocumento: any[] = []
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  listEstado: ListadoDetalle[]
  listTipoFacturacion: ListadoDetalle[]
  listAreas: Areas[]
  dataSourceRoles = new MatTableDataSource<any>();
  totalElements: number;
  currentPage = 0; // Página actual
  pageSize = 5;   // Tamaño de página
  public dataSourceTotal = new MatTableDataSource<any>();
  public dataSourceRol = new MatTableDataSource<any>();
  usuariosFiltrados: Observable<any[]>;
  private originalData: any[];
  filteredStatesTecnico$: Observable<any[]>;
  enabledPerfil:boolean=false;
  userData:object;
  usuarioEncontrado = false;

  idUsuarioRegistro:number;
  formGroup = this.fb.group({
    idUsuario: ['', Validators.required],
    usuario: ['', Validators.required],
    correoUsuario: ['', Validators.required,],
    nombreUsuarioSiged: ['', Validators.required],
  });

  formGroupRole = this.fbRol.group({
    selectedRole: ['', Validators.required],

  });
  displayedColumns: string[] = [
    'nombreCompleto',
    'nombreUsuario',
    'roles',
    'estado',
    'habilitar/deshabilitar',
    'acciones'
  ];

  isDesktop$ = this.layoutService.isDesktop$;

  //(nnn-yyyy-OSINERGMIN-DIV/GER-NN), nnn correlativo, yyyy año, DIV/GER Siglas, NN Número de convocatoria en arábigo. OSINERGMIN-DIV/GER
  //osiInputMask = createMask('999-9999-OSINERGMIN-DIV/GER-99{1,3}');


  constructor(
    private fb: FormBuilder,
    private fbRol: FormBuilder,
    private parametriaService: ParametriaService,
    private activeRoute: ActivatedRoute,
    private procesoAddService: ProcesoAddService,
    private layoutService: LayoutService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private procesoService: ProcesoService,
    private dialog: MatDialog,
    private pidoService: PidoService,
    private gestioUsuarioService: GestionUsuarioService) {
    super();

  }

  ngOnInit(): void {

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    this.userData = userData;
    if(userData != null){
      this.title = "DATOS DEL USUARIO";
      this.disableEdit = true;
      this.idUsuarioRegistro = userData.idUsuario;
      this.formGroup.get('nombreUsuarioSiged').setValue(userData.nombreUsuario);
      this.formGroup.get('usuario').setValue(userData.usuario);
      this.formGroup.get('correoUsuario').setValue(userData.correo);
      this.formGroup.get('idUsuario').setValue(userData.codigoUsuarioInterno);
      this.listarRoles();
      this.obtenerRolesUsuario();
      this.enabledPerfil = true;
    }else{
      this.title = "Registro Usuario"
      this.disableEdit = false;
      this.idUsuarioRegistro =null;
      this.obtenerDatosSIGED();
    }
  }


  ngOnChanges(changes: SimpleChanges) {

  }

  setValues() {
    this.formGroup.patchValue(this.PROCESO)
  }

  onChangeSector(obj) {

  }

  public validar() {

  }

  openDrawer() {

  }

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.GESTION_USUARIO]);
  }

  borrador(continuar: boolean){

  }

  filterStatesTec(nombreUsuario: string) {

  }

  blurEvaluadorTecnico() {

  }



  siguienteView(){
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.PROCESOS_VIEW, this.PROCESO.procesoUuid, 'fecha']);
  }

  openInfo(){

  }

  pegarSoloNumeros(event: any) {

  }

  confPerfil(){
   // sessionStorage.setItem('dataSourceRoles', JSON.stringify(this.dataSourceRoles.data));
    this.router.navigate([Link.INTRANET, Link.GESTION_USUARIO, Link.GESTION_USUARIO_CONF_PERFIL]);
    sessionStorage.setItem('rolesData', JSON.stringify(this.dataSourceRoles.data));
  }

  public obtenerDatosSIGED(): void {

    this.gestioUsuarioService.obtenerUsuariosSIGED()
      .subscribe(respuesta => {
        this.dataSourceTotal.data = respuesta;
        this.originalData =  this.dataSourceTotal.data;
        this.usuariosFiltrados = this.formGroup.controls.nombreUsuarioSiged.valueChanges.pipe(
          startWith(''), // Empezar con una cadena vacía
          map(value => this._filterUsuarios(value))
        );
      });
  }

  private _filterUsuarios(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (filterValue.trim() === '') {
      // Restablece los datos originales en lugar de volver a cargarlos
      this.dataSourceTotal.data = this.originalData;
      return this.dataSourceTotal.data;
    } else {
      this.dataSourceTotal.data = this.originalData.filter(item => {

        const nombres = item.nombres;

        return (nombres.toLowerCase().includes(filterValue));
      });
      return this.dataSourceTotal.data;
    }
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedUsuario = event.option.value;
    const selectedUsuarioId = this.findUsuarioIdByNombres(selectedUsuario);
    this.gestioUsuarioService.obtenerUsuarioSIGED({ idUsuario: selectedUsuarioId }).subscribe({
      next: (response) => {
        this.usuarioEncontrado = true;
        this.formGroup.get('correoUsuario').setValue(response?.correoUsuario);
        this.formGroup.get('usuario').setValue(response?.usuario);
        this.formGroup.get('idUsuario').setValue(response?.idUsuario);
        // this.formGroup.get('correoUsuario').disable();
        // this.idUsuarioRegistro = response.idUsuario;
        // this.listarRoles();
        // this.obtenerRolesUsuario();
        // this.enabledPerfil = true;
        // sessionStorage.setItem('userData', JSON.stringify(response));
      },
      error: (error) => {
        console.error('Error al obtener usuario SIGED', error);
      }
    });
  //   this.selectedUsuarioId = selectedUsuarioId; // Almacena el usuario.idUsuario
  //   this.formGroup.get('correoUsuario').setValue('');
  //   this.formGroup.get('nombreUsuario').setValue('');
  //   this.formGroup.get('correoUsuario').disable();
  }

  findUsuarioIdByNombres(nombres: string): number {

    const usuario = this.dataSourceTotal.data.find(u => u.nombres === nombres);
    return usuario ? usuario.idUsuario : null; // Devuelve el idUsuario o null si no se encuentra
  }

  actualizarCorreoUsuario() {
    const nombreUsuario = this.formGroup.get('nombreUsuario').value;
  this.formGroup.get('correoUsuario').setValue(nombreUsuario + '@osinergmin.gob.pe');
}

  elegirOpcion(){
    this.formGroup.markAsTouched();
    if(!this.isFormValid) return;
    if(this.idUsuarioRegistro != null || this.idUsuarioRegistro!= undefined) this.editarUsuario();
    else this.registrarUsuario();
  }

  registrarUsuario() {
    if (this.formGroup.valid) {
      // Construir un objeto Usuario a partir de los valores del formulario
      const nuevoUsuario: Usuario = {
        idUsuario:null,
        usuario: this.formGroup.get('usuario').value,
        codigoUsuarioInterno: this.formGroup.get('idUsuario').value.toString(),
        correo: this.formGroup.get('correoUsuario').value,
        nombreUsuario: this.formGroup.get('nombreUsuarioSiged').value,
        estadoUsuario:'1'
      };

      // Llamar a la función registrarUsuario del servicio
      this.gestioUsuarioService.registrarUsuario(nuevoUsuario).subscribe(
        (response) => {
          functionsAlertMod2.success('Usuario registrado exitosamente').then((result) => {
            console.log('Registro exitoso', response);
            this.idUsuarioRegistro = response.idUsuario;
            this.listarRoles();
            this.enabledPerfil = true;

            sessionStorage.setItem('userData', JSON.stringify(response));
            });
        },
        (error) => {
          // Manejar los errores en caso de que la solicitud falle
          console.error('Error al registrar usuario', error);
        }
      );
    }
  }

  editarUsuario() {
    if (this.formGroup.valid) {
      // Construir un objeto Usuario a partir de los valores del formulario
      const nuevoUsuario: Usuario = {
        idUsuario:this.idUsuarioRegistro,
        usuario: this.formGroup.get('nombreUsuario').value,
        correo: this.formGroup.get('correoUsuario').value,
        nombreUsuario: this.formGroup.get('nombreUsuarioSiged').value,
        estadoUsuario:'1'
      };

      // Llamar a la función registrarUsuario del servicio
      this.gestioUsuarioService.editarUsuario(nuevoUsuario).subscribe(
        (response) => {
          functionsAlertMod2.success('Usuario editado exitosamente').then((result) => {
            console.log('Edición exitosa', response);
            this.idUsuarioRegistro = response.idUsuario;
            this.listarRoles();
            sessionStorage.setItem('userData', JSON.stringify(response));
            });
        },
        (error) => {
          console.error('Error al registrar usuario', error);
        }
      );
    }
  }

  public listarRoles(): void {

    this.gestioUsuarioService.listarRoles()
      .subscribe(respuesta => {
        this.dataSourceRol.data = respuesta.content;

      });
  }

  agregarRolUsuario() {
    if (this.formGroupRole.valid) {
      const selectedRoleId = this.formGroupRole.get('selectedRole').value;

      const request = {
        usuario: {
          idUsuario: this.idUsuarioRegistro,
        },
        rol: {
          idRol: selectedRoleId,
        },
        estadoUsuarioRol: '1',
      };

      // Verificar si selectedRoleId es igual a 7
      //if (selectedRoleId == '7') {
        const countRol = this.dataSourceRoles.data.filter(element => element.rol.idRol === selectedRoleId).length;
        if (countRol < 1) {
          this.realizarAsignacion(request);
        } else {
          functionsAlertMod2.warningMensage('El rol ya se encuentra asignado al usuario ' + this.formGroup.get('correoUsuario').value).then((result) => {
          });
        }
      /*} else {
        this.realizarAsignacion(request);
      }*/
    }
  }

  realizarAsignacion(request: any) {
    this.gestioUsuarioService.asignarRolUsuario(request).subscribe(
      (response) => {
        functionsAlertMod2.success('Rol asignado exitosamente').then((result) => {
          this.obtenerRolesUsuario();
        });
      },
      (error) => {
        console.error('Error al asignar rol', error);
      }
    );
  }


  public obtenerRolesUsuario(): void {

    this.gestioUsuarioService.obtenerRolUsuarios(this.currentPage, this.pageSize,this.idUsuarioRegistro)
      .subscribe(respuesta => {
        this.dataSourceRoles.data = respuesta.content;
        this.totalElements = respuesta.totalElements;
        /*if(this.totalElements >0) this.enabledPerfil = true;
        else this.enabledPerfil=false;*/

      });
  }

  pageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.obtenerRolesUsuario();
  }

  eliminarRolUsuario(element: any) {
    const index = this.dataSourceRoles.data.indexOf(element);
    console.log(element);
    if (index !== -1) {
      functionsAlertMod2.preguntarSiNo('¿Estás seguro de eliminar el rol?', 'Sí, eliminar').then((result) => {
        if (result.isConfirmed) {
          const request = {
            idUsuarioRol: element.idUsuarioRol,
            estadoUsuarioRol: '0',
            usuario: {
              idUsuario: element.usuario?.idUsuario,
            },
            rol: {
              idRol: element.rol?.idRol
            }
          };

          this.gestioUsuarioService.actualizarEstadoRolUsuario(request).subscribe(
            (response) => {
              functionsAlertMod2.success('Rol eliminado').then((result) => {
                this.obtenerRolesUsuario();
              });

            },
            (error) => {
              console.error('Error al actualizar el estado del rol usuario', error);
            }
          );
        }
      });

    }
  }

  private get isFormValid(): boolean {
    return this.formGroup.valid;
  }
}
