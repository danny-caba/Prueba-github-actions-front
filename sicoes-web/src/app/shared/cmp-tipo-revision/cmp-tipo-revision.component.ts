import { Component, OnDestroy, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from "@angular/core";

import { Subscription } from "rxjs";
import { SolicitudService } from "src/app/service/solicitud.service";
import { UntypedFormControl } from "@angular/forms";
import { SolicitudEstadoEnum } from "src/helpers/constantes.components";

@Component({
  selector: "vex-cmp-tipo-revision",
  templateUrl: "./cmp-tipo-revision.component.html",
  styleUrls: ["./cmp-tipo-revision.component.scss"],
})
export class CmpTipoRevisonComponent implements OnInit, OnDestroy, OnChanges {

  suscriptionSolicitud: Subscription;
  @Input() editable: boolean = false;
  @Output() changeVersion: EventEmitter<any> = new EventEmitter();

  ctrlTipoRevision: UntypedFormControl = new UntypedFormControl();

  listTipoRevision: any[] = [{
    codigo: 'V1', 
    valor: '1.- Primera Evaluación'
  }, {
    codigo: 'V2', 
    valor: '2.- Subsanación de Observación'
  }];

  constructor(private solicitudService: SolicitudService) {
    this.suscribirSolicitud();
  }

  ngOnInit() {
    if(this.editable == true){
      this.ctrlTipoRevision.enable();
    }else{
      this.ctrlTipoRevision.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.editable == true){
      this.ctrlTipoRevision.enable();
      this.changeValue();
    }
  }

  changeValue(){
    this.ctrlTipoRevision.valueChanges.subscribe(value => {
      this.changeVersion.emit(value);
    })
  }

  private suscribirSolicitud(){
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      if(sol?.solicitudUuid && sol?.solicitudUuidPadre  && sol.estado?.codigo != SolicitudEstadoEnum.OBSERVADO){
        this.ctrlTipoRevision.setValue(this.listTipoRevision[1]);
      }else{
        this.ctrlTipoRevision.setValue(this.listTipoRevision[0]);
      }
    });
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  

}
