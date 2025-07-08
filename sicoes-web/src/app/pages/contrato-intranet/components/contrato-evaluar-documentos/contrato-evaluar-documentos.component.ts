import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudService } from 'src/app/service/requerimientos.service';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { ArchivoService } from 'src/app/service/archivo.service';

@Component({
  selector: 'app-contrato-evaluar-documentos',
  templateUrl: './contrato-evaluar-documentos.component.html',
  styleUrls: ['./contrato-evaluar-documentos.component.scss']
})
export class ContratoEvaluarDocumentosComponent implements OnInit {

  docId!: number;
  personalPropuesto: any[] = [];
  docsAdicionales: any[] = [];

  readonly DOCS_ADICIONALES = [
    'CONTRATO POR ALQUILER CAMIONETA',
    'SEGURO DE SOAT'
  ];

  constructor(
    private route: ActivatedRoute,
    private solicitudService: SolicitudService,
    private adjuntosService: AdjuntosService,
    private archivoService: ArchivoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.docId = +params.get('idSolicitud')!;
      this.loadData();
    });
  }

  private slugify(text: string): string {
    return text.replace(/\s+/g, '_');
  }

  private loadData(): void {
    if (!this.docId) return;

    this.adjuntosService.obtenerAdjuntosPorPerfContrato(this.docId).subscribe(adjuntos => {
      this.solicitudService.listarReqInicioServicio(this.docId).subscribe(metaDocs => {
        this.archivoService.getPersonalPropuesto(this.docId).subscribe(personas => {
          // Documentos personales con metadatos
          this.personalPropuesto = personas.map((prof: any) => {
            const docs = metaDocs
              .filter((m: any) => m.solicitudPerfilId === this.docId && m.supervisoraId === prof.idPersonal)
              .map(m => {
                const adj = adjuntos.find((a: any) => a.idArchivo === m.archivoId) || null;
                return {
                  nombre: m.tipoDocumento,
                  slug: this.slugify(m.tipoDocumento),
                  archivo: adj,
                  idArchivo: m.archivoId,
                  nombreReal: adj?.nombreReal || '',
                  fechaInicio: m.fechaInicio,
                  fechaFin: m.fechaFin,
                  idReq: m.id,
                  aprobado: m.estadoEvaluacion // 'SI' o 'NO' o null
                };
              });

            return {
              ...prof,
              docs,
              totalDocs: docs.length
            };
          });

          // Documentos adicionales fijos (solo los dos), con metadatos y adjuntos
          this.docsAdicionales = this.DOCS_ADICIONALES.map(nombre => {
            const adj = adjuntos.find(a => !a.idPersonal && a.nombre === nombre) || null;
            const meta = metaDocs.find(m =>
              m.solicitudPerfilId === this.docId &&
              !m.supervisoraId &&
              m.tipoDocumento === nombre
            );
            return {
              nombre,
              slug: this.slugify(nombre),
              archivo: adj,
              idArchivo: adj?.idArchivo || null,
              nombreReal: adj?.nombreReal || '',
              aprobado: meta?.estadoEvaluacion || null,
              idReq: meta?.id || null
            };
          });

          this.cd.markForCheck();
        });
      });
    });
  }

  descargar(doc: any): void {
    if (doc.archivo?.codigo && doc.archivo?.nombreReal) {
      this.adjuntosService.descargarWindowsJWT(doc.archivo.codigo, doc.archivo.nombreReal);
    }
  }

  registrarEvaluacion(): void {
    const evaluaciones = [];

    // Evaluar personal propuesto
    this.personalPropuesto.forEach(prof => {
      prof.docs.forEach((doc: any) => {
        if (doc.idReq) {
          evaluaciones.push({
            id: doc.idReq,
            estadoEvaluacion: doc.aprobado || null,
            usuarioId: this.getUsuarioIdActual(),
            observacion: ''
          });
        }
      });
    });

    // Evaluar docs adicionales
    this.docsAdicionales.forEach((doc: any) => {
      if (doc.idReq) {
        evaluaciones.push({
          id: doc.idReq,
          estadoEvaluacion: doc.aprobado || null,
          usuarioId: this.getUsuarioIdActual(),
          observacion: ''
        });
      }
    });

    this.solicitudService.guardarEvaluaciones(evaluaciones).subscribe(() => {
      alert('Evaluaciones guardadas correctamente');
      this.loadData();
    });
  }

  getUsuarioIdActual(): number {
    // Aquí recupera el usuario actual de tu sistema de autenticación
    return 1; // Ejemplo fijo
  }

  regresar(): void {
    window.history.back();
  }
}
