import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ParametriaService } from 'src/app/service/parametria.service';
import { PidoService } from 'src/app/service/pido.service';
import { ListadoEnum, TipoDocumentoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../../components/base.component';

@Component({
  selector: 'vex-layout-datos-representante-legal',
  templateUrl: './layout-datos-representante-legal.component.html',
  styleUrls: ['./layout-datos-representante-legal.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutDatosRepresentanteLegalComponent extends BaseComponent implements OnInit {

  @Input() SOLICITUD: any;
  @Input() editable: boolean = false;

  listTipoDocumento: any[] = []

  formGroup = this.fb.group({
    tipoDocumento: [{},Validators.required],
    numeroDocumento: ['', Validators.required],
    nombres: [''],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
  });

  constructor(
    private fb: FormBuilder,
    private pidoService: PidoService,
    private parametriaService: ParametriaService) {
    super();
    this.formGroup.controls['nombres'].disable({ emitEvent: false })
    this.formGroup.controls['apellidoPaterno'].disable({ emitEvent: false })
    this.formGroup.controls['apellidoMaterno'].disable({ emitEvent: false })
  }

  ngOnInit(): void {
    this.cargarCombo();
    if (!this.editable) {
      this.disableAllForm(this.formGroup);
    }

    if(this.editable){
      this.formGroup.controls.numeroDocumento.valueChanges.subscribe(value => {
        this.limpiarDatosDocumento();
      })
      this.formGroup.controls.tipoDocumento.valueChanges.subscribe(value => {
        this.limpiarDatosDocumento();
      })
    }
    
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.TIPO_DOCUMENTO]).subscribe(listRes => {
      listRes[0]?.forEach(item => {
        if (item.codigo != 'RUC') {
          this.listTipoDocumento.push(item);
        }
      });
    })
  }

  public validarRepresentante() {
    this.formGroup.markAllAsTouched();
    return this.formGroup.valid;
  }

  public getFormValues() {
    return this.formGroup.getRawValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.SOLICITUD) {
      this.setValues();
    }
  }

  setValues() {
    this.formGroup.patchValue(this.SOLICITUD?.representante)
  }

  public validarDocumento(tipoDocumento, numeroDocumento) {

    this.pidoService.buscarNroDocumentoRepresentante(tipoDocumento.codigo, numeroDocumento).subscribe({
      next: (resp) => {
        if (resp?.resultCode === '0000' || resp?.resultCode === '0') {

          this.formGroup.patchValue({
            ...resp
          })
          //this.disableControls(true);
        } else {
          //this.editable = true;
          functionsAlert.error(resp.deResultado);
          this.limpiarDatosDocumento();
          //this.disableControls(false);
        }
        if(tipoDocumento.codigo == TipoDocumentoEnum.CARNET_EXTRA && resp?.resultCode === '0001'){
          functionsAlert.error(resp.message);
          this.limpiarDatosDocumento();
        }
      },
      error: (e) => {
        //FIXME que hacer en Error Tecnico?
        this.limpiarDatosDocumento();
      }
    });
  }

  public limpiarDatosDocumento() {
    let datos = {
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    }
    this.formGroup.patchValue({
      ...datos
    })
    //this.formUbigeo.setValue(datos)
  }
  
}
