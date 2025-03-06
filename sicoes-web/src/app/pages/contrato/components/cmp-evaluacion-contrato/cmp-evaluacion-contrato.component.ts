import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Opcion } from 'src/helpers/constantes.options.';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { RequisitoService } from '../../../../service/requisito.service';
import { ModalEvaluacionContratoObservacionComponent } from 'src/app/shared/modal-evaluacion-contrato-observacion/modal-evaluacion-contrato-observacion.component';

@Component({
  selector: 'vex-cmp-evaluacion-contrato',
  templateUrl: './cmp-evaluacion-contrato.component.html'
})
export class CmpEvaluacionContratoComponent implements OnInit {

 opcion = Opcion
 currentRequisito: any;
 currentFechaEvaluacion: any;
 currentUsuarioEvaluacion: any;

  @Input() SOLICITUD: any;
  @Input() objEvaluar: any = {};
  @Input() requisito: any = {};
  @Input() ultimaVersion: boolean;
  @Input() editable: boolean = true;
  @Input() esPersonal: boolean = false;
  
  listOpcion: any = [
    {
      key: '1',
      value: 'Cumple'
    },
    {
      key: '2',
      value: 'No Cumple'
    },
    {
      key: '3',
      value: 'Observado'
    }
  ];


  formGroup = this.fb.group({
    observacion:[],
    evaluacion:[],
  });
  
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private requisitoService: RequisitoService,
  ) {

  }

  ngOnInit() {
    
    // if (this.esPersonal) {
    //   this.currentRequisito = this.requisito.requisito; 
    // } else {
    // if (!this.evaluacionInstancia) {
      this.currentRequisito = this.requisito;
    // }
    if (this.esPersonal) {
      this.currentFechaEvaluacion = this.requisito?.requisito?.fechaEvaluacion;
      this.currentUsuarioEvaluacion = this.requisito?.requisito?.usuarioEvaluacion?.usuario;
    } else {
      this.currentFechaEvaluacion = this.currentRequisito?.fechaEvaluacion;
      this.currentUsuarioEvaluacion = this.currentRequisito?.usuarioEvaluacion?.usuario;
      
      }
    // }
  }

  getEvaluar(){
    let obj = this.formGroup.getRawValue();
    return obj;
  }

  registrarObs(requisito){
    let accion = 'view';
    this.registrarObsAcc(requisito, accion);
  }

  registrarObsAcc(requisito, accion){
    this.dialog.open(ModalEvaluacionContratoObservacionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        requisito: requisito,
        accion: accion
      },
    })
  }

  guardarEstado(val, requisito){
    requisito.procRevision = val.value;
    let accion = this.editable ? 'add' : 'view';

    if (!this.esPersonal) {
      if (val.value === '1') {
        functionsAlert.questionSiNoEval('¿Está seguro de querer finalizar la revisión de requisitos del formulario de perfeccionamiento del contrato?').then((result) => {
          if(result.isConfirmed){
            this.requisitoService.evaluarRequisito(requisito).subscribe(res => {
              functionsAlert.success('Requisito Evaluado').then((result) => {
                if (res) {
                  this.requisito = res;
                  this.ngOnInit();
                }
              });
            });
          } else {
            this.requisito.procRevision = '0';
            this.ngOnInit();
          }
        }); 
      } else {
        this.dialog.open(ModalEvaluacionContratoObservacionComponent, {
          width: '1200px',
          maxHeight: '100%',
          data: {
            requisito,
            accion,
            esPersonal: this.esPersonal
          },
        }).afterClosed().subscribe(res => {
          if (res) {
            this.requisito = res;
          } else {
            this.requisito.procRevision = '0';
          }
          this.ngOnInit();
        })
      }
    } else {
      if (val.value === '1') {
        functionsAlert.questionSiNoEval('¿Está seguro de querer finalizar la revisión de requisitos del formulario de perfeccionamiento del contrato?').then((result) => {
          if(result.isConfirmed){
            this.requisitoService.evaluarRequisitoPersonal(requisito).subscribe(res => {
              functionsAlert.success('Requisito Evaluado').then((result) => {
                this.requisito.requisito.usuarioEvaluacion = res.usuarioEvaluacion;
                // this.requisito.requisito.procRevision = res.usuarioEvaluacion;
                this.requisito.evaluacion = res.evaluacion;
                this.requisito.requisito.fechaEvaluacion = res.fechaEvaluacion;
                this.ngOnInit();
                
                // requisito = res;
              });
            });
          } else {
            this.requisito.requisito.procRevision = '0';
            this.ngOnInit();
          }
        }); 
      } else {
        this.dialog.open(ModalEvaluacionContratoObservacionComponent, {
          width: '1200px',
          maxHeight: '100%',
          data: {
            requisito,
            accion,
            esPersonal: this.esPersonal
          },
        }).afterClosed().subscribe(res => {
          if (res) {
            this.requisito.requisito.usuarioEvaluacion = res.usuarioEvaluacion;
            // this.requisito.requisito.procRevision = res.usuarioEvaluacion;
            this.requisito.evaluacion = res.evaluacion;
            this.requisito.requisito.fechaEvaluacion = res.fechaEvaluacion;
            this.ngOnInit();
            
            // requisito = res;
          } else {
            this.requisito.requisito.procRevision = '0';
            this.ngOnInit();
          }
        })
      }
    }
    
  }

}
