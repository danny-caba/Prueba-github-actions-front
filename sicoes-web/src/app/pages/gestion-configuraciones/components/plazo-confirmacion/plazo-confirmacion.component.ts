import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SeccionService } from '../../../../service/seccion.service';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { FormBuilder } from '@angular/forms';
import { PlazoConfirmacion } from 'src/app/interface/plazo-confirmacion.model';
import { PlazoConfirmacionService } from 'src/app/service/plazo-confirmacion.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'vex-plazo-confirmacion',
  templateUrl: './plazo-confirmacion.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class PlazoConfirmacionComponent extends BaseComponent implements OnInit {
  
  formGroupPlazo = this.fb.group({
    fechaBase: [null],
    tipoDia: [1],
    numeroDias: [1],
  });

  plazo:PlazoConfirmacion

  listOpcion: any = [
    {
      key: 1,
      value: 'Calendario'
    },
    {
      key: 2,
      value: 'Hábiles'
    },
  ];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private seccionService: SeccionService,
    private plazoConfirmacionService :PlazoConfirmacionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.obtenerPlazoConfirmacion();
  }

  obtenerPlazoConfirmacion(): void {
    this.plazoConfirmacionService.buscarPlazoConfirmacion('1') 
      .subscribe({
        next: (plazos: PlazoConfirmacion[]) => {
          if (plazos && plazos.length > 0) {
            this.plazo = plazos[0];
            this.formGroupPlazo.patchValue({
              fechaBase: this.plazo.fechaBase, 
              tipoDia: this.plazo.tipoDia || 1,
              numeroDias: this.plazo.numeroDias
            });
          } else{
            this.plazo={tipoDia:1,fechaBase:"Fecha Invitacíón"}
          }
        },
        error: (error) => {
          console.error('Error en la suscripción:', error);
          this.plazo={tipoDia:1,fechaBase:"Fecha Invitacíón"}
        }
      });
  }

  guardarPlazo(): void {
    console.log("guarda")
    if (this.formGroupPlazo.valid) {
      const formValue = this.formGroupPlazo.value;
      console.log(formValue)
      const request: any = {
        descripcion: this.plazo?.descripcion || 'Plazo configurado',
        fechaBase: formValue.fechaBase || "Fecha Invitacíón",
        estado: '1',
        tipoDia: this.plazo.tipoDia || 1,
        numeroDias: formValue.numeroDias 
      };

      // Si ya existe un plazo, agregar el ID para actualización
      if (this.plazo?.idPlazoConfirmacion) {
        request.idPlazoConfirmacion = this.plazo.idPlazoConfirmacion;
      }

      this.plazoConfirmacionService.registrarPlazoConfirmacion(request)
        .subscribe({
          next: (response) => {
            if (response) {
              this.plazo = response;
              functionsAlert.success('Plazo de confirmación guardado correctamente');
            }
          },
          error: (error) => {
            console.error('Error en la suscripción al guardar:', error);
          }
        });
    }
  }

  serviceTable(filtro) {
    return this.seccionService.obtenerSeccion(filtro);
  }

  obtenerFiltro() {
    return {};
  }

  tipoDiaChange(change: MatRadioChange): void {
    console.log(change.value)
    this.plazo.tipoDia=change.value
  }
}
