import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BaseComponent } from '../components/base.component';
import { ParametriaService } from 'src/app/service/parametria.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { DatePipe } from '@angular/common';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoMiembtoService } from 'src/app/service/proceso-miembro.service';
import { Usuario } from 'src/app/interface/pido.model';
import { PidoService } from 'src/app/service/pido.service';
import { Observable, map, startWith } from 'rxjs';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-modal-proceso-miembro',
  templateUrl: './modal-proceso-miembro.component.html',
  styleUrls: ['./modal-proceso-miembro.component.scss']
})
export class ModalProcesoMiembroComponent extends BaseComponent implements OnInit {

  PROCESO: Proceso
  miembro: any
  data: any

  filteredStatesTecnico$: Observable<any[]>;

  listGrupos: ListadoDetalle[]
  listUsuarios:Usuario[]
  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false

  formGroup = this.fb.group({
    cargo: [null as any, Validators.required],
    usuario: [null as any, Validators.required]
  });

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalProcesoMiembroComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private parametriaService: ParametriaService,
    private procesoMiembtoService: ProcesoMiembtoService,
    private pidoService:PidoService,
    private datePipe: DatePipe
  ) {
    super();

    this.data = data;
    this.PROCESO = data?.proceso;

    this.validarOpciones(data)

    if (data.miembro) {
      this.cargarDatos(data.miembro.idProcesoMiembro)
    }

  }

  ngOnInit(): void {
    this.cargarCombo();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.CARGO_MIEMBRO
    ]).subscribe(listRes => {
      this.listGrupos = listRes[0]
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

  validarOpciones(data) {
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    
    if (this.booleanView) {
      this.formGroup.disable();
    }
    
  }

  cargarDatos(idProcesoMiembro) {

    this.procesoMiembtoService.obtenerProcesoMiembro(idProcesoMiembro,this.PROCESO.procesoUuid).subscribe(res => {
      this.miembro = res;
      this.miembro.usuario ={
        codigoUsuario: res.codigoUsuario,
        nombres: res.nombreUsuario
      }

      this.formGroup.patchValue(this.miembro)
    });

  }

  guardar() {
    if (this.validarForm()) return;

    let itemTemp: any = {
      proceso: {
        idProceso: this.PROCESO.idProceso,
      },
      nombreUsuario : this.formGroup.controls.usuario.value.nombres,
      codigoUsuario : this.formGroup.controls.usuario.value.codigoUsuario||
      this.formGroup.controls.usuario.value.idUsuario,
      ...this.formGroup.getRawValue()
    };
    
    this.procesoMiembtoService.registrarProcesoMiembro(itemTemp).subscribe(res => {
      this.closeModal()
      functionsAlertMod2.success('Registrado');
    });
  }

  actualizar() {
    if (this.validarForm()) return;

    let itemTemp: any = {
      idProcesoMiembro: this.miembro.idProcesoMiembro,
      proceso: {
        procesoUuid: this.PROCESO.procesoUuid,
      },
      nombreUsuario : this.formGroup.controls.usuario.value.nombres,
      codigoUsuario : this.formGroup.controls.usuario.value.codigoUsuario||
      this.formGroup.controls.usuario.value.idUsuario,
      ...this.formGroup.getRawValue()
    };

    this.procesoMiembtoService.actualizarProcesoMiembro(itemTemp).subscribe(res => {
      this.closeModal()
      functionsAlertMod2.success('Registro Actualizado');
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
