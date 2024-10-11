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
import { ProcesoService } from 'src/app/service/proceso.service';
import { ProcesoEtapaService } from 'src/app/service/proceso-etapa.service';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoMiembtoService } from 'src/app/service/proceso-miembro.service';
import { Usuario } from 'src/app/interface/pido.model';
import { PidoService } from 'src/app/service/pido.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-cmp-miembro',
  templateUrl: './cmp-miembro.component.html',
  styleUrls: ['./cmp-miembro.component.scss']
})
export class CmpMiembroComponent extends BaseComponent implements OnInit {

  @Input() PROCESO: Partial<Proceso>
  perfilInscripcion: PerfilInscripcion

  @Output() actualizarTabla: EventEmitter<any> = new EventEmitter();

  filteredStatesTecnico$: Observable<any[]>;

  listGrupos: ListadoDetalle[]
  listUsuarios: Usuario[]

  formGroup = this.fb.group({
    cargo: [null as any, Validators.required],
    usuario: [null as Usuario, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private pidoService: PidoService,
    private perfilService: PerfilService,
    private evaluadorService: EvaluadorService,
    private procesoMiembtoService: ProcesoMiembtoService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  ngOnInit() {
    this.cargarCombo();
  }
 
  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.CARGO_MIEMBRO
    ]).subscribe(listRes => {
      this.listGrupos = listRes[0];
    })

    this.pidoService.listarUsuarios().subscribe(
      res=>{
        this.listUsuarios = res;
        this.filteredStatesTecnico$ = this.formGroup.controls.usuario.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.nombres),
          map(state => state ? this.filterStatesTec(state) : this.listUsuarios.slice())
        );
      }
    )
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
    
    let obj: any = this.formGroup.getRawValue();
    obj.proceso = { idProceso: this.PROCESO.idProceso};
    obj.nombreUsuario =this.formGroup.controls.usuario.value.nombres;
    obj.codigoUsuario = this.formGroup.controls.usuario.value.idUsuario;
    
    this.procesoMiembtoService.registrarProcesoMiembro(obj).subscribe(listRes => {
      functionsAlertMod2.success('Datos Guardados').then((result) => {
        this.formGroup.reset();
        this.actualizarTabla.emit(result); 
      });
    });

  }

  eliminar(obj){
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar al aprobador?').then((result) => {
      if (result.isConfirmed) {
        this.evaluadorService.eliminarAprobador(obj.idAsignacion).subscribe(listRes => {
          functionsAlertMod2.success('Registro Eliminado').then((result) => {
            this.actualizarTabla.emit(result);
          });
        });
      }
    });
  }

  filterStatesTec(nombreUsuario: string) {
    return this.listUsuarios.filter(state =>
      state.nombres?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.usuario.value instanceof Object)) {
        this.formGroup.controls.usuario.setValue(null);
        this.formGroup.controls.usuario.markAsTouched();
      }
    }, 200);
  }

  displayFn(codi: any): string {
    return codi && codi.nombres ? codi.nombres : '';
  }
  
}
