import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalPerfilComponent } from './modal-perfil/modal-perfil.component';
import { MaterialModule } from './material.module';
import { ModalCapacitacionComponent } from './modal-capacitacion/modal-capacitacion.component';
import { ModalGradosTitulosComponent } from './modal-grados-titulos/modal-grados-titulos.component';
import { ModalDocumentosSustentanComponent } from './modal-documentos-sustentan/modal-documentos-sustentan.component';
import { ModalDocumentosAcreditanPJComponent } from './modal-documentos-acreditan-pj/modal-documentos-acreditan-pj.component';
import { LayoutPerfilInscripcionComponent } from './layout-perfil-inscripcion/layout-perfil-inscripcion.component';
import { LayoutDocumentoSustentoExpComponent } from './layout-documento-sustento-exp/layout-documento-sustento-exp.component';
import { LayoutCapacitacionComponent } from './layout-capacitacion/layout-capacitacion.component';
import { LayoutGradoAcademicoComponent } from './layout-grado-academico/layout-grado-academico.component';
import { LayoutDatosPersJurComponent } from './layout-datos/layout-datos-pers-jur/layout-datos-pers-jur.component';
import { LayoutDocumentoAcreditaExpComponent } from './layout-documento-acredita-exp/layout-documento-acredita-exp.component';
import { LayoutOtrosRequisitosComponent } from './layout-otros-requisitos/layout-otros-requisitos.component';
import { ModalTileComponent } from './modal-title/modal-title.component';
import { ModalTileComponent2 } from './modal-title-2/modal-title-2.component';
import { FormAdjuntosBtnComponent } from './form-adjuntos-btn/form-adjuntos-btn.component';
import { UbigeoUpdComponent } from './ubigeo-upd/ubigeo-upd.component';
import { LoadingDialogService } from 'src/helpers/loading';
import { LayoutAsignacionComponent } from './layout-asignacion/layout-asignacion.component';
import { LayoutAprobacionComponent } from './layout-aprobacion/layout-aprobacion.component';
import { LayoutObservacionResultadoComponent } from './layout-observacion-resultado/layout-observacion-resultado.component';
import { LayoutResultadoComponent } from './layout-resultado/layout-resultado.component';
import { LayoutDocumentoExpedienteComponent } from './layout-documento-expediente/layout-documento-expediente.component';
import { LayoutEvidenciaComponent } from './layout-evidencia/layout-evidencia.component';
import { ModalEvidenciaComponent } from './modal-evidencia/modal-evidencia.component';
import { OptionRoleDirective } from '../auth/interceptors/option-role.directive';
import { CmpTipoRevisonComponent } from './cmp-tipo-revision/cmp-tipo-revision.component';
import { LayoutAprobacionHistorialComponent } from './layout-aprobacion-historial/layout-aprobacion-historial.component';
import { ModalOtroRequisitoObservacionComponent } from './modal-otro-requisito-observacion/modal-otro-requisito-observacion.component';
import { FormAdjuntosMemoryComponent } from './form-adjuntos-memory/form-adjuntos-memory.component';
import { ModalAprobadorComponent } from './modal-aprobador/modal-aprobador.component';
import { LayoutDatosPersNatComponent } from './layout-datos/layout-datos-pers-nat/layout-datos-pers-nat.component';
import { LayoutDatosRepresentanteLegalComponent } from './layout-datos/layout-datos-representante-legal/layout-datos-representante-legal.component';
import { LayoutAsignacionPerfilComponent } from './layout-asignacion/layout-asignacion-perfil/layout-asignacion-perfil.component';
import { CmpOpcionEvaluadorComponent } from './cmp-opcion/cmp-opcion-evaluador/cmp-opcion-evaluador.component';
import { CmpOpcionEvaluadorDocumentoComponent } from './cmp-opcion/cmp-opcion-evaluador-documento/cmp-opcion-evaluador-documento.component';
import { ModalAprobadorAccionComponent } from './modal-aprobador-accion/modal-aprobador-accion.component';
import { LayoutSubsanarComponent } from './layout-subsanar/layout-subsanar.component';
import { ModalNotificacionComponent } from './modal-notificacion/modal-notificacion.component';
import { ModalTerminosComponent } from './modal-terminos/modal-terminos.component';
import { CmpAprobadorComponent } from './cmp-aprobador/cmp-aprobador.component';
import { LayoutDatosPersNatPostorComponent } from './layout-datos/layout-datos-pers-nat-postor/layout-datos-pers-nat-postor.component';
import { CmpPerfilComponent } from './cmp-perfil/cmp-perfil.component';
import { LayoutDatosPersJurExntrajeroComponent } from './layout-datos/layout-datos-pers-jur-extranjero/layout-datos-pers-jur-extranjero.component';
import { LayoutDatosGeneralComponent } from './layout-datos-proceso/layout-datos-general/layout-datos-general.component';
import { LayoutFechaEtapaComponent } from './layout-datos-proceso/layout-fecha-etapa/layout-fecha-etapa.component';
import { LayoutMiemboComponent } from './layout-datos-proceso/layout-miembro/layout-miembro.component';
import { LayoutItemsComponent } from './layout-datos-proceso/layout-items/layout-items.component';
import { CmpFechaEtapaComponent } from './cmp-fecha-etapa/cmp-fecha-etapa.component';
import { CmpMiembroComponent } from './cmp-miembo/cmp-miembro.component';
import { ModalProcesoItemsComponent } from './modal-proceso-items/modal-proceso-items.component';
import { ModalProcesoEtapaComponent } from './modal-proceso-etapa/modal-proceso-etapa.component';
import { ModalProcesoMiembroComponent } from './modal-proceso-miembro/modal-proceso-miembro.component';
import { ModalDocumentoTecnicoComponent } from './modal-documento-tecnico/modal-documento-tecnico.component';
import { ModalDocumentosInformativos } from './modal-documentos-informativos/modal-documentos-informativos.component';
import { ModalDocumentoEconomicoComponent } from './modal-documento-economico/modal-documento-economico.component';
import { CmpItemPerfilComponent } from './cmp-item-perfil/cmp-item-perfil.component';
import { LayoutItemPerfilComponent } from './layout-item-perfil/layout-item-perfil.component';
import { LayoutPublicarComponent } from './layout-datos-proceso/layout-publicar/layout-publicar.component';
import { InputMaskModule } from '@ngneat/input-mask';
import { ModalInfoNroProcesoComponent } from './modal-info-nro-proceso/modal-info-nro-proceso.component';

