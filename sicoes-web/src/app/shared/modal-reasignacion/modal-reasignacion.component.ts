import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { BaseComponent } from '../components/base.component';
import { EvaluadorRol, ListadoEnum } from 'src/helpers/constantes.components';
import { PerfilService } from 'src/app/service/perfil.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { PerfilInscripcion } from 'src/app/interface/perfil-insripcion.model';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'vex-modal-reasignacion',
  templateUrl: './modal-reasignacion.component.html',
  styleUrls: ['./modal-reasignacion.component.scss']
})
export class ModalReasignacionComponent extends BaseComponent implements OnInit {


  fechaInicio: Date;
  fechaFin: Date;

  solicitud: Solicitud
  perfilInscripcion: PerfilInscripcion

  booleanAdd: boolean
  booleanEdit: boolean
  booleanView: boolean = false

  filteredStatesTecnico$: Observable<any[]>;

  listAprobadoresALL: any[] = [];
  listGrupos: ListadoDetalle[]

  ELEMENT_DATA: any[] = [];

  displayedColumns: string[] = ['aprobador', 'grupo'];
  dataSource = this.ELEMENT_DATA;
  usuariosFiltrados: Observable<any[]>;
  public dataSourceTotal = new MatTableDataSource<any>();
  public dataSourceTotalHistorial = new MatTableDataSource<any>();
  private originalData: any[];
  nombreSeleccionado: number | null = null;
  usuarioSeleccionado: number | null = null;
  autocompletado = false;
  @ViewChild(MatTable) table: MatTable<any>;
  filaSeleccionada: any;

  formGroup = this.fb.group({
    usuario: [''],
  });

  constructor(
    private dialogRef: MatDialogRef<ModalReasignacionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private perfilService: PerfilService,
    private evaluadorService: EvaluadorService,
    private snackbar: MatSnackBar,
    private gestioUsuarioService: GestionUsuarioService
  ) {
    super();

    console.log("SELECCIONADA ",data.filaSeleccionada);
    this.filaSeleccionada = data.filaSeleccionada;
    if (this.booleanView) {
      this.formGroup.disable();
    }

    if (data.perfil) {
      this.perfilService.obtenerPerfil(data.perfil.idOtroRequisito).subscribe(res => {
        this.perfilInscripcion = res;
        this.formGroup.patchValue(res)
      });
    }
  }

  ngOnInit() {
    this.obtenerDatosContribuyenteFiltro();
  }

  private obtenerDatosContribuyenteFiltro(): void {

    this.gestioUsuarioService.obtenerUsuariosXCodigoRol(this.filaSeleccionada.usuario?.idUsuario,this.filaSeleccionada.codigoRol)
      .subscribe(respuesta => {
        this.dataSourceTotal.data = respuesta;
        this.originalData =  this.dataSourceTotal.data;
        this.usuariosFiltrados = this.formGroup.controls.usuario.valueChanges.pipe(
          startWith(''), // Empezar con una cadena vacía
          map(value => this._filterUsuarios(value))
        );
        console.log("USUA",this.originalData);
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


  onAutocompleteSelected(event: MatAutocompleteSelectedEvent): void {
    this.autocompletado = true;
  }

  displayFn(codi: any): string {
    return codi && codi.nombreUsuario ? codi.nombreUsuario : '';
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.GRUPOS
    ]).subscribe(listRes => {
      this.listGrupos = listRes[0];
    })
  }

  closeModal() {
    this.dialogRef.close();
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }



  guardar() {
    if (this.ELEMENT_DATA.length < 1) {
      this.snackbar.open('Agrege aprobadores', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    let listAprob: any[] = [];

    this.ELEMENT_DATA.forEach(objAsignacion => {
      let obj: any = {};
      obj.solicitud = {
        solicitudUuid: this.solicitud.solicitudUuid
      }
      obj.tipo = {
        idListadoDetalle: EvaluadorRol.APROBADOR_TECNICO_ID,
        codigo: EvaluadorRol.APROBADOR_TECNICO_COD
      }
      obj.usuario = {
        idUsuario: objAsignacion.aprobador.idUsuario
      }
      obj.grupo = {
        idListadoDetalle: objAsignacion.grupo.idListadoDetalle
      }
      listAprob.push(obj)
    });

    this.evaluadorService.registrarAsignacion(listAprob).subscribe(listRes => {
      functionsAlert.success('Datos Guardados').then((result) => {
        this.closeModal();
      });
    });
  }

  onFechaInicioChange(event: MatDatepickerInputEvent<Date>): void {
    this.fechaInicio = event.value;
  }

  onFechaFinChange(event: MatDatepickerInputEvent<Date>): void {
    this.fechaFin = event.value;
  }


  buscarUsuarios(): number {
    const usuarioValue = this.formGroup.controls.usuario.value;
    const usuario = this.originalData.find(u => u.nombreUsuario === usuarioValue);
    this.nombreSeleccionado = usuario ? usuario.nombreUsuario : null;
    return usuario.idUsuario

  }
  realizarReasignacion() {

    if (this.fechaInicio == undefined || this.fechaFin == undefined){
      functionsAlertMod2.alertArribaDerrecha('Ambas fechas deben ser seleccionadas');
      return;
    }

    if (this.fechaFin < this.fechaInicio) {
      functionsAlertMod2.alertArribaDerrecha('La Fecha Fin no puede ser menor que la Fecha de Inicio');
      return;
    }

    const fechaInicioFormatted = this.fechaInicio ? this.formatDate(this.fechaInicio) : '';
    const fechaFinFormatted = this.fechaFin ? this.formatDate(this.fechaFin) : '';

        const request = {
          idUsuarioOrigen: this.filaSeleccionada.usuario?.idUsuario,
          idUsuarioReasignacion: this.buscarUsuarios(),
          idConfiguracionBandeja:this.filaSeleccionada.idConfiguracionBandeja,
          idUsuarioReasignado: this.filaSeleccionada.usuarioR && this.filaSeleccionada.usuarioR?.idUsuario!=null ? this.filaSeleccionada.usuarioR?.idUsuario :this.filaSeleccionada.usuario?.idUsuario,
          estadoUsuarioReasignacion:"1",
          fechaInicio: fechaInicioFormatted,
          fechaFin: fechaFinFormatted
        };
        this.gestioUsuarioService.registrarUsuarioReasignacion(request).subscribe(
          (response) => {
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error al asignar perfil', error);
          }
        );
  }


  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

}
