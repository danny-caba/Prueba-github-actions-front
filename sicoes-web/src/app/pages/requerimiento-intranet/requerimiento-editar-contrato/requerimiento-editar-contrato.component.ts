import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { RequerimientoService } from "src/app/service/requerimiento.service";
import { FormAdjuntosBtnComponent } from "src/app/shared/form-adjuntos-btn/form-adjuntos-btn.component";
import { functionsAlert } from "src/helpers/functionsAlert";
import { Link } from "src/helpers/internal-urls.components";

@Component({
  selector: "vex-requerimiento-editar-contrato",
  templateUrl: "./requerimiento-editar-contrato.component.html",
  styleUrls: ["./requerimiento-editar-contrato.component.scss"],
})
export class RequerimientoEditarContratoComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("formAdjuntoBtn", { static: false })
  formAdjuntoBtn: FormAdjuntosBtnComponent;

  contratoForm!: FormGroup;
  contratoSeleccionadoId: number | null = null;
  tipoRequisitoOptions: any[] = [
    // { value: 'Acta de inicio', viewValue: 'Acta de inicio' },
    { value: "Contrato", viewValue: "Contrato" },
    // { value: 'Adenda', viewValue: 'Adenda' },
    // { value: 'Informe Final', viewValue: 'Informe Final' }
  ];
  archivosAdjuntosDataSource = new MatTableDataSource<any>([]);
  displayedAdjuntosColumns: string[] = [
    "requisito",
    "nombreArchivo",
    "acciones",
  ];
  uuidContrato!: string;
  idRequerimientoContrato!: string;
  attachmentsInvalid = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adjuntoService: AdjuntosService,
    private requerimientoService: RequerimientoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const fechaFinMayorIgual: ValidatorFn = (
      group: AbstractControl
    ): ValidationErrors | null => {
      const inicio = group.get("fechaInicio")?.value as Date;
      const fin = group.get("fechaFin")?.value as Date;
      if (!inicio || !fin) return null;
      return fin >= inicio ? null : { fechaFinInvalida: true };
    };

    this.uuidContrato = this.route.snapshot.paramMap.get(
      "requerimientoContratoUuid"
    )!;
    this.idRequerimientoContrato = this.route.snapshot.paramMap.get(
      "idRequerimientoContrato"
    )!;

    this.contratoForm = this.fb.group(
      {
        fechaSuscripcion: ["", Validators.required],
        fechaInicio: ["", Validators.required],
        fechaFin: ["", Validators.required],
        tipoRequisito: [""],
      },
      { validators: fechaFinMayorIgual }
    );
  }

  descargarContrato(): void {}
  adjuntarArchivo(): void {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file) {
      const tipoRequisito = this.contratoForm.get("tipoRequisito")?.value;

      const exts = ["pdf", "doc", "docx", "xls", "xlsx"];
      const fileName = file.name;
      const fileExtension = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toLowerCase();

      if (!exts.includes(fileExtension)) {
        this.snackBar.open(
          "El tipo o formato de archivo no es válido. Solo se permiten: PDF, Word y Excel.",
          "Cerrar",
          { duration: 4000 }
        );
        this.fileInput.nativeElement.value = "";
        return;
      }

      const maxSizeInBytes = 40 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.snackBar.open(
          `El archivo excede el peso permitido (${
            maxSizeInBytes / (1024 * 1024)
          } MB).`,
          "Cerrar",
          { duration: 4000 }
        );
        this.fileInput.nativeElement.value = "";
        return;
      }

      let formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("idRequerimientoContrato", this.idRequerimientoContrato);
      formData.append("codigo", "TA30");

      this.adjuntoService
        .upload(formData, "")
        .pipe(
          finalize(() => {
            if (this.fileInput) {
              this.fileInput.nativeElement.value = "";
            }
          })
        )
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.Response) {
              const tipoRequisitoSeleccionado =
                this.contratoForm.get("tipoRequisito")?.value;
              const requisitoTexto = tipoRequisitoSeleccionado?.viewValue || "";
              const body = (event as HttpResponse<any>).body;

              const newAttachment = {
                requisito: requisitoTexto,
                nombreArchivo: file.name,
                idArchivo: body.idArchivo,
                uuidCodigo: body.codigo,
                file: file,
              };

              const currentData = this.archivosAdjuntosDataSource.data;
              this.archivosAdjuntosDataSource.data = [
                ...currentData,
                newAttachment,
              ];

              this.snackBar.open(
                `Archivo "${file.name}" adjuntado a la lista.`,
                "Cerrar",
                { duration: 2000 }
              );
            }
          },
          error: (err) => {
            console.error("Error al subir:", err);
          },
        });
    }
  }
  descargarArchivo(element: any): void {
    if (element?.uuidCodigo && element?.nombreArchivo) {
      this.adjuntoService.descargarWindowsJWT(
        element.uuidCodigo,
        element.nombreArchivo
      );
    } else {
      this.snackBar.open(
        "No se puede descargar el archivo: información incompleta (UUID o nombre faltante).",
        "Cerrar",
        { duration: 3000 }
      );
      console.warn("Intento de descarga con información incompleta:", element);
    }
  }
  eliminarArchivo(index: number): void {
    const data = [...this.archivosAdjuntosDataSource.data];
    const eliminado = data.splice(index, 1)[0];
    this.archivosAdjuntosDataSource.data = data;

    if (data.length === 0) this.contratoForm.get("tipoRequisito")?.reset();

    this.snackBar.open(
      `Se eliminó "${eliminado?.nombreArchivo ?? "adjunto"}".`,
      "Cerrar",
      { duration: 2000 }
    );
  }
  guardarContrato(): void {
    console.log(
      "this.archivosAdjuntosDataSource.data",
      this.archivosAdjuntosDataSource.data
    );
    this.contratoForm.markAllAsTouched();
    this.attachmentsInvalid = !this.hasAttachments;

    if (this.contratoForm.invalid || this.attachmentsInvalid) {
      this.snackBar.open(
        "Completa los campos obligatorios y adjunta al menos un archivo.",
        "Cerrar",
        { duration: 2500 }
      );
      return;
    }

    functionsAlert
      .questionSiNo("¿Seguro de finalizar el registro del contrato?")
      .then((result) => {
        if (result.isConfirmed) {
          const formValue = this.contratoForm.value;

          const payload = {
            fechaSuscripcion: this.formatDate(formValue.fechaSuscripcion),
            fechaInicio: this.formatDate(formValue.fechaInicio),
            fechaFin: this.formatDate(formValue.fechaFin),
            archivos: this.archivosAdjuntosDataSource.data.map((a) => ({
              idArchivo: a.idArchivo,
            })),
          };

          this.requerimientoService
            .editarContrato(this.uuidContrato, payload)
            .subscribe({
              next: () => {
                functionsAlert.success("Contrato actualizado correctamente.");
                this.regresar();
              },
              error: () =>
                functionsAlert.error("Error al actualizar el contrato."),
            });
        }
      });
    console.log(this.contratoForm.invalid);
    console.log(this.uuidContrato);
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  get hasAttachments(): boolean {
    return (this.archivosAdjuntosDataSource?.data?.length || 0) > 0;
  }

  regresar(): void {
    this.router.navigate(["/", Link.INTRANET, Link.CONTRATOS_LIST]);
  }

  get numeroContrato() {
    return this.contratoForm.get("numeroContrato");
  }
}
