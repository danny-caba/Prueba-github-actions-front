import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
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
    //this.listarPerfiles();
  }

  ngOnInit() {
    this.isProfesionDivisionDefinidos = false;
    functionsAlert.info('La solicitud del Registro de Precalificación es a nivel de "División", por lo que tiene la posibilidad de poder postular las veces que sean necesarias, considerando la selección de perfiles que no han sido elegidos en sus postulaciones anteriores.').then((result) => {
    });

    this.inicializarDatos();
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

  filterStatesTec(nombreUsuario: string) {
    return this.listAprobadoresALL.filter(state =>
      state.detalle?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
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
    if (this.validarForm()) return;
    
    let perfil: any = {
      solicitud: {
        solicitudUuid: this.solicitud.solicitudUuid,
      },
      ...this.formGroup.controls.aprobador.getRawValue()
    };

    this.perfilService.registrar(perfil).subscribe(res => {
      functionsAlert.success('Registrado').then((result) => {
        this.formGroup.controls.aprobador.reset();
        this.actualizarTabla.emit(result);

        if (!this.isProfesionDivisionDefinidos) {
          let formValues = this.obtenerDatos();

          this.solicitudService.actualizarBorradorPN(formValues).subscribe(obj => {
            functionsAlert.success('Datos Actualizados').then((result) => {
            });
          });
        }

        this.isProfesionDivisionDefinidos = true;
      });
    })
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
          this.listAprobadoresALL = listRes;
          this.filteredStatesTecnico$ = this.formGroup.controls.aprobador.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value?.detalle),
            map(state => state ? this.filterStatesTec(state) : this.listAprobadoresALL.slice())
          );
        })
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
    this.parametriaService.listarPerfilesPorProfesionDivision(this.idProfesionSeleccionada, event.value).subscribe(listRes => {
      this.listAprobadoresALL = listRes;

      this.filteredStatesTecnico$ = this.formGroup.controls.aprobador.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.detalle),
        map(state => state ? this.filterStatesTec(state) : this.listAprobadoresALL.slice())
      );
    })
  }

}