import { LayoutAsignacionPerfilTecComponent } from './layout-asignacion/layout-asignacion-perfil-tec/layout-asignacion-perfil-tec.component';
import { ModalOtroRequisitoObservacionPerfilComponent } from './modal-otro-requisito-observacion-perfil/modal-otro-requisito-observacion-perfil.component';
import { ModalObservacionAdministrativaComponent } from './modal-observacion-administrativa/modal-observacion-administrativa.component';
import { ModalCambioEstadoItemComponent } from './modal-cambio-estado-item/modal-cambio-estado-item.component';
import { ModalHistorialProfesionalComponent } from './modal-historial-profesional/modal-historial-profesional.component';
import { ModalDesbloquearProfesionalComponent } from './modal-desbloquear-profesional/modal-desbloquear-profesional.component';
import { ModalPerfilAsignacionComponent } from './modal-perfil-asignacion/modal-perfil-asignacion.component';
import { LayoutAsignacinPerfilTecV2Component } from './layout-asignacion/layout-asignacin-perfil-tec-v2/layout-asignacin-perfil-tec-v2.component';
import { LayoutAsignacinPerfilAdmV2Component } from './layout-asignacion/layout-asignacin-perfil-adm-v2/layout-asignacin-perfil-adm-v2.component';
import { LayoutDatosUsuarioComponent } from './layout-usuario/layout-registro-usuario/layout-datos-usuario.component';
import { LayoutRolUsuarioComponent } from './layout-usuario/layout-asignar-rol/layout-rol-usuario.component';
import { LayoutConfPerfilComponent } from './layout-usuario/layout-configurar-perfil/layout-conf-perfil.component';
import { ModalReasignacionComponent } from './modal-reasignacion/modal-reasignacion.component';
import { ModalAprobadorFirmaAccionComponent } from './modal-aprobador-firma-accion/modal-aprobador-firma-accion.component';
import { ModalFirmaDigitalComponent } from './modal-firma-digital/modal-firma-digital.component';
import { ModalResultMontoEvaTecComponent } from './modal-result-monto-eva-tec/modal-result-monto-eva-tec.component';
import { ModalEmpresaConsorcio } from './modal-empresa-consorcio/modal-empresa-consorcio.component';
import { LayoutInfoProcesoComponent } from './layout-datos-proceso/layout-info-proceso/layout-info-proceso.component';
import { CmpInfoProceComponent } from './cmp-info-proce/cmp-info-proce.component';
import { ModalFormulacionConsultasComponent } from './modal-formulacion-consultas/modal-formulacion-consultas.component';
import { ModalSeccionComponent } from './modal-seccion/modal-seccion.component';
import { ModalRequisitoComponent } from './modal-requisito/modal-requisito.component';
import { ModalEvaluacionContratoObservacionComponent } from './modal-evaluacion-contrato-observacion/modal-evaluacion-contrato-observacion.component';
import { ModalAgregarPaceComponent } from './modal-agregar-Pace/modal-agregar-Pace.component';
import { ModalObservarPaceDivisionComponent } from './modal-Observar-Pace-Division/modal-observar-Pace-division.component';
import { ModalBuscarPaceComponent } from './modal-buscar-Pace/modal-buscar-Pace.component';
import { ModalConfigurarPaceComponent } from './modal-configurar-Pace/modal-configurar-Pace.component';
import { ModalAgregarRepresentanteComponent } from './modal-agregar-representante/modal-agregar-representante.component';
import { ModalAprobadorContratoComponent } from './modal-aprobador-contrato/modal-aprobador-contrato.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalAprobadorHistorialContratoComponent } from './modal-aprobador-historial-contrato/modal-aprobador-historial-contrato.component';
import { ModalRequerimientoRenovacionCrearComponent } from '../pages/requerimiento-renovacion/components/modal-requerimiento-renovacion-crear/modal-requerimiento-renovacion-crear.component';

