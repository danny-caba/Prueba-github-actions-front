import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { BaseComponent } from '../components/base.component';
import { EvaluadorRol, ListadoEnum } from 'src/helpers/constantes.components';
import { PerfilService } from 'src/app/service/perfil.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { PerfilInscripcion } from 'src/app/interface/perfil-insripcion.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Profesion } from 'src/app/interface/profesion.model';
import { Division } from 'src/app/interface/division.model';
import { SolicitudService } from 'src/app/service/solicitud.service';

@Component({
  selector: 'vex-cmp-perfil',
  templateUrl: './cmp-perfil.component.html',
  styleUrls: ['./cmp-perfil.component.scss']
})
export class CmpPerfilComponent extends BaseComponent implements OnInit {

  @Input() solicitud: Partial<Solicitud>
  perfilInscripcion: PerfilInscripcion

  @Output() actualizarTabla: EventEmitter<any> = new EventEmitter();

  filteredStatesTecnico$: Observable<any[]>;

  listAprobadoresALL: any[] = [];
  listGrupos: ListadoDetalle[]
  listaProfesiones: Profesion[];
  listaDivisiones: Division[];
  idProfesionSeleccionada: number;
  idDivisionSeleccionada: number;
  isProfesionDivisionDefinidos: boolean;

  grupoPerfilSeleccionado: string = null;
  filteredPerfiles$: Observable<any[]>;
  listaPerfiles: any;

