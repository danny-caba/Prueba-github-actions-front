import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { ProcesoConsultaService } from 'src/app/service/proceso-consulta.service';
import { Proceso } from 'src/app/interface/proceso.model';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-modal-terminos',
  templateUrl: './modal-formulacion-consultas.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalFormulacionConsultasComponent extends BaseComponent implements OnInit {

  title: string;
  listTipoSeccion: any[];
  PROCESO: Proceso;
  ACC_REGISTRAR = 'Registrar';
  ACC_ACTUALIZAR = 'Actualizar';
  btnValue: string;
  procesoConsulta: any;

  formGroup = this.fb.group({
    seccion: ['', Validators.required],
    deNumeral: ['', Validators.required],
    deLiteral: ['', Validators.required],
    dePagina: ['', Validators.required],
    deConsulta: ['', Validators.required],
    deArticuloNorma: ['']
  });


  constructor(
    private dialogRef: MatDialogRef<ModalFormulacionConsultasComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private procesoConsultaService: ProcesoConsultaService
  ) {
    super();

    this.PROCESO = data?.proceso;
    this.btnValue = data.accion;
    this.procesoConsulta = data?.consulta;
    this.title = data?.accion == this.ACC_REGISTRAR ? 'REGISTRO' : 'ACTUALIZACIÓN';
    
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

  accion(acc){
    
    if ( acc === 'GUARDAR' ) {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.invalid) {
        return;
      }

      let consulta: any = {
        proceso: {
          idProceso: this.PROCESO.idProceso
        },
        estado: this.procesoConsulta?.estado,
        ...this.formGroup.getRawValue()
      };
      
      if (this.btnValue === this.ACC_REGISTRAR) {
        this.registrarConsulta(consulta);
      } else {
        this.actualizarConsulta(consulta);
      }
      
    } else {
      this.closeModal();
    }
    
  }

  registrarConsulta(consulta: any) {
    this.procesoConsultaService.registrar(consulta).subscribe(res => {
      if (res === null) {
        functionsAlertMod2.warningMensage('No se puede registrar la consulta');
      } else {
        functionsAlertMod2.success('Registrado').then((result) => {
          this.dialogRef.close(res);
        });
      }
    });
  }

  actualizarConsulta(consulta: any) {
    
    consulta = {	
      ...consulta,
      procesoConsultaUuid: this.procesoConsulta.procesoConsultaUuid
    }
    
    this.procesoConsultaService.actualizar(consulta).subscribe(res => {
      if (res === null) {
        functionsAlertMod2.warningMensage('No se puede actualizar la consulta');
      } else {
        functionsAlertMod2.success('Actualizado').then((result) => {
          this.dialogRef.close(res);
        });
      }
    });

  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_SECCION,
    ]).subscribe(listRes => {
      this.listTipoSeccion = listRes[0];
    })
  }
}
