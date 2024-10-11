import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { BaseComponent } from '../components/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ProcesoItemsPerfilService } from 'src/app/service/proceso-items-perfil.service';
import { functions } from 'src/helpers/functions';

@Component({
  selector: 'vex-cmp-item-perfil',
  templateUrl: './cmp-item-perfil.component.html',
  styleUrls: ['./cmp-item-perfil.component.scss']
})
export class CmpItemPerfilComponent extends BaseComponent implements OnInit,OnChanges {

  @Input() procesoItem;
  @Input() PROCESO;

  @Output() actualizarTabla: EventEmitter<any> = new EventEmitter();

  filteredStatesTecnico$: Observable<any[]>;

  listAprobadoresALL: any[] = [];
  listGrupos: ListadoDetalle[]

  formGroup = this.fb.group({
    aprobador: [null as any, Validators.required],
    nroProfesionales: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private procesoItemsPerfilService: ProcesoItemsPerfilService,
    private parametriaService: ParametriaService,
    private snackbar: MatSnackBar,
  ) {
    super();
    
    
  }

  ngOnInit() {

    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.PROCESO){
      this.listarPerfiles();
    }
  }

  listarPerfiles() {
    this.parametriaService.filtrarPerfiles(this.PROCESO?.subsector?.idListadoDetalle).subscribe(listRes => {
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
    /*if(!this.procesoItem){
      functions.error("Primero debe registrar la información del item")
    }*/

    if (this.validarForm()) return;
    
    let perfilItem: any = {
      /*procesoItem: {
        idProcesoItem: this.procesoItem.idProcesoItem,
        procesoItemUuid: this.procesoItem.procesoItemUuid,
      },*/
      nroProfesionales: parseInt(this.formGroup.controls.nroProfesionales.value),
      ...this.formGroup.controls.aprobador.getRawValue()
    };

    /*this.procesoItemsPerfilService.registrarProcesoItemsPerfil(perfilItem).subscribe(res => {
      functionsAlert.success('Registrado').then((result) => {
        this.formGroup.reset();
        this.actualizarTabla.emit(result);
      });
    })*/

    if(functions.esVacio(perfilItem.perfil)) return;
    if(functions.esCero(perfilItem.nroProfesionales) || isNaN(perfilItem.nroProfesionales)){
      this.formGroup.controls.nroProfesionales.setErrors({ validarNoCero: true }); 
      return;
    };

    this.actualizarTabla.emit(perfilItem);
    this.formGroup.reset();
  }
  
  pegarSoloNumeros(event: any) {
    const pastedText = event.clipboardData.getData('text/plain');
    if (!(/^\d+$/.test(pastedText))) {
      event.preventDefault();
    }
  }

}