  formGroup = this.fb.group({
    aprobador: [null as any, Validators.required]
  });
  
  

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private parametriaService: ParametriaService,
    private snackbar: MatSnackBar,
    private solicitudService: SolicitudService,
  ) {
    super();
    
    this.listarProfesiones()
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      aprobador: [null, Validators.required]
    });

    this.isProfesionDivisionDefinidos = false;
    functionsAlert.info('La solicitud del Registro de Precalificación es a nivel de "División", por lo que tiene la posibilidad de poder postular las veces que sean necesarias, considerando la selección de perfiles que no han sido elegidos en sus postulaciones anteriores.').then((result) => {
    });

    this.cargarGrupoDesdeBackend();
  }

  listarPerfiles() {
    this.parametriaService.buscarPerfiles().subscribe(listRes => {
      this.listAprobadoresALL = listRes;

      this.filteredStatesTecnico$ = this.formGroup.controls.aprobador.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.detalle),
        map(state => state ? this.filterStatesTec(state) : this.listAprobadoresALL.slice())
      );

    })
  }

  filterStatesTec2(nombreUsuario: string) {
    return this.listAprobadoresALL.filter(state =>
      state.detalle?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  filterStatesTec(nombreUsuario: string): any[] {
    const texto = nombreUsuario?.toLowerCase() || '';
    return this.listAprobadoresALL.filter(p =>
      p.detalle?.toLowerCase().includes(texto)
    );
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.aprobador.value instanceof Object)) {
        this.formGroup.controls.aprobador.setValue("");
        this.formGroup.controls.aprobador.markAsTouched();
      }
    }, 200);
  }

  displayFn(codi: any): string {
    return codi && codi.detalle ? codi.detalle : '';
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  guardar() {
    if (this.formGroup.invalid) return;

    const perfilSeleccionado = this.formGroup.controls.aprobador.value;

    const perfilObjeto = typeof perfilSeleccionado === 'string'
      ? this.listAprobadoresALL.find(p => p.detalle === perfilSeleccionado)
      : perfilSeleccionado;

    const nombrePerfil = perfilObjeto?.perfil?.nombre;
    if (!nombrePerfil) {
      this.snackbar.open('Debe seleccionar un perfil válido.', 'Cerrar', { duration: 3000 });
      return;
    }

    const grupoActual = this.obtenerGrupoPerfil(nombrePerfil);

    if (this.grupoPerfilSeleccionado && grupoActual !== this.grupoPerfilSeleccionado) {
      this.snackbar.open('El perfil seleccionado no corresponde al grupo permitido.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.grupoPerfilSeleccionado) {
      this.grupoPerfilSeleccionado = grupoActual;

      this.listAprobadoresALL = this.listAprobadoresALL.filter(p => {
        const grupo = this.obtenerGrupoPerfil(p.perfil?.nombre);
        return grupo === grupoActual;
      });

      this.filteredStatesTecnico$ = this.formGroup.controls.aprobador.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.detalle),
        map(name => this.filterStatesTec(name))
      );
    }

    const payload: any = {
      solicitud: { solicitudUuid: this.solicitud.solicitudUuid },
      ...perfilObjeto
    };

    this.perfilService.registrar(payload).subscribe(res => {
      functionsAlert.success('Registrado').then(() => {
        this.formGroup.controls.aprobador.reset();
        this.actualizarTabla.emit(res);

        if (!this.isProfesionDivisionDefinidos) {
          const formValues = this.obtenerDatos();
          this.solicitudService.actualizarBorradorPN(formValues).subscribe();
        }

        this.isProfesionDivisionDefinidos = true;
      });
    });
  }

  private _filterPerfiles(value: string): any[] {
    const filterValue = value?.toLowerCase() || '';
    return this.listaPerfiles
      .filter(p => {
        const grupo = this.grupoPerfilSeleccionado ? this.obtenerGrupoPerfil(p.nombre) : null;
        const coincideGrupo = !this.grupoPerfilSeleccionado || grupo === this.grupoPerfilSeleccionado;
        return coincideGrupo && p.detalle.toLowerCase().includes(filterValue);
      });
  }

  obtenerDatos() {
    let profesion = {
      idProfesion: this.idProfesionSeleccionada
    }
    let division = {
      idDivision: this.idDivisionSeleccionada
    }

    let formValues: any = {
      ...this.solicitud,
      profesion: profesion,
      division: division,
    }

    return formValues;
  }

  inicializarDatos() {
    this.idProfesionSeleccionada = this.solicitud.profesion?.idProfesion;
    if (this.idProfesionSeleccionada) {
      this.parametriaService.listarDivisionesPorProfesion(this.idProfesionSeleccionada).subscribe(listaDivisiones => {
        this.listaDivisiones = listaDivisiones;
        this.idDivisionSeleccionada = this.solicitud.division?.idDivision;
        this.parametriaService.listarPerfilesPorProfesionDivision(this.idProfesionSeleccionada, this.idDivisionSeleccionada).subscribe(listRes => {
          this.isProfesionDivisionDefinidos = true;

          const perfiles = listRes || [];

          if (this.grupoPerfilSeleccionado) {
            this.listAprobadoresALL = perfiles.filter(p => {
              const grupo = this.obtenerGrupoPerfil(p.perfil?.nombre);
              return grupo === this.grupoPerfilSeleccionado;
            });
          } else {
            this.listAprobadoresALL = perfiles;
          }

          this.filteredStatesTecnico$ = this.formGroup.controls.aprobador.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value?.detalle),
            map(state => state ? this.filterStatesTec(state) : this.listAprobadoresALL.slice())
          );
        });
      })
    }
  }

  listarProfesiones() {
    this.parametriaService.listarProfesiones().subscribe(listaProfesiones => {
      this.listaProfesiones = listaProfesiones;
    })
  }

  listarDivisionesPorProfesion(event) {
    this.parametriaService.listarDivisionesPorProfesion(event.value).subscribe(listaDivisiones => {
      this.listaDivisiones = listaDivisiones;
      if (this.solicitud.division?.idDivision) {
        this.idDivisionSeleccionada = this.solicitud.division?.idDivision;
      }
    })
  }

  listarPerfilesPorProfesionDivision(event) {
    const idDivision = event.value;

    this.parametriaService.listarPerfilesPorProfesionDivision(this.idProfesionSeleccionada, idDivision)
      .subscribe(listRes => {
        const perfiles = listRes || [];

        const perfilActual = this.formGroup.controls.aprobador.value;
        const grupoActual = perfilActual?.perfil?.nombre ? this.obtenerGrupoPerfil(perfilActual.perfil.nombre) : null;

        const grupoFiltrar = this.grupoPerfilSeleccionado || grupoActual;

        if (grupoFiltrar) {
          this.grupoPerfilSeleccionado = grupoFiltrar;

          this.listAprobadoresALL = perfiles.filter(p => {
            const grupo = this.obtenerGrupoPerfil(p.perfil?.nombre);
            return grupo === grupoFiltrar;
          });

          if (this.listAprobadoresALL.length === 0) {
            this.snackbar.open('No hay perfiles de este grupo en la división seleccionada.', 'Cerrar', { duration: 3000 });
          }
        } else {
          this.listAprobadoresALL = perfiles;
        }

        this.filteredStatesTecnico$ = this.formGroup.controls.aprobador.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.detalle),
          map(name => this.filterStatesTec(name))
        );
      });
  }

  obtenerGrupoPerfil(nombrePerfil: string): string | null {
    if (!nombrePerfil) return null;

    if (nombrePerfil.includes('S4A') || nombrePerfil.includes('S4B')) return 'S4';
    if (nombrePerfil.includes('S1') || nombrePerfil.includes('S2') || nombrePerfil.includes('S3')) return 'S1-S3';

    return null;
  }

  cargarGrupoDesdeBackend() {
    const filtro = { solicitudUuid: this.solicitud.solicitudUuid };

    this.perfilService.buscarPerfiles(filtro).subscribe(response => {
      const perfilesSeleccionados = response.content || [];

      if (perfilesSeleccionados.length > 0) {
        const grupos = new Set(perfilesSeleccionados.map(p => this.obtenerGrupoPerfil(p.perfil?.nombre)));
        if (grupos.size === 1) {
          this.grupoPerfilSeleccionado = grupos.values().next().value;

        } else {
          console.warn('Perfiles con distintos grupos, no se puede aplicar un filtro único.');
          this.grupoPerfilSeleccionado = null;
        }
      }

      this.inicializarDatos();
    });
  }

  recargarFiltros() {
    this.grupoPerfilSeleccionado = null;
    this.formGroup.controls.aprobador.reset();
    this.idDivisionSeleccionada = null;
    this.idProfesionSeleccionada = null;
    this.listaDivisiones = [];
    this.filteredStatesTecnico$ = of([]);
    this.isProfesionDivisionDefinidos = false;

    this.cargarGrupoDesdeBackend(); 
  }

}
