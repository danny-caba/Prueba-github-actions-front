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
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-modal-aprobador',
  templateUrl: './modal-aprobador.component.html',
  styleUrls: ['./modal-aprobador.component.scss']
})
export class ModalAprobadorComponent extends BaseComponent implements OnInit {

  solicitud: Solicitud
  perfilInscripcion: PerfilInscripcion

  aprobadorAsignado: String;
  grupoAsignado: String;
  idAsignacion: number;
  idGrupo: number;

  booleanAdd: boolean
  booleanEdit: boolean
  booleanModify: boolean
  booleanView: boolean = false

  filteredStatesTecnico$: Observable<any[]>;

  listAprobadoresALL: any[] = [];
  listGrupos: ListadoDetalle[]

  ELEMENT_DATA: any[] = [];

  displayedColumns: string[] = ['aprobador', 'grupo'];
  dataSource = this.ELEMENT_DATA;
  @ViewChild(MatTable) table: MatTable<any>;


  formGroup = this.fb.group({
    aprobador: [null as any, Validators.required],
    grupo: [null, Validators.required],
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private perfilService: PerfilService,
    private evaluadorService: EvaluadorService,
    private snackbar: MatSnackBar,
  ) {
    super();
    this.solicitud = data?.solicitud;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanModify = data.accion == 'modify';
    this.booleanView = data.accion == 'view';

    this.listarEvaluadores();

    if (this.booleanView) {
      this.formGroup.disable();
    }

    if (data.perfil) {
      this.perfilService.obtenerPerfil(data.perfil.idOtroRequisito).subscribe(res => {
        this.perfilInscripcion = res;
        this.formGroup.patchValue(res)
      });
    }

    if (data.accion === 'modify') {
      this.aprobadorAsignado = data.aprobador.usuario.nombreUsuario;
      this.grupoAsignado = data.aprobador.grupo.nombre;
      this.idAsignacion = data.aprobador.idAsignacion;
      this.idGrupo = data.aprobador.grupo.idListadoDetalle;
    }
  }

  ngOnInit() {
    this.cargarCombo();
  }

  listarEvaluadores() {
    this.evaluadorService.buscarEvaluadores([
      EvaluadorRol.APROBADOR_TECNICO
    ]).subscribe(listRes => {
      this.listAprobadoresALL = listRes.content;

      this.filteredStatesTecnico$ = this.formGroup.controls.aprobador.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nombreUsuario),
        map(state => state ? this.filterStatesTec(state) : this.listAprobadoresALL.slice())
      );

    })

  }

  filterStatesTec(nombreUsuario: string) {
    return this.listAprobadoresALL.filter(state =>
      state.nombreUsuario?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.aprobador.value instanceof Object)) {
        this.formGroup.controls.aprobador.setValue("");
        this.formGroup.controls.aprobador.markAsTouched();
      }
    }, 200);
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

  existeAprobador() {
    let aprobadorExiste = false
    let aprobadorForm = this.formGroup.get('aprobador').value?.usuario
    this.ELEMENT_DATA.forEach(res => {
      let aprobadorLista = res?.aprobador.usuario
      if (aprobadorLista == aprobadorForm) {
        aprobadorExiste = true;
      }
    })

    if (aprobadorExiste) {
      functionsAlert.error("El usuario ya está seleccionado en un grupo")
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

  agregarAprobador() {
    if (this.validarForm()) return;
    if (this.existeAprobador()) return;
    this.ELEMENT_DATA.push(this.formGroup.getRawValue())
    this.table.renderRows();
    this.formGroup.reset();
  }

  modificar() {
    let obj: any = {};
    obj.solicitud = {
      solicitudUuid: this.solicitud.solicitudUuid
    }
    obj.tipo = {
      idListadoDetalle: EvaluadorRol.APROBADOR_TECNICO_ID,
      codigo: EvaluadorRol.APROBADOR_TECNICO_COD
    }
    obj.usuario = {
      idUsuario: this.formGroup.get('aprobador').value?.idUsuario
    }
    obj.grupo = {
      idListadoDetalle: this.idGrupo
    }
    this.evaluadorService.modificarAprobador(obj, this.idAsignacion).subscribe(listRes => {
      if (listRes){
      functionsAlert.success('Datos Modificados').then((result) => {
        this.closeModal();
      });
      }else {
        functionsAlert.info('No es posible actualizar por estar en estado aprobado').then((result) => {
          this.closeModal();
        });
      }
    });
  }

}
