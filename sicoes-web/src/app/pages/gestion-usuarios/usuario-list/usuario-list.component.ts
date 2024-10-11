import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {  GestionUsuarioModel } from 'src/app/interface/gestion-usuario';
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { Link } from 'src/helpers/internal-urls.components';
import { startWith,map } from 'rxjs/operators';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { InvitacionService } from 'src/app/service/invitacion.service';


@Component({
  selector: 'vex-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent extends BasePageComponent<GestionUsuarioModel> implements OnInit {

  formGroup = this.fb.group({
    usuario: [''],
  });

  dataSource = new MatTableDataSource<any>();
  public dataSourceTotal = new MatTableDataSource<any>();
  usuariosFiltrados: Observable<any[]>;
  private originalData: any[]; // Almacena una copia de los datos originales
  public datosCargados = false;
  totalElements: number;
  currentPage = 0; // Página actual
  pageSize = 5;   // Tamaño de página
  displayedColumns: string[] = [
    'nombreCompleto',
    'nombreUsuario',
    'roles',
    'estado',
    'habilitar/deshabilitar',
    'acciones'
  ];

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(  private fb: FormBuilder,
    private router: Router,
    private gestioUsuarioService: GestionUsuarioService,
    private invitacionService: InvitacionService) {
    super();
   }

  ngOnInit(): void {
    this.obtenerDatosContribuyente();
    this.obtenerDatosContribuyenteFiltro();

  }
  private _filterUsuarios(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (filterValue.trim() === '') {
      this.dataSourceTotal.data = this.originalData;
      return this.dataSourceTotal.data;
    } else {
      this.dataSourceTotal.data = this.originalData.filter(item => {
        const usuario1 = item.nombreUsuario;
        const usuario2 = item.usuario;
        return (usuario1.toLowerCase().includes(filterValue) || usuario2.toLowerCase().includes(filterValue));
      });
      return this.dataSourceTotal.data;
    }
  }


  serviceTable(filtro) {

  }

  obtenerFiltro() {

  }

  crearUsuario(){
    this.router.navigate([Link.EXTRANET, Link.GESTION_USUARIO,Link.GESTION_USUARIO_ADD]);
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('rolesData');
  }


  editarUsuario(row: any) {
    this.router.navigate([Link.EXTRANET, Link.GESTION_USUARIO, Link.GESTION_USUARIO_ADD]);
    sessionStorage.setItem('userData', JSON.stringify(row));
    sessionStorage.removeItem('rolesData');
  }

  public obtenerDatosContribuyente(): void {

    this.gestioUsuarioService.obtenerUsuarios(this.currentPage, this.pageSize,this.formGroup.controls.usuario.value)
      .subscribe(respuesta => {
        this.dataSource.data = respuesta.content;
        this.datosCargados = true;
        this.totalElements = respuesta.totalElements;
      });
  }

  public obtenerDatosContribuyente2(): void {

    this.gestioUsuarioService.obtenerUsuarios(this.currentPage, this.pageSize,this.formGroup.controls.usuario.value)
      .subscribe(respuesta => {
        this.dataSource.data = respuesta.content;
        this.datosCargados = true;
        this.totalElements = respuesta.totalElements;
        this.paginator.firstPage();
      });
  }

  pageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.obtenerDatosContribuyente();
  }

  private obtenerDatosContribuyenteFiltro(): void {

    this.gestioUsuarioService.obtenerUsuarios(0,550,'')
      .subscribe(respuesta => {
        this.dataSourceTotal.data = respuesta.content;
        this.originalData =  this.dataSourceTotal.data;
        this.usuariosFiltrados = this.formGroup.controls.usuario.valueChanges.pipe(
          startWith(''), // Empezar con una cadena vacía
          map(value => this._filterUsuarios(value))
        );
      });
  }

  getRolesAsCommaSeparatedList(element) {
    if (element?.roles) {
      const roleNames = element.roles
        .filter(role => role != null && role.nombre != null)
        .map(role => role.nombre);
      return roleNames.join(', ');
    }
    return '';
  }

  toggleEstadoUsuario(element) {

    if (element.estadoUsuario === '0' || element.estadoUsuario === null || element.estadoUsuario === undefined) {
      functionsAlertMod2.preguntarSiNo('¿Estás seguro de habilitar al usuario?', 'Sí, habilitar').then((result) => {
        if (result.isConfirmed) {
          this.actualizarEstadoUsuario(element.idUsuario,'1');
        }
      });
    } else if (element.estadoUsuario === '1') {
      functionsAlertMod2.preguntarSiNo('¿Estás seguro de inhabilitar al usuario?', 'Sí, inhabilitar').then((result) => {
        if (result.isConfirmed) {
          this.actualizarEstadoUsuario(element.idUsuario,'0');
        }
      });
    }

  }
  actualizarEstadoUsuario(idUsuario: number, estado: string) {
    const request = {
      "idUsuario": idUsuario,
      "estadoUsuario": estado
    };

    this.gestioUsuarioService.actualizarEstadoUsuario(request).subscribe(
      (response) => {
        this.obtenerDatosContribuyente();
      },
      (error) => {
        console.error('Error al actualizar el estado del usuario', error);
      }
    );
  }


}
