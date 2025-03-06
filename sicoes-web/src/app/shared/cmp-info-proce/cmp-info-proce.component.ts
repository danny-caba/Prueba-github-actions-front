import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcesoMiembtoService } from 'src/app/service/proceso-miembro.service';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { PerfilService } from 'src/app/service/perfil.service';
import { PidoService } from 'src/app/service/pido.service';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Proceso } from 'src/app/interface/proceso.model';
import { PerfilInscripcion } from 'src/app/interface/perfil-insripcion.model';
import { Observable } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { InformacionProcesoService } from 'src/app/service/informacion-proceso.service';
import { OtroRequisito } from 'src/app/interface/otro-requisito.model';
import * as uuid from 'uuid';
import { BasePageComponent } from '../components/base-page.component';
@Component({
  selector: 'vex-cmp-info-proce',
  templateUrl: './cmp-info-proce.component.html',
  styleUrls: ['./cmp-info-proce.component.scss']
})
export class CmpInfoProceComponent extends BaseComponent implements OnInit {
  @Input() PROCESO: Partial<Proceso>
  perfilInscripcion: PerfilInscripcion
  solicitud: Partial<Solicitud>
  document
  @Output() actualizarTabla: EventEmitter<any> = new EventEmitter();
  filteredStatesTecnico$: Observable<any[]>;

  listEtapa: any[]
  // listUsuarios: Usuario[]

  formGroup = this.fb.group({
    documentName: [null as any, Validators.required],
    etapa: [null as any, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private pidoService: PidoService,
    private perfilService: PerfilService,
    private evaluadorService: EvaluadorService,
    private infoProcesoServices: InformacionProcesoService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  ngOnInit() {
    this.cargarCombo();
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.etapa.value instanceof Object)) {
        this.formGroup.controls.etapa.setValue(null);
        this.formGroup.controls.etapa.markAsTouched();
      }
    }, 200);
  }
  displayFn(codi: any): string {
    return codi && codi.nombres ? codi.nombres : '';
  }
  @Output() emitSearch = new EventEmitter()
  guardar(){
    this.infoProcesoServices.guardarInfoProceso(this.formData).subscribe(res=>{

      this.emitSearch.emit()
      this.formGroup.controls.etapa.setValue(null);
      this.formGroup.controls.documentName.setValue(null);
      this.formData = null
      this.adjuntoInput = {}
      // this.formGroup.patchValue({
      //   etapa:null,
      //   documentName:null
      // })
    })
  }
  validarEdicion(document) {
    return true;
  }
  listGrupos: ListadoDetalle[]
  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ETAPA_PROCESO
    ]).subscribe(listRes => {
      this.listGrupos = listRes[0];
    })
  }
  // FILE
  @ViewChild("fileInput2") fileInput: ElementRef;
  nameInputRamdom = 'nameInputRamdom' + uuid.v4();

  // solicitud: Partial<Solicitud>;
  adjuntoInput: any = {}
  titulo: string;
  codigo: string;
  editable: boolean;
  otroRequisito: OtroRequisito;
  archivos: any;
  archivo: any;
  proceso: any;

  validarRequerido: boolean = false;
  modoBorrador = true;
  booleanView: boolean = false;
  nuevo: boolean = true;

  clickFile(adj) {

    this.adjuntoInput = adj;
    let element: HTMLElement = document.querySelector(`[name="${this.nameInputRamdom}"]`) as HTMLElement;
    element.click();
  }
  eliminar(){
    this.adjuntoInput = {}
    this.formData = null
  }
  formData = new FormData();
  onFileInput(file) {
    this.formData = new FormData();
  
    if (file.target.files.length <= 0) {
      return;
    }
  
    let attach = file.target.files[0];
  
    // Lista de formatos permitidos
    const exts = "pdf,doc,docx,xls,xlsx".split(",");
    let isValidFile = false;
  
    // Validar formato del archivo
    for (const ext of exts) {
      if (this.validateFile(attach.name, ext)) {
        isValidFile = true;
        break;
      }
    }
  
    // Si el formato no es válido, mostrar alerta y salir
    if (!isValidFile) {
      alert("El tipo o formato de archivo no es válido. Solo se permiten: PDF, Word y Excel.");
      this.fileInput.nativeElement.value = ""; // Limpiar el campo de archivo
      return;
    }
  
    // Validar tamaño del archivo (40 MB)
    if (attach.size / 1024 >= 40000) {
      alert("El archivo excede el peso permitido (40 MB).");
      this.fileInput.nativeElement.value = ""; // Limpiar el campo de archivo
      return;
    }
  
    // Asignar el archivo solo si pasa todas las validaciones
    this.adjuntoInput = attach;
  
    this.formData.append("file", attach);
    this.formData.append("idProceso", this.PROCESO.idProceso.toString());
    this.formData.append("idEtapa", this.formGroup.value.etapa?.idListadoDetalle);
    this.formData.append("documentName", this.formGroup.value.documentName);
  
    // Mensaje de éxito
    const fileName = attach.name;
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
    alert(`El archivo "${fileName}" se cargó correctamente.`);
  }  
  validateFile(name: String, ext_: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == ext_) {
      return true;
    } else {
      return false;
    }
  }
}
