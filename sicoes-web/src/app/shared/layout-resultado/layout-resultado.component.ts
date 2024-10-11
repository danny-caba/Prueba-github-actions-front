import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { ListadoDetalle } from "src/app/interface/listado.model";
import { PerfilInscripcion } from "src/app/interface/perfil-insripcion.model";
import { Solicitud } from "src/app/interface/solicitud.model";
import { ParametriaService } from "src/app/service/parametria.service";
import { PerfilService } from "src/app/service/perfil.service";
import { SolicitudService } from "src/app/service/solicitud.service";
import {
  ListadoEnum,
  SolicitudEstadoEnum,
  TipoPersonaEnum,
  EstadoEvaluacionAdministrativa,
} from "src/helpers/constantes.components";
import { functions } from "src/helpers/functions";
import { functionsAlert } from "src/helpers/functionsAlert";
import { BaseComponent } from "../components/base.component";
import { MatDialog } from "@angular/material/dialog";
import { ModalOtroRequisitoObservacionPerfilComponent } from "../modal-otro-requisito-observacion-perfil/modal-otro-requisito-observacion-perfil.component";
import { OtroRequisitoService } from "src/app/service/otro-requisito.service";
import { ModalObservacionAdministrativaComponent } from "../modal-observacion-administrativa/modal-observacion-administrativa.component";
import { DictamenEvalService } from "src/app/service/dictamen-eval.service";
import { DictamenEval } from "src/app/interface/dictamen-eval.model";
import { AuthFacade } from "src/app/auth/store/auth.facade";
import { EvaluadorService } from "src/app/service/evaluador.service";
import { EvaluadorRol } from "src/helpers/constantes.components";
import { ModalResultMontoEvaTecComponent } from "../modal-result-monto-eva-tec/modal-result-monto-eva-tec.component";

