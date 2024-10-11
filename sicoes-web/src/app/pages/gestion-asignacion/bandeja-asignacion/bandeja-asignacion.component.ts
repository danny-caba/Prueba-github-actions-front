import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { startWith,map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalTerminosComponent } from 'src/app/shared/modal-terminos/modal-terminos.component';
import { ModalReasignacionComponent } from 'src/app/shared/modal-reasignacion/modal-reasignacion.component';

@Component({
  selector: 'vex-bandeja-asignacion',
  templateUrl: './bandeja-asignacion.component.html',
  styleUrls: ['./bandeja-asignacion.component.scss']
})
export class BandejaAsignacionComponent extends BasePageComponent<Solicitud> implements OnInit,AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorHistorial: MatPaginator;
  public dataSourceTotal = new MatTableDataSource<any>();
  usuariosFiltrados: Observable<any[]>;
  private originalData: any[];
  public dataSourceDivision = new MatTableDataSource<any>();
  nombreSeleccionado: number | null = null;
  usuarioSeleccionado: number | null = null;
  usuarios: any[] = [];
  totalElements: number;
  currentPage = 0; // Página actual
  pageSize = 5;   // Tamaño de págin
  textoReasignar='Reasignar';

  totalElementsHistorial: number;
  currentPageHistorial = 0; // Página actual
  pageSizeHistorial = 5;   // Tamaño de página
  dataSourceReasignacion = new MatTableDataSource<any>();
  dataSourceTotalHistorial = new MatTableDataSource<any>();

  formGroupFiltro = this.fbFiltro.group({
    nombreCompletoUsuario: [''],
    fechaInicio: [''],
    fechaFin: [''],
    idDivision: [null],
  });
  formGroup = this.fb.group({
    usuario: [''],
  });
  displayedColumns: string[] = [
    'perfiles',
    'reasignar',
    'evaluador',
    'periodo'
  ];

  displayedColumnsHistorial: string[] = [
    'nombreCompleto',
    'nombreUsuario',
    'roles',
    'division',
    'perfil',
    'fechaInicioAsignacion',
    'fechaFinAsignacion',
    'acciones'
  ];
  constructor(private gestioUsuarioService: GestionUsuarioService, private fb: FormBuilder, private fbFiltro: FormBuilder ,
    private router: Router,    private dialog: MatDialog, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.obtenerDatosContribuyenteFiltro();
    this.listarHistorialReasignaciones();
    this.listarDivisiones();
  }
  ngAfterViewInit() {
    this.dataSourceReasignacion.paginator = this.paginator;
    this.dataSourceTotalHistorial.paginator = this.paginatorHistorial;
  }
  isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
  obtenerFiltro() {
    let filtro: any = {

    }
    return filtro;
  }

  public listarDivisiones(): void {

    this.gestioUsuarioService.listarDivisiones()
      .subscribe(respuesta => {

        this.dataSourceDivision.data = respuesta;
      });
  }


  serviceTable(filtro) {

  }

  private obtenerDatosContribuyenteFiltro(): void {

    this.gestioUsuarioService.obtenerUsuarios(0,1000,'')
      .subscribe(respuesta => {
        this.dataSourceTotal.data = respuesta.content;
        this.originalData =  this.dataSourceTotal.data;
        this.usuariosFiltrados = this.formGroup.controls.usuario.valueChanges.pipe(
          startWith(''), // Empezar con una cadena vacía
          map(value => this._filterUsuarios(value))
        );
        console.log("USUA",this.usuariosFiltrados);
      });
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
  buscarUsuarios(): void {
    const usuarioValue = this.formGroup.controls.usuario.value;
    const usuario = this.originalData.find(u => u.usuario === usuarioValue);
    this.usuarioSeleccionado = usuario ? usuario.usuario : null;
    this.nombreSeleccionado = usuario ? usuario.nombreUsuario : null;

    this.obtenerPerfilRolesUsuario(usuario.idUsuario);
  }

  public obtenerPerfilRolesUsuario(idUsuario: any): void {

    this.gestioUsuarioService.obtenerListaReasignacion(idUsuario)
      .subscribe(respuesta => {
        this.dataSourceReasignacion.data = respuesta;
        this.totalElements = respuesta.length;
      });
  }

  pageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscarUsuarios();
  }

  pageChangeHistorial(event: PageEvent): void {
    this.currentPageHistorial = event.pageIndex;
    this.pageSizeHistorial = event.pageSize;
    this.listarHistorialReasignaciones();
  }

  reasignar(filaSeleccionada: any): void {
    this.dialog.open(ModalReasignacionComponent, {
      disableClose: true,
      width: '800px',
      maxHeight: 'auto',
      data: {
        accion: 'view',
        filaSeleccionada: filaSeleccionada  // Pasa la fila seleccionada al modal
      },
    }).afterClosed().subscribe(result => {
      this.buscarUsuarios();
      this.listarHistorialReasignaciones();
    });
  }


  public listarHistorialReasignaciones(): void {
    const { nombreCompletoUsuario, fechaInicio, fechaFin, idDivision } = this.formGroupFiltro.getRawValue();

    const fechaInicioFormateada = fechaInicio ? this.datePipe.transform(fechaInicio, 'dd/MM/yyyy') : '';
    const fechaFinFormateada = fechaFin ? this.datePipe.transform(fechaFin, 'dd/MM/yyyy') : '';

    const idDivisionString = idDivision != null ? idDivision.toString() : '';

    this.gestioUsuarioService.filtroHistorialReasignaciones( this.currentPageHistorial, 5, nombreCompletoUsuario, fechaInicioFormateada, fechaFinFormateada, idDivisionString)
      .subscribe(respuesta => {
        this.dataSourceTotalHistorial.data = respuesta;
        this.totalElementsHistorial = 8;
      });
  }
}
