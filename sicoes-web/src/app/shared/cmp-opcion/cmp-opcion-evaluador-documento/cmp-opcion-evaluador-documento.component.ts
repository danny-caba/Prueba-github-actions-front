import {Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { OtroRequisitoService } from 'src/app/service/otro-requisito.service';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { Opcion } from 'src/helpers/constantes.options.';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ModalOtroRequisitoObservacionComponent } from '../../modal-otro-requisito-observacion/modal-otro-requisito-observacion.component';


@Component({
  selector: 'vex-cmp-opcion-evaluador-documento',
  templateUrl: './cmp-opcion-evaluador-documento.component.html',
  styleUrls: ['./cmp-opcion-evaluador-documento.component.scss']
})
export class CmpOpcionEvaluadorDocumentoComponent implements OnInit {

  opcion = Opcion
  @Input() SOLICITUD: any;
  @Input() objEvaluar: any = {};
  @Input() otro: any = {};
  listOpcion: ListadoDetalle[] = []
  @Input() ultimaVersion: boolean

  formGroup = this.fb.group({
    observacion:[],
    evaluacion:[],
  });
  
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private parametriaService: ParametriaService,
    private otroRequisitoService: OtroRequisitoService
  ) {

  }

  ngOnInit() {
    this.cargarCombo();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.RESULTADO_EVALUACION,
      
    ]).subscribe( listRes => {
      listRes[0]?.forEach(item => {
        if(!['RE_01', 'RE_07'].includes(item.codigo)){
          this.listOpcion.push(item);
        }

        if(item.codigo == 'RE_04' && this.SOLICITUD.solicitudUuidPadre){
          item.editable = true;
        }

      });

    })
  }

  getEvaluar(){
    let obj = this.formGroup.getRawValue();
    return obj;
  }

  registrarObs(otro){
    this.registrarObsAcc(otro, 'add');
  }

  registrarObsAcc(otro, accion){
    this.dialog.open(ModalOtroRequisitoObservacionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        otroRequisito: otro,
        accion: accion
      },
    })
  }

  guardarEstado(val, otro){
    otro.evaluacion = {
      idListadoDetalle: val.value
    }
    this.otroRequisitoService.evaluarOtroRequisito(otro).subscribe(res => {
      functionsAlert.success('Requisito Actualizado').then((result) => {
        
      });
    });
  }

}
