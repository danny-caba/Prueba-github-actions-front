import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { BaseComponent } from '../components/base.component';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { PerfilService } from 'src/app/service/perfil.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { PerfilInscripcion } from 'src/app/interface/perfil-insripcion.model';

@Component({
  selector: 'vex-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalPerfilComponent extends BaseComponent implements OnInit, OnDestroy {

  solicitud: Solicitud
  perfilInscripcion: PerfilInscripcion

  booleanAdd: Boolean
  booleanEdit: Boolean
  booleanView: Boolean = false
  esPersonaNat: boolean = true;

  formGroup = this.fb.group({
    sector: [null, Validators.required],
    subsector: [null, Validators.required],
    actividad: [null, Validators.required],
    unidad: [null, Validators.required],
    subCategoria: [null, Validators.required],
    perfil: [null, Validators.required]
  });

  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  listActividad: ListadoDetalle[]
  listUnidad: ListadoDetalle[]
  listSubCategoria: ListadoDetalle[]
  listPerfil: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalPerfilComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private perfilService: PerfilService
  ) {
    super();
    this.solicitud = data?.solicitud;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';

    this.esPersonaNat = data.esPersonaNat;

    if (this.esPersonaNat == false) {
      this.clearValidator(true, ['actividad', 'unidad', 'subCategoria', 'perfil'], this.formGroup);
    }

    if (this.booleanView) {
      this.formGroup.disable();
    }

    if (data.perfil) {
      this.perfilService.obtenerPerfil(data.perfil.idOtroRequisito).subscribe(res => {
        this.perfilInscripcion = res;
        this.formGroup.patchValue(res, { emitEvent: false })

        let sector: any = this.formGroup.get('sector').value
        this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, sector.idListadoDetalle).subscribe(res => {
          this.listSubSector = res
        });

        let subsector: any = this.formGroup.get('subsector').value
        this.parametriaService.obtenerSubListado(ListadoEnum.ACTIVIDAD, subsector.idListadoDetalle).subscribe(res => {
          this.listActividad = res
        });

        let actividad: any = this.formGroup.get('actividad').value
        this.parametriaService.obtenerSubListado(ListadoEnum.UNIDAD, actividad.idListadoDetalle).subscribe(res => {
          this.listUnidad = res
        });

        let unidad: any = this.formGroup.get('unidad').value
        this.parametriaService.obtenerSubListado(ListadoEnum.SUBCATEGORIA, unidad.idListadoDetalle).subscribe(res => {
          this.listSubCategoria = res
        });

        let subcategoria: any = this.formGroup.get('subCategoria').value
        this.parametriaService.obtenerSubListado(ListadoEnum.PERFILES, subcategoria.idListadoDetalle).subscribe(res => {
          this.listPerfil = res
        });
      });
    }
  }

  ngOnInit() {
    this.cargarCombo();

    this.formGroup.get('sector').valueChanges.subscribe(value => {
      this.onChangeSector(value)
    })

    this.formGroup.get('subsector').valueChanges.subscribe(value => {
      this.onChangeSubSector(value)
    })

    this.formGroup.get('actividad').valueChanges.subscribe(value => {
      this.onChangeActividad(value)
    })

    this.formGroup.get('unidad').valueChanges.subscribe(value => {
      this.onChangeUnidad(value)
    })

    this.formGroup.get('subCategoria').valueChanges.subscribe(value => {
      this.onChangeSubcategoria(value)
    })
  }

  onChangeSector(obj) {
    this.formGroup.get('subsector').setValue(null);
    this.formGroup.get('actividad').setValue(null);
    this.formGroup.get('unidad').setValue(null);
    this.formGroup.get('subCategoria').setValue(null);
    this.formGroup.get('perfil').setValue(null);
    this.formGroup.markAllAsTouched();
    if (!obj) return;
    this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, obj.idListadoDetalle).subscribe(res => {
      this.listSubSector = res
    });
  }

  onChangeSubSector(obj) {
    this.formGroup.get('actividad').setValue(null);
    this.formGroup.get('unidad').setValue(null);
    this.formGroup.get('subCategoria').setValue(null);
    this.formGroup.get('perfil').setValue(null);
    this.formGroup.markAllAsTouched();
    if (!obj) return;
    this.parametriaService.obtenerSubListado(ListadoEnum.ACTIVIDAD, obj.idListadoDetalle).subscribe(res => {
      this.listActividad = res
    });
  }

  onChangeActividad(obj) {
    this.formGroup.get('unidad').setValue(null);
    this.formGroup.get('subCategoria').setValue(null);
    this.formGroup.get('perfil').setValue(null);
    this.formGroup.markAllAsTouched();
    if (!obj) return;
    this.parametriaService.obtenerSubListado(ListadoEnum.UNIDAD, obj.idListadoDetalle).subscribe(res => {
      this.listUnidad = res
    });
  }

  onChangeUnidad(obj) {
    this.formGroup.get('subCategoria').setValue(null);
    this.formGroup.get('perfil').setValue(null);
    this.formGroup.markAllAsTouched();
    if (!obj) return;
    this.parametriaService.obtenerSubListado(ListadoEnum.SUBCATEGORIA, obj.idListadoDetalle).subscribe(res => {
      this.listSubCategoria = res
    });
  }

  onChangeSubcategoria(obj) {
    this.formGroup.get('perfil').setValue(null);
    this.formGroup.markAllAsTouched();
    if (!obj) return;
    this.parametriaService.obtenerSubListado(ListadoEnum.PERFILES, obj.idListadoDetalle).subscribe(res => {
      this.listPerfil = res
    });
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.SECTOR,
    ]).subscribe(listRes => {
      this.listSector = listRes[0];
    })
  }

  ngOnDestroy() {

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

  actualizar() {
    if (this.validarForm()) return;

    let perfil: any = {
      idOtroRequisito: this.perfilInscripcion.idOtroRequisito,
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ...this.formGroup.getRawValue()
    };

    this.perfilService.actualizar(perfil).subscribe(res => {
      functionsAlert.success('Registro Actualizado').then((result) => {
        this.closeModal()
      });
    });
  }

  guardar() {
    if (this.validarForm()) return;

    let perfil: any = {
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ...this.formGroup.getRawValue()
    };

    this.perfilService.registrar(perfil).subscribe(res => {
      functionsAlert.success('Registrado').then((result) => {
        this.closeModal()
      });
    })
  }
}