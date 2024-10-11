import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { BaseComponent } from '../components/base.component';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { PerfilInscripcion } from 'src/app/interface/perfil-insripcion.model';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ProcesoEtapaService } from 'src/app/service/proceso-etapa.service';
import { DatePipe } from '@angular/common';
import { Proceso } from 'src/app/interface/proceso.model';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-cmp-fecha-etapa',
  templateUrl: './cmp-fecha-etapa.component.html',
  styleUrls: ['./cmp-fecha-etapa.component.scss']
})
export class CmpFechaEtapaComponent extends BaseComponent implements OnInit {

  @Input() PROCESO: Partial<Proceso>
  perfilInscripcion: PerfilInscripcion

  @Output() actualizarTabla: EventEmitter<any> = new EventEmitter();

  filteredStatesTecnico$: Observable<any[]>;
  isDisabled: boolean = true;
  listAprobadoresALL: any[] = [];
  listGrupos: ListadoDetalle[]

  formGroup = this.fb.group({
    fechaInicio: [null as any, Validators.required],
    fechaFin: [null as any, Validators.required],
    etapa: [null as any, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private evaluadorService: EvaluadorService,
    private procesoEtapaService: ProcesoEtapaService, 
    private datePipe: DatePipe,
  ) {
    super();
  }

  ngOnInit() {
    this.cargarCombo();
    this.seleccionarEtapaPorDefecto();
    
  }

  seleccionarEtapaPorDefecto(){
    const defaultValueObj = this.listGrupos.find(obj => obj.idListadoDetalle === 744);
    if (defaultValueObj) {
      this.formGroup.controls.etapa.setValue(defaultValueObj);
    }
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ETAPA_PROCESO
    ]).subscribe(listRes => {
      this.listGrupos = listRes[0];
      console.log(this.formGroup.controls);
    })
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  guardar() {
    const fechaNoValida = new Date('2100-01-01');
    const fechaFin = this.formGroup.controls['fechaFin'].value;
    if (this.validarForm() || new Date(fechaFin) > fechaNoValida) return;
    let obj: any = this.formGroup.getRawValue();
    obj.proceso = { procesoUuid: this.PROCESO.procesoUuid};
    obj.fechaInicio = this.datePipe.transform(this.formGroup.controls['fechaInicio'].value, 'dd/MM/yyyy');
    obj.fechaFin = this.datePipe.transform(this.formGroup.controls['fechaFin'].value, 'dd/MM/yyyy');

    this.procesoEtapaService.registrarProcesoEtapa(obj).subscribe(listRes => {
      functionsAlertMod2.success('Datos Guardados').then((result) => {
        this.formGroup.reset();
        this.seleccionarEtapaPorDefecto();
        this.actualizarTabla.emit(result);
      });
    });

  }
  
  /* eliminar(obj){
    functionsAlertMod2.preguntarSiNoIcono('¿Seguro que desea eliminar el perfil profesional?').then((result) => {
      if (result.isConfirmed) {
        this.evaluadorService.eliminarAprobador(obj.idAsignacion).subscribe(listRes => {
          functionsAlertMod2.success('Registro Eliminado').then((result) => {
            this.actualizarTabla.emit(result);
          });
        });
      }
    }); 
   
  }
   */


}
