import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { PersonaService } from 'src/app/service/persona.service';
import { SaldoService } from 'src/app/service/saldo.service';
import { Requerimiento } from 'src/app/interface/requerimiento.model';
import { RequerimientoService } from 'src/app/service/requerimiento.service';

@Component({
  selector: 'vex-requerimiento-invitacion-list',
  templateUrl: './requerimiento-invitacion-list.component.html',
  styleUrls: ['./requerimiento-invitacion-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RequerimientoInvitacionListComponent extends BasePageComponent<Requerimiento> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  send: boolean = false;
  requerimiento: Requerimiento;

  ACC_ENVIAR_INVITACION = 'ACC_ENVIAR_INVITACION';

  formGroup = this.fb.group({
    supervisor: [null],
    saldoContrato: [null]
  });

  dataSourceSupervisor = new MatTableDataSource<any>();
  listAllSupervisores: any;
  // Lista filtrada por perfil actual
  listSupervisoresFiltradosPorPerfil: any[] = [];
  filteredSupervisores$: Observable<any[]>;

  private readonly destroy$ = new Subject<void>();

  displayedColumns: string[] = [
    'fechaInvitacion',
    'fechaVencimiento',
    'fechaAceptacion',
    'nombresApellidos',
    'saldoContrato',
    'estado',
    'acciones'
  ];

  constructor(
    private authFacade: AuthFacade,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private supervisoraService: SupervisoraService,
    private personaService: PersonaService,
    private saldoService: SaldoService,
    private requerimientoService: RequerimientoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarTabla();

    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.activeRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.send = data.send || false;
      });

    this.requerimientoService.requerimiento$
      .pipe(takeUntil(this.destroy$))
      .subscribe(requerimiento => {
        if(requerimiento) {
          this.requerimiento = requerimiento;
          this.listarSupervisoresPorPerfil();
        } else {
          this.router.navigate([Link.INTRANET, Link.REQUERIMIENTOS_LIST]);
        }
      });

    const requerimientoActual = this.requerimientoService.getRequerimiento();
    
    if(requerimientoActual) {
      this.requerimiento = requerimientoActual;
    }
    
  }

  setListSupervisores(list: any) {
    this.listSupervisoresFiltradosPorPerfil = list;

    this.filteredSupervisores$ = this.formGroup.controls.supervisor.valueChanges.pipe(
      startWith(''),
      map((value: any) => typeof value === 'string' ? value : value?.nombres),
      map(supervisor => supervisor ? this.filterSupervisores(supervisor) : this.listSupervisoresFiltradosPorPerfil.slice())
    );
  }

  filterSupervisores(nombreUsuario: string) {
    return this.listSupervisoresFiltradosPorPerfil.filter(supervisor =>
      supervisor.nombres?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  serviceTable(filtro) {
    return this.requerimientoService.listarInvitaciones(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  obtenerFiltro() {
    let filtro: any = {}
    return filtro;
  }

  mostrarOpcion(opt, requerimiento: Requerimiento) {
    // if(opt == this.ACC_MODIFICAR && this.isUpdatable(requerimiento)) return true;
    return false;
  }

  displayFn(codi: any): string {
    if (!codi) return '';
    
    if (codi.nombre) {
      return codi.nombre;
    }
    
    return '';
  }

  blurSupervisor() {
    setTimeout(() => {
      if (!(this.formGroup.controls.supervisor.value instanceof Object)) {
        this.formGroup.controls.supervisor.setValue("");
        this.formGroup.controls.supervisor.markAsTouched();
      }
    }, 200);
  }

  listarSupervisoresPorPerfil() {
    this.formGroup.get('supervisor').setValue('');

    this.supervisoraService.listarProfesionalesPerfil(this.requerimiento.perfil.idListadoDetalle)
    .subscribe(respuesta => {
      this.dataSourceSupervisor.data = respuesta;
      this.listAllSupervisores = this.dataSourceSupervisor.data;
      this.setListSupervisores(respuesta);
    });
  }

  onSupervisorSelected(supervisor: any) {
    if (supervisor && supervisor.numeroDocumento) {
      this.personaService.validarVinculoLaboral(supervisor.numeroDocumento).subscribe(
        (response: any) => {
          if (response.respuesta == '1') {
            // Si tiene vínculo laboral con Osinergmin, mostrar alerta y limpiar el campo
            functionsAlert.vigente(`No es posible realizar la invitación.`, `La invitación al supervisor persona natural ${supervisor.nombre}, mantiene vínculo laboral con OSINERGMIN`).then((result) => {
              this.formGroup.get('supervisor').setValue('');
            });
          } else {
            this.saldoService.obtenerSaldoSupervisora(supervisor.idSupervisora).subscribe(respuesta => {
              if(respuesta.saldoContrato) {
                if (respuesta.cantidad > 730) {
                  functionsAlert.vigente(`No es posible realizar la invitación.`, `La invitación al supervisor persona natural ${supervisor.nombre}, supera el período máximo de contratación (02 años)`).then((result) => {
                    this.formGroup.get('supervisor').setValue('');
                  });
                } else {
                  this.formGroup.get('saldoContrato').setValue(respuesta.saldoContrato);
                }
              }
            });
          }
        },
        (error) => {
          console.error('Error al validar trabajador:', error);
        }
      );
    }
  }

  enviarInvitacion(accion: string) {
    switch (accion) {
      case this.ACC_ENVIAR_INVITACION:
        
        break;
      default:
        break;
    }
  }

  regresar() {
    this.router.navigate([Link.INTRANET, Link.REQUERIMIENTOS_LIST]);
  }
}
