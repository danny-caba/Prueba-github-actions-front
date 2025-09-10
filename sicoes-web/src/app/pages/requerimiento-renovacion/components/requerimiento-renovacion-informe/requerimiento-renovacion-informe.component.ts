import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subject, takeUntil } from 'rxjs';

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
  tieneCambios = false;
  private destroy$ = new Subject<void>();
  private guardando = false;

  constructor(
    private snackBar: MatSnackBar,
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
      this.requerimiento=d;
    });

    this.informeRenovacionService.obtener(this.nuExpediente).subscribe(informe=>{
      this.formGroup.patchValue({
        idInformeRenovacion: informe.idInformeRenovacion || null,
        usuario: informe.usuario || null,
        notificacion: informe.notificacion || null,
        requerimiento: informe.requerimiento || null,
        aprobaciones: informe.aprobaciones || null,
        objeto: informe.deObjeto || '',
        baseLegal: informe.deBaseLegal || '',
        antecedentes: informe.deAntecedentes || '',
        justificacion: informe.deJustificacion || '',
        necesidad: informe.deNecesidad || '',
        conclusiones: informe.deConclusiones || '',
        vigente: informe.vigente || false,
        registro: informe.registro || '',
        completado: informe.completado || '',
        estadoAprobacionInforme: informe.estadoAprobacionInforme || null
      }, { emitEvent: false }); 
    });
    // Escuchar cambios en TODO el formulario
    this.formGroup.valueChanges.subscribe(() => {
      this.onDataChange();
    });

//    this.setupAutoguardadoPeriodico();
  }

  registrar() {
    console.log("registrar")
    if (this.validarForm()) return;
    functionsAlert.questionSiNoEval('¿Seguro de enviar el informe para las firmas?',"Informe de Requerimiento de Renovación").then((result) => {
        if(result.isConfirmed){
        const informe = this.formGroup.value;
        this.requerimiento.solicitudPerfil = {idSolicitud:this.requerimiento.idSoliPerfCont}
        informe.requerimiento = this.requerimiento;
        informe.completado=1;
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
  
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.tieneCambios) {
      event.preventDefault();
      event.returnValue = '';
      return;
    }
  }

  @HostListener('window:unload', ['$event'])
  onUnload(event: Event): void {
    if (this.tieneCambios) {
      this.guardarBorrador();
    }
  }  

  onDataChange(): void {
    this.tieneCambios = true;
  }

  private setupAutoguardadoPeriodico(): void {
    interval(30000) // Cada 30 segundos
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.tieneCambios && !this.guardando) {
          this.guardarBorrador();
        }
      });
  }

  guardarBorrador() {
    this.guardando=true;
    const informe = this.formGroup.value;
    this.requerimiento.solicitudPerfil = {idSolicitud:this.requerimiento.idSoliPerfCont}
    informe.requerimiento = this.requerimiento;
    informe.completado=0;
    this.informeRenovacionService.registrar(informe).subscribe({
      next: () => {
        this.snackBar.open('Autoguardado exitoso...', 'Cerrar', { duration: 1000 });
        this.guardando=false;
      },
    });
  }

  cancelar(){
    if(this.tieneCambios){
      console.log("cambios pendiente  ")
      this.guardarBorrador();
    }else{
      console.log("sin cambios pendiente  ")
    }
    this.router.navigate([
      Link.INTRANET, 
      Link.REQUERIMIENTO_RENOVACION_LIST, 
      this.requerimiento.idSoliPerfCont]);
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

  estaGuardando():boolean{
    return this.guardando;
  }
}
