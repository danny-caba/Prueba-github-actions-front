import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { EstadoEvaluacionAdministrativa, EstadoEvaluacionTecnica, EvaluadorRol, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { MatDialog } from '@angular/material/dialog';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { FormBuilder } from '@angular/forms';
import { InformeRenovacionService } from 'src/app/service/informe-renovacion.service';
import { RequerimientoRenovacionService } from 'src/app/service/requerimiento-renovacion.service';
import { RequerimientoRenovacion } from 'src/app/interface/requerimiento-renovacion.model';

@Component({
  selector: 'vex-requerimiento-renovacion-informe',
  templateUrl: './requerimiento-renovacion-informe.component.html',
  styleUrls: ['./requerimiento-renovacion-informe.component.scss'],
})
export class RequerimientoRenovacionInformeComponent extends BaseComponent implements OnInit, OnDestroy {

  tipoPersonaEnum = TipoPersonaEnum
  EstadoEvaluacionAdministrativa = EstadoEvaluacionAdministrativa
  EstadoEvaluacionTecnica = EstadoEvaluacionTecnica
  formGroup: any;
  nuExpediente: string
  requerimiento: RequerimientoRenovacion;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private solicitudService: SolicitudService,
    private informeRenovacionService: InformeRenovacionService,
    private requerimientoRenovacionService: RequerimientoRenovacionService,
    private authFacade: AuthFacade,
    private fb: FormBuilder,
  ) {
    super();
    this.formGroup = this.fb.group({
      idInformeRenovacion: [null],
      usuario: [null],
      notificacion: [null],
      requerimiento: [null],
      aprobaciones: [null],
      objeto: [''],
      baseLegal: [''],
      antecedentes: [''],
      justificacion: [''],
      necesidad: [''],
      conclusiones: [''],
      vigente: [false],
      registro: [''],
      completado: [''],
      estadoAprobacionInforme: [null],
    });
  }

  ngOnInit(): void {
    this.nuExpediente = this.activatedRoute.snapshot.paramMap.get('idRequerimiento');
    this.requerimientoRenovacionService.obtenerPorNumeroExpediente(this.nuExpediente).subscribe(d=>{
      this.requerimiento = d;
    });
  }

  registrar() {
    if (this.validarForm()) return;
    functionsAlert.questionSiNoEval('¿Seguro de enviar el informe para las firmas?',"Informe...").then((result) => {
        if(result.isConfirmed){
        const informe = this.formGroup.value;
        this.requerimiento.solicitudPerfil = {idSolicitud:this.requerimiento.idSoliPerfCont}
        informe.requerimiento = this.requerimiento;
        this.informeRenovacionService.registrar(informe).subscribe({
          next: () => {
            functionsAlert.success('Informe registrado correctamente');
            this.router.navigate([Link.INTRANET, Link.REQUERIMIENTO_RENOVACION_LIST,this.requerimiento.idSoliPerfCont]);
          },
          error: () => {
            functionsAlert.error('Ocurrio un error al registrar el informe');
          }
        });
      } else {
      }
    });
        
  }  

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST]);
  }

  ngOnDestroy(): void {
    this.solicitudService.clearSolicitud();
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }  

}
