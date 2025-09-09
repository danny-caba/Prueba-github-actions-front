import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { ContratoService } from 'src/app/service/contrato.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RequisitoService } from 'src/app/service/requisito.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'vex-personal-propuesto',
  templateUrl: './personal-propuesto.component.html'
})
export class PersonalPropuestoComponent extends BasePageComponent<any> implements OnInit {

  serviceTable(filtro: any) {
    return this.requisitoService.obtenerRequisitosConFlagActivo(filtro);
  }
  
  obtenerFiltro() {
    let filtro: any = {
      idSeccion: this.SECCION.idSolPerConSec,
      tipoContratoSeleccionado: this.tipoContratoSeleccionado
    };
    return filtro;
  }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['documento', 'nroDocumento', 'nombres', 'nepotismo', 'impedimento', 'vinculo', 'otros', 'actions'];

  @Input() SECCION: any;
  @Input() CONTRATO: any;
  @Input() tipoContratoSeleccionado: any;
  @Input() evaluar: boolean;
  @Input() editable: boolean;
  @Input() view: boolean;
  @Input() esSubsanacion: boolean;

  profesionalSeleccionado: any;
  profesionales: any;
  

  requisitos: any;

  constructor(
    private personaService: PersonaService,
    private requisitoService: RequisitoService,
    private adjuntoService: AdjuntosService,
    private contratoService: ContratoService
  ) { 
    super();
  }

  ngOnInit(): void {
    if (!this.editable) {
      this.displayedColumns = ['documento', 'nroDocumento', 'nombres', 'nepotismo', 'impedimento', 'vinculo', 'otros', 'evaluacion'];
    }
    
    if (this.editable && this.esSubsanacion) {
      this.displayedColumns = ['documento', 'nroDocumento', 'nombres', 'nepotismo', 'impedimento', 'vinculo', 'otros', 'estado', 'actions'];
    }
    this.obtenerPersonas();
    this.cargarTabla();

  }

  esArchivo(requisito: any) {
    return requisito.requisito.tipoDatoEntrada.nombre == 'Adjuntar Archivo';
  }

  onChangeRequisito(event: any) {
    this.profesionalSeleccionado = event.value;

    this.personaService.validarTrabajadorOsi(this.profesionalSeleccionado?.supervisora?.codigoRuc).subscribe(
      (response: any) => {
        if (response.respuestaFec == '1') {
          this.contratoService.enviarCorreoSancionPN(response, this.profesionalSeleccionado?.supervisora?.codigoRuc).subscribe((response) => {
            functionsAlert.vigente('No es posible realizar su registro.', 'Mantiene un vínculo laboral con Osinergmin').then((result) => {
              this.profesionalSeleccionado = null;
            });
          });
        } else {
          this.requisitoService.obtenerRequisitosPorPersonal(this.profesionalSeleccionado.idSoliPersProp, this.tipoContratoSeleccionado).subscribe(
            (response: any) => {
              this.requisitos = response.content || [];
            });
        }
      });

  }

  obtenerPersonas() {
    this.profesionalSeleccionado = null;
    this.requisitos = [];
    this.personaService.obtenerPersonas(this.SECCION.idSolPerConSec).subscribe((response: any) => {
      this.profesionales = response.content;
    });
  }

  getValues() {
    return this.requisitos;
  }

  setValueChecked(obj, even) {
    
    // obj.flagActivo = even.checked ? true : null;
  }

  agregarPersonal() {
    functionsAlert.addQuestion('¿Está seguro de querer agregar el siguiente personal propuesto al formulario de Perfeccionamiento de Contrato?').then((result) => {
        if (result.isConfirmed) {
          this.requisitoService.modificarFlagRequisito(this.requisitos).subscribe(
            (response: any) => {
              this.obtenerPersonas();
              this.cargarTabla();
            });
        }
      });
  }

  eliminarPersonal(personal) {
    functionsAlert.deleteQuestion('¿Está seguro de querer eliminar el siguiente personal propuesto del formulario de Perfeccionamiento de Contrato?').then((result) => {
      if (result.isConfirmed) {
        this.requisitoService.descartarFlagRequisitoPersonal(personal).subscribe(
          (response: any) => {
            this.obtenerPersonas();
            this.cargarTabla();
          });
      }
    });
  }

  editarPersonal(personal) {
    this.requisitoService.obtenerRequisitosPorPersonal(personal.idSoliPersProp, this.tipoContratoSeleccionado).subscribe(
      (response: any) => {
        this.requisitos = response.content || [];
        this.profesionalSeleccionado = personal;
      });
  }

  descargar(adj) {
    console.log("adj",adj)
    let nombreAdjunto = adj.nombreReal;
    let codigoAdjunto = adj.codigo;
    this.adjuntoService.descargarWindowsJWT(codigoAdjunto, nombreAdjunto);
  }

  evaluarTextoEstado(texto: string = '') {
    switch (texto) {
      case '1':
        return 'Cumple';
      case '2':
        return 'No cumple';
      case '3':
        return 'Observado';
      default:
        return 'No evaluado';
    }
  }
  
}