const sharedComponents = [

    CmpTipoRevisonComponent,
    CmpOpcionEvaluadorComponent,
    CmpOpcionEvaluadorDocumentoComponent,
    CmpAprobadorComponent,
    CmpPerfilComponent,
    CmpItemPerfilComponent,

    CmpFechaEtapaComponent,
    CmpMiembroComponent,

    CmpFechaEtapaComponent,
    CmpInfoProceComponent,

    FormAdjuntosBtnComponent,
    FormAdjuntosMemoryComponent,

    UbigeoUpdComponent,

    LayoutDatosPersNatComponent,
    LayoutDatosPersNatPostorComponent,
    LayoutDatosPersJurComponent,
    LayoutDatosRepresentanteLegalComponent,
    LayoutDatosPersJurExntrajeroComponent,

    LayoutPerfilInscripcionComponent,
    LayoutGradoAcademicoComponent,
    LayoutCapacitacionComponent,
    LayoutDocumentoSustentoExpComponent,
    LayoutDocumentoAcreditaExpComponent,
    LayoutOtrosRequisitosComponent,

    LayoutAsignacionPerfilComponent,
    LayoutAsignacionPerfilTecComponent,
    LayoutAsignacionComponent,
    LayoutAprobacionComponent,
    LayoutAprobacionHistorialComponent,
    LayoutObservacionResultadoComponent,
    LayoutResultadoComponent,

    LayoutDocumentoExpedienteComponent,
    LayoutEvidenciaComponent,
    LayoutSubsanarComponent,

    LayoutDatosGeneralComponent,
    LayoutFechaEtapaComponent,
    LayoutMiemboComponent,
    LayoutItemsComponent,
    LayoutInfoProcesoComponent,
    LayoutItemPerfilComponent,
    LayoutPublicarComponent,
	LayoutDatosUsuarioComponent,
    LayoutRolUsuarioComponent,
    LayoutConfPerfilComponent,
    ModalTileComponent,
    ModalTileComponent2,
    ModalPerfilComponent,
    ModalCapacitacionComponent,
    ModalGradosTitulosComponent,
    ModalDocumentosSustentanComponent,
    ModalDocumentosAcreditanPJComponent,
    ModalEvidenciaComponent,
    ModalOtroRequisitoObservacionComponent,
    ModalOtroRequisitoObservacionPerfilComponent,
    ModalResultMontoEvaTecComponent,
    ModalAprobadorComponent,
    ModalAprobadorAccionComponent,
    ModalNotificacionComponent,
    ModalTerminosComponent,
    ModalProcesoItemsComponent,
    ModalProcesoEtapaComponent,
    ModalProcesoMiembroComponent,
    ModalDocumentoTecnicoComponent,
    ModalDocumentosInformativos,
    ModalDocumentoEconomicoComponent,
    ModalInfoNroProcesoComponent,
    ModalObservacionAdministrativaComponent,
    ModalCambioEstadoItemComponent,
    ModalHistorialProfesionalComponent,
    ModalDesbloquearProfesionalComponent,
    ModalPerfilAsignacionComponent,
    LayoutAsignacinPerfilTecV2Component,
    LayoutAsignacinPerfilAdmV2Component,
    ModalReasignacionComponent,
    ModalAprobadorFirmaAccionComponent,
    ModalFirmaDigitalComponent,
    ModalEmpresaConsorcio,
    ModalFormulacionConsultasComponent,
    ModalSeccionComponent,
    ModalRequisitoComponent,
    ModalEvaluacionContratoObservacionComponent,
    ModalAgregarPaceComponent,
    ModalBuscarPaceComponent,
    ModalObservarPaceDivisionComponent,
    ModalConfigurarPaceComponent,
    ModalAgregarRepresentanteComponent,
    ModalAprobadorContratoComponent,
    ModalAprobadorHistorialContratoComponent,
    ModalRequerimientoRenovacionCrearComponent
  ];

@NgModule({
  imports:      [ CommonModule, MaterialModule,FormsModule, ReactiveFormsModule, InputMaskModule, MatDialogModule],
  declarations: [ ...sharedComponents, OptionRoleDirective ],
  exports:      [ ...sharedComponents, CommonModule, FormsModule, ReactiveFormsModule, OptionRoleDirective ],
  providers:    [ LoadingDialogService, DatePipe, OptionRoleDirective ],
  entryComponents: [...sharedComponents]
})

export class SharedModule {

}
