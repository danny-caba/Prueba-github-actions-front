import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ParametriaService } from 'src/app/service/parametria.service';
import { PidoService } from 'src/app/service/pido.service';
import { ListadoEnum, TipoDocumentoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../../components/base.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarRepresentanteComponent } from '../../modal-agregar-representante/modal-agregar-representante.component';

@Component({
  selector: 'vex-layout-datos-representante-legal',
  templateUrl: './layout-datos-representante-legal.component.html',
  styleUrls: ['./layout-datos-representante-legal.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LayoutDatosRepresentanteLegalComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() SOLICITUD: any;
  @Input() editable: boolean = false;
  @Input() actualizable = false;

  listTipoDocumento: any[] = []
  dataSource: any = [];
  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombres', 'apellidoPaterno', 'apellidoMaterno'];

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
    private dialog: MatDialog,
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
    this.cargarTabla();
  }

  ngOnDestroy(): void {
    // localStorage.removeItem('historialRepresentante');
    // localStorage.removeItem('representante');
  }

  private cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.TIPO_DOCUMENTO]).subscribe(listRes => {
      listRes[0]?.forEach(item => {
        if (item.codigo != 'RUC') {
          this.listTipoDocumento.push(item);
        }
      });
    })
  }

  private cargarTabla() {
    // this.dataSource = localStorage.getItem('historialRepresentante') ? JSON.parse(localStorage.getItem('historialRepresentante')) : [];
    this.dataSource = this.SOLICITUD?.historialRepresentante || [];
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
      // localStorage.setItem('historialRepresentante', JSON.stringify(this.SOLICITUD?.historialRepresentante || []));
      // localStorage.setItem('representante', JSON.stringify(this.SOLICITUD?.representante || {}));
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

  agregarRepresentante() {
    this.dialog.open(ModalAgregarRepresentanteComponent, {
      width: '700px',
      height: 'auto'
    }).afterClosed().subscribe((res) => {
      console.log(res);
      if (res !== null && res !== '') {
        const representanteActual = this.SOLICITUD?.representante;
        if (res.numeroDocumento == this.SOLICITUD?.representante?.numeroDocumento) {
          functionsAlert.error('El representante ya se encuentra registrado');
          return;
        }
        // let historialRepresentanteFromLocalStorage = localStorage.getItem('historialRepresentante') ? JSON.parse(localStorage.getItem('historialRepresentante')) : [];
        // historialRepresentanteFromLocalStorage.push(representanteActual);
        // localStorage.setItem('historialRepresentante', JSON.stringify(historialRepresentanteFromLocalStorage));
        this.dataSource = [ representanteActual, ...this.dataSource ];
        this.SOLICITUD.representante = res;
        this.SOLICITUD.historialRepresentante = this.dataSource;
        // localStorage.setItem('representante', JSON.stringify(res));
        // this.cargarTabla();
        this.setValues();
      }
    });
  }
  
}
