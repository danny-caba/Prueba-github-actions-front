import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { ParametriaService } from 'src/app/service/parametria.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { Division } from 'src/app/interface/division.model';
import { map, Observable, startWith } from 'rxjs';
import { Requerimiento } from 'src/app/interface/requerimiento.model';
import { RequerimientoService } from 'src/app/service/requerimiento.service';

@Component({
  selector: 'vex-modal-terminos',
  templateUrl: './modal-crear-requerimiento.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalCrearRequerimientoComponent extends BaseComponent implements OnInit {

  title: string;
  listDivision: Division[];
  ACC_REGISTRAR = 'Registrar';
  ACC_ACTUALIZAR = 'Actualizar';
  ACC_NUEVO_REQUERIMIENTO = 'ACC_NUEVO_REQUERIMIENTO';
  btnValue: string;
  disabledDivision: boolean = false;
  listAllPerfiles: any;
  listPerfilesFiltradosPorDivision: any[] = [];
  filteredStatesTecnico$: Observable<any[]>;

  // Using any for form control types to allow object binding
  formGroup = this.fb.group({
    division: [null as any, Validators.required],
    perfil: [null as any, Validators.required],
  });


  constructor(
    private dialogRef: MatDialogRef<ModalCrearRequerimientoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private requerimientoService: RequerimientoService
  ) {
    super();

    this.btnValue = data.accion;
    this.title = data?.accion === this.ACC_NUEVO_REQUERIMIENTO ? 'Crear' : 'Actualizar';
    this.listAllPerfiles = data?.perfiles;
    
    if (data?.accion === this.ACC_ACTUALIZAR) {
      this.formGroup.patchValue(data?.consulta);
    }
  }

  ngOnInit(): void {
    this.cargarCombo();
  }

  closeModal() {
    this.dialogRef.close();
  }

  accion(acc: string){
    
    if ( acc === 'GUARDAR' ) {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.invalid) {
        return;
      }

      let requerimiento: Requerimiento = {
        division: this.formGroup.get('division').value,
        perfil: this.formGroup.get('perfil').value
      };

      if (this.btnValue === this.ACC_NUEVO_REQUERIMIENTO) {
        functionsAlertMod2.preguntarSiNo('¿Seguro de CREAR el requerimiento?', 'Sí, Crear').then((result) => {
          if (result.isConfirmed) {
            this.registrarRequerimiento(requerimiento);
          }
        });
      } else {
        // this.actualizarRequerimiento(requerimiento);
      }
      
    } else {
      this.closeModal();
    }
    
  }

  registrarRequerimiento(requerimiento: Requerimiento) {
    this.requerimientoService.registrar(requerimiento).subscribe({
      next: (res) => {
        if (res === null) {
          functionsAlertMod2.warningMensage('No se puede registrar el requerimiento');
        } else {
          functionsAlertMod2.success(`El requerimiento ha sido recibido mediante el expediente Nro. ${res.nuExpediente}`).then((result) => {
            this.dialogRef.close(res);
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  cargarCombo() {
    this.parametriaService.listarDivisionesPorCoordinador().subscribe(res => {
      this.listDivision = res;
      if (this.listDivision.length === 1) {
        this.disabledDivision = true;
      }
      console.log(this.listDivision[0]);
      
      if (this.listDivision && this.listDivision.length > 0) {
        this.formGroup.get('division').setValue(this.listDivision[0]);
        this.listarPerfilesPorDivision({ value: this.listDivision[0] });
      }
    })
  }

  listarPerfilesPorDivision(event) {
    // Limpiamos el perfil seleccionado
    this.formGroup.get('perfil').setValue('');
    
    if (!event.value || !event.value.idDivision) {
      // Si no hay división seleccionada, limpiamos la lista de perfiles
      this.setListPerfilesDetalle([]);
      return;
    }
    
    // Filtramos los perfiles por la división seleccionada
    const perfilesPorDivision = this.listAllPerfiles.filter(perfil => 
      perfil.idDivision === event.value.idDivision
    );
    
    // Actualizamos la lista filtrada y configuramos el observable
    this.setListPerfilesDetalle(perfilesPorDivision);
  }

  setListPerfilesDetalle(list: any) {
    // Guardamos la lista de perfiles filtrados por división
    this.listPerfilesFiltradosPorDivision = list;
    
    this.filteredStatesTecnico$ = this.formGroup.controls.perfil.valueChanges.pipe(
      startWith(''),
      map((value: any) => typeof value === 'string' ? value : value?.detalle),
      map(state => state ? this.filterStatesTec(state) : this.listPerfilesFiltradosPorDivision.slice())
    );
  }

  filterStatesTec(nombreUsuario: string) {
    // Filtramos únicamente entre los perfiles de la división seleccionada
    return this.listPerfilesFiltradosPorDivision.filter(state =>
      state.dePerfil?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      const perfilValue = this.formGroup.controls.perfil.value;
      if (!perfilValue || typeof perfilValue !== 'object' || perfilValue === null) {
        this.formGroup.controls.perfil.setValue("");
        this.formGroup.controls.perfil.markAsTouched();
      }
    }, 200);
  }

  displayFn(codi: any): string {
    return codi && codi.dePerfil ? codi.dePerfil : '';
  }

  compareDivision(d1: any, d2: any): boolean {
    return d1 && d2 ? d1.idDivision === d2.idDivision : d1 === d2;
  }
}
