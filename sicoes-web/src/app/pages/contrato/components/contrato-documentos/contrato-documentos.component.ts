import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReqInicioServicio } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { ArchivoService } from 'src/app/service/archivo.service';
import { SolicitudService } from 'src/app/service/requerimientos.service';

@Component({
  selector: 'app-contrato-documentos',
  templateUrl: './contrato-documentos.component.html',
  styleUrls: ['./contrato-documentos.component.scss']
})
export class ContratoDocumentosComponent implements OnInit {
  personalPropuesto: any[] = [];
  docsAdicionales: any[] = [];
  docId!: number;

  readonly DOCS_PERSONAL = [
    { nombre: 'Contrato Laboral' },
    { nombre: 'SCTR' },
    { nombre: 'Póliza' },
    { nombre: 'Examen Médico' }
  ];

  readonly DOCS_ADICIONALES = [
    'CONTRATO POR ALQUILER CAMIONETA',
    'SEGURO DE SOAT'
  ];

  constructor(
    private route: ActivatedRoute,
    private adjuntosService: AdjuntosService,
    private archivoService: ArchivoService,
    private solicitudService: SolicitudService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.docId = +params.get('id')!;
      this.loadData();
    });
  }

  private slugify(text: string): string {
    return text.replace(/\s+/g, '_');
  }

  private loadData(): void {
    if (!this.docId) return;

    this.archivoService.getPersonalPropuesto(this.docId).subscribe(personas => {
      this.adjuntosService.obtenerAdjuntosPorPerfContrato(this.docId).subscribe(adjuntos => {
        // Obtener registros de fechas/documento (de la tabla SICOES_TC_REQ_INICIO_SERVICIO)
        this.solicitudService.listarReqInicioServicio(this.docId).subscribe(metaDocs => {

          this.personalPropuesto = personas.map((prof: any) => {
            const docs = this.DOCS_PERSONAL.map(d => {
              const found = adjuntos.find((a: any) =>
                a.idPersonal === prof.idPersonal && a.nombre === d.nombre
              );
              // Buscar en la metadata personalizada (fechas, idReq)
              const meta = metaDocs.find((m: any) =>
                m.solicitudPerfilId === this.docId &&
                m.supervisoraId === prof.idPersonal &&
                m.tipoDocumento === d.nombre
              );
              return {
                nombre: d.nombre,
                slug: this.slugify(d.nombre),
                archivo: found || null,
                idArchivo: found?.idArchivo || null,
                nombreReal: found?.nombreReal || null,
                fechaInicio: meta?.fechaInicio || '',
                fechaFin: meta?.fechaFin || '',
                idReq: meta?.id || null
              };
            });
            return { ...prof, docs, totalDocs: docs.filter(x => x.archivo).length };
          });

          // DOCUMENTOS ADICIONALES (sin fechas)
          this.docsAdicionales = this.DOCS_ADICIONALES.map(nombre => {
            const found = adjuntos.find((a: any) =>
              a.idPersonal == null && a.nombre === nombre
            );
            return {
              nombre,
              slug: this.slugify(nombre),
              archivo: found || null,
              idArchivo: found?.idArchivo || null,
              nombreReal: found?.nombreReal || null
            };
          });

          this.cd.markForCheck();
        });
      });
    });
  }

  abrirInputArchivoPersonal(prof: any, doc: any): void {
    const id = `input-personal-${prof.idPersonal}-${doc.slug}`;
    const inp = document.getElementById(id) as HTMLInputElement;
    if (inp) { inp.value = ''; inp.click(); }
  }

  onFileSelectedPersonal(ev: any, prof: any, doc: any): void {
    const file = ev.target.files[0];
    if (!file || !this.docId) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('tipoRequisito', doc.nombre);
    fd.append('idPersonal', prof.idPersonal);
    this.adjuntosService.subirAdjuntoPerfContratos(this.docId, fd).subscribe(res => {
      this.solicitudService.guardarReqInicioServicio({
        solicitudPerfilId: this.docId,
        supervisoraId: prof.idPersonal,
        tipoDocumento: doc.nombre,
        archivoId: res.idArchivo
      }).subscribe(() => {
        this.loadData();
      });
    });
  }

  eliminarPersonalDoc(prof: any, doc: any): void {
    if (!doc.idArchivo || !this.docId) return;
    this.adjuntosService.eliminarAdjuntoPerfContrato(this.docId, doc.idArchivo)
      .subscribe(() => this.loadData());
  }

  onDateChange(doc: any): void {
    if (!doc.idReq) return;
    this.solicitudService.actualizarFechasReqInicio(doc.idReq, {
      fechaInicio: doc.fechaInicio,
      fechaFin: doc.fechaFin
    }).subscribe(() => {
      // opcional: notificar éxito
    });
  }

  // métodos para docs adicionales (no tocan fechas)
  abrirInputArchivoAdicional(doc: any): void {
    const id = `input-adicional-${doc.slug}`;
    const inp = document.getElementById(id) as HTMLInputElement;
    if (inp) { inp.value = ''; inp.click(); }
  }

  onFileSelectedAdicional(ev: any, doc: any): void {
    const file = ev.target.files[0];
    if (!file || !this.docId) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('tipoRequisito', doc.nombre);
    this.adjuntosService.subirAdjuntoPerfContratos(this.docId, fd)
      .subscribe(() => this.loadData());
  }

  eliminarAdicional(doc: any): void {
    if (!doc.idArchivo || !this.docId) return;
    this.adjuntosService.eliminarAdjuntoPerfContrato(this.docId, doc.idArchivo)
      .subscribe(() => this.loadData());
  }

  descargar(doc: any): void {
    if (doc.archivo?.codigo && doc.archivo?.nombreReal) {
      this.adjuntosService.descargarWindowsJWT(doc.archivo.codigo, doc.archivo.nombreReal);
    }
  }

  registrar(): void {
    const registros = [];
    this.personalPropuesto.forEach(prof => {
      prof.docs.forEach(doc => {
        if (doc.archivo && doc.fechaInicio && doc.fechaFin) {
          registros.push({
            solicitudPerfilId: this.docId,
            supervisoraId: prof.idPersonal,
            tipoDocumento: doc.nombre,
            archivoId: doc.idArchivo,
            fechaInicio: doc.fechaInicio,
            fechaFin: doc.fechaFin
          });
        }
      });
    });

    if (registros.length === 0) {
      alert('No hay documentos cargados para registrar.');
      return;
    }
    this.solicitudService.guardarBatchReqInicioServicio(registros).subscribe(() => {
      alert('Documentación registrada correctamente');
      this.loadData();
    });
  }

  regresar(): void {
    window.history.back();
  }
}
