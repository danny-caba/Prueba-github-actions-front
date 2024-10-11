import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { BaseComponent } from '../components/base.component';
import { EvaluadorRol, ListadoEnum } from 'src/helpers/constantes.components';
import { PerfilService } from 'src/app/service/perfil.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { PerfilInscripcion } from 'src/app/interface/perfil-insripcion.model';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'vex-cmp-aprobador',
  templateUrl: './cmp-aprobador.component.html',
  styleUrls: ['./cmp-aprobador.component.scss']
})
export class CmpAprobadorComponent extends BaseComponent implements OnInit {

  @Input() solicitud: Partial<Solicitud>
  perfilInscripcion: PerfilInscripcion

  @Output() actualizarTabla: EventEmitter<any> = new EventEmitter();

  filteredStatesTecnico$: Observable<any[]>;

  listAprobadoresALL: any[] = [];
  listGrupos: ListadoDetalle[]

  formGroup = this.fb.group({
    aprobador: [null as any, Validators.required],
    grupo: [null as any, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private perfilService: PerfilService,
    private evaluadorService: EvaluadorService,
    private snackbar: MatSnackBar,
  ) {
    super();
    
    this.listarEvaluadores();

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

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  guardar() {
    if (this.validarForm()) return;
    
    let obj: any = {};
    obj.solicitud = {
      solicitudUuid: this.solicitud.solicitudUuid
    }
    obj.tipo = {
      idListadoDetalle: EvaluadorRol.APROBADOR_TECNICO_ID,
      codigo: EvaluadorRol.APROBADOR_TECNICO_COD
    }
    obj.usuario = {
      idUsuario: this.formGroup.controls.aprobador.value?.idUsuario
    }
    obj.grupo = {
      idListadoDetalle: this.formGroup.controls.grupo.value?.idListadoDetalle
    }

    this.evaluadorService.registrarAprobador(obj).subscribe(listRes => {

      if (listRes != null) {
        functionsAlert.success('Datos Guardados').then((result) => {
          this.actualizarTabla.emit(result);
          this.formGroup.reset();
        });
      }
      else {
        functionsAlert.info('El aprobador seleccionado ya existe').then((result) => {
          this.actualizarTabla.emit(result);
          this.formGroup.reset();
        });
      }
    });
  }

  eliminar(obj){
    functionsAlert.questionSiNo('¿Seguro que desea eliminar al aprobador?').then((result) => {
      if (result.isConfirmed) {
        this.evaluadorService.eliminarAprobador(obj.idAsignacion).subscribe(listRes => {
          functionsAlert.success('Registro Eliminado').then((result) => {
            this.actualizarTabla.emit(result);
          });
        });
      }
    });
  }


}
