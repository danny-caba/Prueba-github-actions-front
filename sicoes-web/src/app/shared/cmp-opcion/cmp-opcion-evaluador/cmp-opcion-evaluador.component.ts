import {Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { ListadoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';
import { functionsAlert } from 'src/helpers/functionsAlert';


@Component({
  selector: 'vex-cmp-opcion-evaluador',
  templateUrl: './cmp-opcion-evaluador.component.html',
  styleUrls: ['./cmp-opcion-evaluador.component.scss']
})
export class CmpOpcionEvaluadorComponent implements OnInit, OnChanges {

  suscriptionSolicitud: Subscription;
  @Input() objEvaluar: any = {};
  @Input() editable: boolean = true;
  listOpcion: ListadoDetalle[] = []
  SOLICITUD: any

  formGroup = this.fb.group({
    observacion:[],
    evaluacion:[null as ListadoDetalle, Validators.required],
  });
  
  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService
  ) {

  }

  ngOnInit() {
    //this.cargarCombo();
    this.suscribirSolicitud();
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
    this.formGroup.markAllAsTouched();
    if(!this.formGroup.valid){
      functionsAlert.error("Seleccione Resultado")
      return null;
    }
  

    let obj = this.formGroup.getRawValue();
    return obj;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.objEvaluar && this.listOpcion.length != 0){
      this.formGroup.controls.observacion.setValue(this.objEvaluar.observacion);
      this.formGroup.controls.evaluacion.setValue(this.listOpcion.find(c => c.codigo === this.objEvaluar.evaluacion?.codigo));
    }
    if(this.editable == false){
      this.formGroup.disable();
    }else{
      this.formGroup.enable();
    }
  }

  bloquearOpbObservado = false;

  private suscribirSolicitud(){
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      if(sol?.solicitudUuid){
        this.SOLICITUD = sol;
        this.cargarCombo();
      }
    });
  }


}