@Component({
  selector: "vex-layout-resultado",
  templateUrl: "./layout-resultado.component.html",
  styleUrls: ["./layout-resultado.component.scss"],
  animations: [stagger80ms],
})
export class LayoutResultadoComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  usuario$ = this.authFacade.user$;
  subscriptionUsuario: Subscription = new Subscription();

  tipoPersonaEnum = TipoPersonaEnum;

  suscriptionSolicitud: Subscription;
  SOLICITUD: Partial<Solicitud>;
  cmpTipoRevisionEdit: boolean = false;
  ultimaVersion = true;

  listOpcion: ListadoDetalle[] = [];
  listPerfiles: PerfilInscripcion[] = [];
  listDictamenEval: DictamenEval[] = [];
  respuesta: boolean = true;
  usuario: any;

  valPorEvaluar: number;
  isCalifica: boolean;
  buttonDisabled: boolean = false;
  asignado: boolean = true;
  evaluacion: any;

  constructor(
    private solicitudService: SolicitudService,
    private parametriaService: ParametriaService,
    private perfilService: PerfilService,
    private dictamenEvalService: DictamenEvalService,
    private dialog: MatDialog,
    private otroRequisitoService: OtroRequisitoService,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade
  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.cargarCombo();

    this.subscriptionUsuario = this.usuario$.subscribe((usu) => {
      if (usu) {
        this.usuario = usu;
      }
    });
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  private suscribirSolicitud() {
    this.suscriptionSolicitud = this.solicitudService
      .suscribeSolicitud()
      .subscribe((sol) => {
        if (sol?.solicitudUuid) {
          this.SOLICITUD = sol;
          if (
            this.SOLICITUD.estado.codigo == SolicitudEstadoEnum.OBSERVADO &&
            functions.noEsVacio(this.SOLICITUD.solicitudUuidPadre)
          ) {
            this.solicitudUuid = this.SOLICITUD?.solicitudUuidPadre;
          } else {
            this.solicitudUuid = this.SOLICITUD?.solicitudUuid;
          }
          this.solicitudUuidPrincipal = this.solicitudUuid;
          this.cargarDatos();
          this.listarPerfiles();
        }
      });
  }

  SOLICITUD_TEMP;

  cargarDatos() {
    if (functions.esVacio(this.solicitudUuid)) return;
    this.solicitudService
      .obtenerSolicitud(this.solicitudUuid)
      .subscribe((resp) => {
        this.SOLICITUD_TEMP = resp;
      });
  }

  listarPerfiles() {
    if (functions.esVacio(this.solicitudUuid)) return;

    this.perfilService
      .buscarPerfiles({ solicitudUuid: this.solicitudUuid, size: 1000 })
      .subscribe((listPerf) => {
        this.listPerfiles = listPerf.content;

        this.listPerfiles?.forEach((perfil) => {
          let opciones = JSON.parse(JSON.stringify(this.listOpcion));
          opciones?.forEach((opcion) => {
            if (opcion.codigo == perfil.evaluacion.codigo) {
              opcion.seleccionado = true;
            }
          });

          perfil.listaEvaluacion = opciones;
        });

      });

    this.dictamenEvalService
      .buscarDictamenEval({ solicitudUuid: this.solicitudUuid, size: 1000 })
      .subscribe((listPerf) => {
        this.listDictamenEval = listPerf.content;
      });

    if (
      !this.cmpTipoRevisionEdit &&
      functions.noEsVacio(this.SOLICITUD.solicitudUuidPadre)
    ) {
      if (this.SOLICITUD.estado.codigo != SolicitudEstadoEnum.OBSERVADO) {
        this.cmpTipoRevisionEdit = true;
      }
    }
  }
  getDataSumary() {
    return this.listPerfiles
      .map((t: any) => t.montoFacturadoSector || 0) // Si el valor no existe, asigna 0
      .reduce((acc, value) => acc + value, 0);
  }
  cargarCombo() {
    this.parametriaService
      .obtenerMultipleListadoDetalle([ListadoEnum.RESULTADO_EVALUACION_ADM])
      .subscribe((listRes) => {
        this.listOpcion = listRes[0];

        listRes[0]?.forEach((item) => {
          item.seleccionado = false;
          if (item.codigo == "REA_03" && this.SOLICITUD?.solicitudUuidPadre) {
            item.editable = true;
          }
        });
      });

    this.parametriaService
      .obtenerListadoDetallePorCodigo("RE_01")
      .subscribe((res) => {
        this.valPorEvaluar = res[0].idListadoDetalle;
      });
  }

  guardarResultadoAdmin(val) {
    this.SOLICITUD.resultadoAdministrativo = {
      idListadoDetalle: val.value,
    };
    this.solicitudService
      .registrarResultadoAdmin(this.SOLICITUD)
      .subscribe((res) => {
        functionsAlert
          .success("Resultado Administrativo Actualizado")
          .then((result) => {});
      });
  }

  guardarEvaluacionPerfil(event, perf, button) {

    let idOpcion = button.value;
    this.isCalifica = false;
    this.listOpcion.forEach((opc) => {
      if (
        opc.idListadoDetalle == idOpcion &&
        opc.codigo == "REA_01" &&
        event.checked
      ) {
        this.isCalifica = true;
      }
    });



    // Verificar el tipo de persona
    // const tipoPersona = this.SOLICITUD.persona.tipoPersona.codigo;
    // const tiposRequierenMonto = [
    //   TipoPersonaEnum.JURIDICO.valueOf(),
    //   TipoPersonaEnum.PN_POSTOR.valueOf(),
    //   TipoPersonaEnum.PJ_EXTRANJERO.valueOf(),
    // ];
    // if (tiposRequierenMonto.includes(tipoPersona) && !this.buttonDisabled) {
    //   event.source.checked = false;
    //   functionsAlert.error(
    //     "Debe ingresar el monto facturado o guardarlo antes de calificar."
    //   );
    //   return;
    // }

    if (this.isCalifica) {
      // this.confirmarEvaluacion(event, perf, idOpcion);
      this.registrarMontoItem(event,perf,idOpcion)
    } else {
      this.registrarEvaluacion(event, perf, idOpcion);
    }
  }

  registrarMontoItem(event,perf,button) {
    if (['GSM_ACTIVIDAD_1','DSR-E_ACTIVIDAD_1','DSE_ACTIVIDAD_1','DSR-HC_ACTIVIDAD_1','DSGN_ACTIVIDAD_1','DSR-HC_ACTIVIDAD_1','DSHL_ACTIVIDAD_1'].includes(perf?.actividadArea?.codigo)) {
      const dialogRef = this.dialog.open(
        ModalResultMontoEvaTecComponent,
        {
          width: "350px",
          maxHeight: "100%",
          data: {
            // otroRequisito: otro,
            // accion: accion,
            componente: this,
          },
        }
      );
      dialogRef.afterClosed().subscribe((respuesta: any) => {
        // this.respuesta = respuesta;
        if(respuesta!=false && respuesta!=null){
          perf.montoFacturadoSector = parseFloat(respuesta)
          this.confirmarEvaluacion(event,perf,button)
        }else{
          event.source.checked = false;
        }
      });      
      
    }else {
      this.confirmarEvaluacion(event,perf,button)
      event.source.checked = false;
    }
  }

  listarEvaladoresAsignadosTecnico;
  async listarAsignados(event, solicitudUuid) {
    let cont = 0;
    //this.listarEvaladoresAsignadosTecnico = [];

    try {
      const listRes = await this.evaluadorService
        .listarAsignaciones({ solicitudUuid: solicitudUuid, size: 1000 })
        .toPromise();
      listRes.content?.forEach((obj) => {
        if (obj.tipo.codigo == EvaluadorRol.APROBADOR_TECNICO_COD) {
          cont += 1;
        }
      });

      if (cont === 0) {
        
        
        
        this.asignado = false;
        event.source.checked = false;
        return;
      } else {
        this.asignado = true;
      }
    } catch (error) {
      functionsAlert.error("Error al listar asignaciones");
      this.asignado = false;
    }
  }

  async confirmarEvaluacion(event, perf, idOpcion) {
    const result = await functionsAlert.questionSiNo(
      "¿Está seguro de finalizar la Evaluación?"
    );

    if (result.isConfirmed) {
      await this.listarAsignados(event, this.SOLICITUD.solicitudUuid);

      if (this.asignado) {
        this.registrarEvaluacion(event, perf, idOpcion);
        this.otroRequisitoService
          .finalizarOtroRequisito(perf)
          .subscribe((res) => {
            functionsAlert.success("Requisito Actualizado").then(() => {});
          });
      }
    } else {
      perf.listaEvaluacion.forEach((opcion) => {
        if (opcion.idListadoDetalle == idOpcion) {
          opcion.seleccionado = false;
          this.isCalifica = false;
        }
      });
    }
  }

  registrarEvaluacion(event, perf, idOpcion) {
    if (!event.checked) {
      perf.evaluacion = {
        idListadoDetalle: this.valPorEvaluar,
      };
    } else {
      perf.listaEvaluacion.forEach((opcion) => {
        if (opcion.idListadoDetalle == idOpcion) {
          opcion.seleccionado = true;
        } else {
          opcion.seleccionado = false;
        }
        if (!this.respuesta) {
          opcion.seleccionado = false;
          this.respuesta = true;
        }
      });

      perf.evaluacion = {
        idListadoDetalle: idOpcion,
      };
    }

    this.perfilService.evaluarPerfil(perf).subscribe((res) => {
      if (this.isCalifica) {
        perf.observacion = "Cumple con los requisitos solicitados";
        this.perfilService.evaluarPerfil(perf).subscribe((res) => {
          this.listarPerfiles();
          functionsAlert
            .success("Resultado Técnico Actualizado")
            .then((result) => {
              this.listarPerfilesGuardado();
              this.validarFinalizarRevTecni();
            });
        });
      } else {
        if (this.respuesta) {
          this.registrarObs(res);
        }
      }
    });
  }

  obtenerNombrePerfil(perf) {
    if (
      [
        TipoPersonaEnum.JURIDICO.valueOf(),
        TipoPersonaEnum.PN_POSTOR.valueOf(),
        TipoPersonaEnum.PJ_EXTRANJERO.valueOf(),
      ].includes(this.SOLICITUD.persona.tipoPersona.codigo)
    ) {
      return perf.sector?.nombre + " / " + perf.subsector?.nombre + " / " + (perf.actividadArea?.codigo.split('_')[0] || '');
    } else {
      // return perf.sector?.nombre + " / " + perf.actividad?.nombre + " / " + perf.perfil?.nombre;
      return (
        perf.sector?.nombre +
        " / " +
        perf.subsector?.nombre +
        " / " +
        perf.actividad?.nombre +
        " / " +
        perf.unidad?.nombre +
        " / " +
        perf.subCategoria?.nombre +
        " / " +
        perf.perfil?.nombre
      );
    }
  }

  solicitudUuidPrincipal;
  solicitudUuid;

  changeVersion(version: any) {
    if (version.codigo == "V1") {
      this.solicitudUuidPrincipal = this.SOLICITUD.solicitudUuid;
      this.solicitudUuid = this.SOLICITUD?.solicitudUuidPadre;
      this.ultimaVersion = false;
      this.listarPerfiles();
      this.cargarDatos();
    } else {
      this.solicitudUuid = this.solicitudUuidPrincipal;
      this.ultimaVersion = true;
      this.listarPerfiles();
      this.cargarDatos();
    }
  }

  validarEdit(evaluacion: any) {
    if (evaluacion?.codigo == "REA_01" && this.SOLICITUD.solicitudUuidPadre) {
      return true;
    }
    return false;
  }

  registrarObsAdm(otro) {
    this.registrarObsAccAdm(otro, "add");
  }

  registrarObs(otro) {
    if (functions.esVacio(otro.evaluacion)) {
      functionsAlert.error(
        "Marque el resultado del perfil antes de registrar el resultado"
      );
      return;
    }
    this.registrarObsAcc(otro, "add");
  }

  registrarObsAcc(otro, accion) {
    const dialogRef = this.dialog.open(
      ModalOtroRequisitoObservacionPerfilComponent,
      {
        width: "1200px",
        maxHeight: "100%",
        data: {
          otroRequisito: otro,
          accion: accion,
          componente: this,
        },
      }
    );
    dialogRef.afterClosed().subscribe((respuesta: any) => {
      this.respuesta = respuesta;
    });
  }

  registrarDictamenEval() {
    let montoAct = this.listPerfiles
    .map((t: any) => t.montoFacturadoSector || 0) // Si el valor no existe, asigna 0
    .reduce((acc, value) => acc + value, 0);
    this.listDictamenEval[0].montoFacturado = montoAct ?? 0
    this.dictamenEvalService.actualizarMonto(this.listDictamenEval[0]).subscribe((res) => {
      this.listarPerfiles();
      functionsAlert.success("Monto Actualizado").then((result) => {
        this.buttonDisabled = true;
      });
    });
  }

  getRadioSelection() {
    let obser = false;
  
    for (let i = 0; i < this.listPerfiles.length; i++) {
      let perfilTmp = this.listPerfiles[i];
      // Asegúrate que perfilTmp.evaluacion y perfilTmp.evaluacion.codigo existan antes de comparar
      if (perfilTmp.evaluacion && perfilTmp.evaluacion.codigo === "REA_03") {
        
        obser = true;
        break;  // Puedes agregar un break aquí para dejar de iterar una vez que encuentres RE_03
      }
    }
    console.log(obser)
    if (obser) {  // Usar directamente la variable booleana obser
      return "Observado";  // Si se encuentra 'RE_03', retorna "Observados"
    } else if (this.listDictamenEval[0].montoFacturado > 100000) {
      return "Califica";
    } else if (this.listDictamenEval[0].montoFacturado > 0) {
      return "No Califica";
    } else {
      return "";
    }
  }
  
  

  registrarObsAccAdm(otro, accion) {
    this.dialog.open(ModalObservacionAdministrativaComponent, {
      width: "1200px",
      maxHeight: "100%",
      data: {
        solicitud: otro,
        solicitudUuid: this.solicitudUuid,
        accion: accion,
      },
    });
  }

  registrarFinalizar(otro) {
    if (otro.evaluacion.codigo === "RE_01") {
      //Por evaluar
      if (
        TipoPersonaEnum.PN_PERS_PROPUESTO.valueOf() ===
        this.SOLICITUD.persona.tipoPersona.codigo
      ) {
        functionsAlert.error(
          "Seleccione resultado del perfil antes de finalizar"
        );
      } else {
        functionsAlert.error(
          "Seleccione resultado del sector antes de finalizar"
        );
      }
      return;
    }

    functionsAlert
      .questionSiNo("¿Seguro que desea finalizar?")
      .then((result) => {
        if (result.isConfirmed) {
          this.otroRequisitoService
            .finalizarOtroRequisito(otro)
            .subscribe((res) => {
              this.listarPerfiles();
              functionsAlert
                .success("Requisito Actualizado")
                .then((result) => {});
            });
        }
      });
  }

  validarFinalizarRevTecni() {
    let isFinalizado = true;

    for (let i = 0; i < this.listPerfiles.length; i++) {
      let perfilTmp = this.listPerfiles[i];
      if (!perfilTmp.evaluacion || perfilTmp.evaluacion.codigo == "RE_01") {
        isFinalizado = false;
      }
    }

    if (isFinalizado) {
      this.finalizarRevTecni();
    }
  }

  finalizarRevTecni() {
    this.solicitudService.finalizarTecnica(this.SOLICITUD).subscribe((resp) => {
      functionsAlert.success("Revisión Técnica Finalizada").then((result) => {
        this.SOLICITUD.estadoEvaluacionTecnica.codigo =
          EstadoEvaluacionAdministrativa.EN_APROBACION;
        this.solicitudService
          .obtenerSolicitud(this.SOLICITUD.solicitudUuid)
          .subscribe((resp) => {
            this.solicitudService.setSolicitud(resp);
          });
      });
    });
  }

  solicitarRevertirEvaluacion(perfil) {
    functionsAlert
      .questionSiNo(
        "¿Seguro que desea solicitar revertir la evalución? - Comuníquese con el Coordinador para proceder con su pedido."
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.otroRequisitoService
            .solicitarRevertirEvaluacion(perfil)
            .subscribe((res) => {
              functionsAlert
                .success("Solicitud de reversión enviada")
                .then((result) => {});
            });
        }
      });
  }
  // -----
  listarPerfilesGuardado() {
    if (functions.esVacio(this.solicitudUuid)) return;

    this.perfilService
      .buscarPerfiles({ solicitudUuid: this.solicitudUuid, size: 1000 })
      .subscribe((listPerf) => {
        this.listPerfiles = listPerf.content;
        this.registrarDictamenEval();
      });

    // this.dictamenEvalService
    //   .buscarDictamenEval({ solicitudUuid: this.solicitudUuid, size: 1000 })
    //   .subscribe((listPerf) => {
    //     this.listDictamenEval = listPerf.content;
    //   });

    // if (
    //   !this.cmpTipoRevisionEdit &&
    //   functions.noEsVacio(this.SOLICITUD.solicitudUuidPadre)
    // ) {
    //   if (this.SOLICITUD.estado.codigo != SolicitudEstadoEnum.OBSERVADO) {
    //     this.cmpTipoRevisionEdit = true;
    //   }
    // }
  }
}
