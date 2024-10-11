import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../components/base.component';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalPerfilAsignacionComponent } from '../../modal-perfil-asignacion/modal-perfil-asignacion.component';
import { PerfilService } from 'src/app/service/perfil.service';

@Component({
  selector: 'vex-layout-asignacin-perfil-tec-v2',
  templateUrl: './layout-asignacin-perfil-tec-v2.component.html',
  styleUrls: ['./layout-asignacin-perfil-tec-v2.component.scss']
})
export class LayoutAsignacinPerfilTecV2Component extends BaseComponent implements OnInit, OnDestroy, OnChanges {

  @Input() SOLICITUD: Partial<Solicitud>
  @Input() PERFIL: Partial<any>
  @Input() rolInput: string;
  @Input() booleanModify: boolean;
  rol: any
  listEvaluadoresAdmAll: any[] = [];
  filteredStatesAdminis$: Observable<any[]>;
  listPerfilesSolicitud: any[] = [];

  formGroup = this.formBuilder.group({
    listEvaluadorAdminisCtrl: [null as any, Validators.required]
  });

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

  constructor(
    private dialogRef: MatDialogRef<ModalPerfilAsignacionComponent>,
    private perfilService: PerfilService,
    private evaluadorService: EvaluadorService,
    private formBuilder: FormBuilder,
  ) { 
    super();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.SOLICITUD && this.rolInput) {
      if (this.rolInput == EvaluadorRol.ADMINIS) {
        this.rol = this.roles[0]
      } else if (this.rolInput == EvaluadorRol.TECNICO) {
        this.rol = this.roles[1]
      }
      
      this.listarEvaluadores();
      this.listarPerfilesDeSolicitud();
    }
  }

  ngOnDestroy() {
  }

  listarEvaluadores() {
    const idListadoDetalle = this.PERFIL.perfil?.idListadoDetalle || this.PERFIL.actividadArea?.idListadoDetalle;
    this.evaluadorService.buscarEvaluadoresPerfil([this.rol.nombre], this.SOLICITUD.solicitudUuid, idListadoDetalle).subscribe(listRes => {
      this.listEvaluadoresAdmAll = listRes.content;

      this.filteredStatesAdminis$ = this.formGroup.controls.listEvaluadorAdminisCtrl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nombreUsuario),
        map(state => state ? this.filterStatesAdm(state) : this.listEvaluadoresAdmAll.slice())
      );
    })
  }

  listarPerfilesDeSolicitud() {
    let filtro = {
      solicitudUuid: this.SOLICITUD.solicitudUuid
    }

    this.perfilService.buscarPerfiles(filtro).subscribe(res => {
      this.listPerfilesSolicitud = res.content;
    })

  }

  filterStatesAdm(nombreUsuario: string) {
    return this.listEvaluadoresAdmAll.filter(state =>
      state.nombreUsuario?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  displayFn(codi: any): string {
    return codi && codi.nombreUsuario ? codi.nombreUsuario : '';
  }

  guardarEvalAdminis() {
    let listaAsignaciones: any = [];
    let idUsuario = this.formGroup.controls.listEvaluadorAdminisCtrl.value.idUsuario;

    if(!this.booleanModify){
    if (this.PERFIL.usuario?.idUsuario) {
      functionsAlert.error('El perfil ya fue asignado');
      return;
    }
    }
    
    
    let asignacion = {
      solicitud: {
        solicitudUuid: this.SOLICITUD.solicitudUuid
      },
      tipo: {
        idListadoDetalle: this.rol.id,
        codigo: this.rol.codigo
      },
      usuario: {
        idUsuario: idUsuario
      }
    }
    
    listaAsignaciones.push(asignacion);
    if(this.booleanModify){
      this.perfilService.modificarEvaluadorPerfil(listaAsignaciones, this.PERFIL.idOtroRequisito).subscribe(res => {
        if(res == null){
          functionsAlert.info('La evaluación para este perfil ya finalizo.').then((result) => {
            this.closeModal()
          });
        }else{
        functionsAlert.success('Registro Actualizado').then((result) => {
          this.closeModal()
        });
        }
      });
    }else{
    this.perfilService.asignarEvaluadorPerfil(listaAsignaciones, this.PERFIL.idOtroRequisito).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }
    
  }

  closeModal() {
    this.dialogRef.close();
  }

}
