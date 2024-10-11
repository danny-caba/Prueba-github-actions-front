import { Component, OnDestroy, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../../components/base.component';

@Component({
  selector: 'vex-layout-asignacion-perfil',
  templateUrl: './layout-asignacion-perfil.component.html',
  styleUrls: ['./layout-asignacion-perfil.component.scss']
})
export class LayoutAsignacionPerfilComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {

  suscriptionSolicitud: Subscription;
  @Input() SOLICITUD: Partial<Solicitud>

  @Input() rolInput: string;

  formGroup = this.fb.group({
    listEvaluadorAdminisCtrl: [null as any, Validators.required]
  });

  filteredStatesAdminis$: Observable<any[]>;

  listEvaluadoresAdmAll: any[] = [];
  listEvaluadoresAdminis: any[] = [];

  @Input() listarEvaladoresAsignados: any[]

  roles = [{
    id: EvaluadorRol.ADMINIS_ID,
    nombre: EvaluadorRol.ADMINIS,
    codigo: EvaluadorRol.ADMINIS_COD,
    tituloEdit: 'SELECCIONAR EVALUADORES ADMINISTRATIVOS',
    tituloView: 'EVALUADORES ADMINISTRATIVOS',
    msg: 'administrativo',
    opcionEdit: this.opcion.CMP_EDIT_EVAL_ADM
  }, {
    id: EvaluadorRol.TECNICO_ID,
    nombre: EvaluadorRol.TECNICO,
    codigo: EvaluadorRol.TECNICO_COD,
    tituloEdit: 'SELECCIONAR EVALUADORES TÉCNICOS',
    tituloView: 'EVALUADORES TECNICOS',
    msg: 'técnico',
    opcionEdit: this.opcion.CMP_EDIT_EVAL_TEC
  }]

  rol: any

  constructor(
    private evaluadorService: EvaluadorService,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.SOLICITUD && this.rolInput) {
      if (this.rolInput == EvaluadorRol.ADMINIS) {
        this.rol = this.roles[0]
      } else if (this.rolInput == EvaluadorRol.TECNICO) {
        this.rol = this.roles[1]
      }
      //this.listarAsignados();
      this.listarEvaluadores();
    }
  }

  evaluadorExiste(evaluador: any) {
    if (this.listEvaluadoresAdminis.find(listRes => listRes == evaluador)) {
      functionsAlert.error("Ya se encuentra asignado el evaluador")
      this.formGroup.controls.listEvaluadorAdminisCtrl.reset();
      return true
    }
    return false
  }

  ngOnInit(): void {
    this.formGroup.controls.listEvaluadorAdminisCtrl.valueChanges.subscribe(value => {
      if (value instanceof Object) {

        if (this.evaluadorExiste(value)) return
        this.listEvaluadoresAdminis.push(value);
        this.formGroup.controls.listEvaluadorAdminisCtrl.reset();
      }
    })
  }

  asignarEvaluadorAdminis() {
    let listSend: any = [];

    this.listEvaluadoresAdminis.forEach(objAsignacion => {
      let obj = {
        solicitud: {
          solicitudUuid: this.SOLICITUD.solicitudUuid
        },
        tipo: {
          idListadoDetalle: this.rol.id,
          codigo: this.rol.codigo
        },
        usuario: {
          idUsuario: objAsignacion.idUsuario
        }
      }
      listSend.push(obj)
    });

    this.evaluadorService.registrarAsignacion(listSend).subscribe(listRes => {
      functionsAlert.success('Datos Guardados').then((result) => {
        this.listarAsignados();
      });
    });
  }

  blurEvaluadorAdminis() {
    setTimeout(() => {
      if (!(this.formGroup.controls.listEvaluadorAdminisCtrl.value instanceof Object)) {
        this.formGroup.controls.listEvaluadorAdminisCtrl.setValue("");
        this.formGroup.controls.listEvaluadorAdminisCtrl.markAsTouched();
      }
    }, 200);
  }

  listarEvaluadores() {

    this.evaluadorService.buscarEvaluadoresPerfil([
      this.rol.nombre
    ], this.SOLICITUD.solicitudUuid, 0).subscribe(listRes => {
      this.listEvaluadoresAdmAll = listRes.content;

      this.filteredStatesAdminis$ = this.formGroup.controls.listEvaluadorAdminisCtrl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nombreUsuario),
        map(state => state ? this.filterStatesAdm(state) : this.listEvaluadoresAdmAll.slice())
      );

    })
  }

  filterStatesAdm(nombreUsuario: string) {
    return this.listEvaluadoresAdmAll.filter(state =>
      state.nombreUsuario?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  displayFn(codi: any): string {
    return codi && codi.nombreUsuario ? codi.nombreUsuario : '';
  }

  ngOnDestroy() {

  }


  listarAsignados() {
    this.evaluadorService.listarAsignaciones({ solicitudUuid: this.SOLICITUD.solicitudUuid, size: 1000 }).subscribe(listRes => {
      this.listarEvaladoresAsignados = [];
      listRes.content?.forEach(obj => {
        if (obj.tipo.codigo == this.rol.codigo) {
          //if(functions.esVacio(this.listarEvaladoresAsignados)){ this.listarEvaladoresAsignados = [] }
          this.listarEvaladoresAsignados.push(obj.usuario);
        }
      })
    })
  }

  deleteEvaluadorAdmin(evaluar) {
    this.listEvaluadoresAdminis = this.listEvaluadoresAdminis.filter(evaluador => evaluador.idUsuario !== evaluar.idUsuario)
  }

  guardarEvalAdminis() {
    if (this.listEvaluadoresAdminis.length < 1) {
      this.formGroup.controls.listEvaluadorAdminisCtrl.markAsTouched();
      if (!this.formGroup.controls.listEvaluadorAdminisCtrl.valid) {
        return;
      }
    }

    let msj = '¿Está seguro que desea asignar a los evaluadores seleccionados?';
    functionsAlert.questionSiNo(msj).then((result) => {
      if (result.isConfirmed) {
        this.asignarEvaluadorAdminis();

      }
      this.formGroup.controls.listEvaluadorAdminisCtrl.reset();
    });
  }

}
