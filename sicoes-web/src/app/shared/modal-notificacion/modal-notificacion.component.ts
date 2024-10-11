import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { DatePipe } from '@angular/common';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { FormAdjuntosBtnComponent } from '../form-adjuntos-btn/form-adjuntos-btn.component';
import { SolicitudNotificacion } from 'src/app/interface/solicitud-notificacion.model';
import { NotificacionSolicitudService } from 'src/app/service/notificacion-solicitud.service';
import { NotificacionEnum } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';

@Component({
  selector: 'vex-modal-notificacion',
  templateUrl: './modal-notificacion.component.html',
  styleUrls: ['./modal-notificacion.component.scss']
})
export class ModalNotificacionComponent extends BaseComponent implements OnInit {

  @ViewChild('formAdjuntoBtnTA', { static: false }) formAdjuntoBtnTA: FormAdjuntosBtnComponent;

  solicitud: Solicitud
  solicitudNotificacion: SolicitudNotificacion
  data: any

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false

  booleanRespuesta: boolean = true

  formGroup = this.fb.group({
    fechaNotificacion: ['', Validators.required],
    observacion: ['']
  });

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalNotificacionComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private notificacionSolicitudService: NotificacionSolicitudService,
    private datePipe: DatePipe
  ) {
    super();

    this.data = data;
    this.solicitud = data?.solicitud;

    this.validarOpciones(data)

    if (data.solicitud) {
      this.cargarDatos(data.solicitud.solicitudUuid)
    }
  }

  ngOnInit(): void {
    
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
    this.booleanRespuesta = (data.tipo == NotificacionEnum.RESPUESTA);

    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';

    if (this.booleanView) {
      this.formGroup.disable();
    }
  }

  cargarDatos(idSolNotificacion) {
    if(this.data.tipo == 'RESPUESTA'){
      this.notificacionSolicitudService.respuesta(idSolNotificacion).subscribe(res => {
        if(res){
          this.mostrarDatos(res);
        }
        
      });
    }
    if(this.data.tipo == 'ARCHIVAMIENTO'){
      this.notificacionSolicitudService.archivamiento(idSolNotificacion).subscribe(res => {
        if(res){
          this.mostrarDatos(res);
        }
      });
    }
  }

  mostrarDatos(datos){
    this.solicitudNotificacion = datos;
    datos.fechaNotificacion = functions.getFechaString(datos.fechaNotificacion);
    this.formGroup.patchValue(datos);
  }

  guardar() {
    if (this.validarForm()) return;

    let notifi: any = {
      tipo: {
        codigo: this.data.tipo
      },
      
      solicitudUuid: this.solicitud.solicitudUuid,
      
      ...this.formGroup.getRawValue()
    };

    let archivo = this.formAdjuntoBtnTA.obtenerAdjuntos();
    if (archivo) {
      notifi.archivo = archivo;
    }

    notifi.fechaNotificacion = this.datePipe.transform(this.formGroup.controls['fechaNotificacion'].value, 'dd/MM/yyyy');
    
    this.notificacionSolicitudService.registratNotif(notifi).subscribe(res => {
      functionsAlert.success('Registrado').then((result) => {
        this.closeModal()
      });
    });
  }

}
