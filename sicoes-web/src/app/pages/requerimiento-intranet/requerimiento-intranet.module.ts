import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RequerimientoListComponent } from './requerimiento-list/requerimiento-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { RequerimientoInformeAddComponent } from './requerimiento-informe-add/requerimiento-informe-add.component';
import { RequerimientoInformePnAddComponent } from './requerimiento-informe-add/informe-pn-add/requerimiento-informe-pn-add.component';
import { RequerimientoInvitacionListComponent } from './requerimiento-invitacion-list/requerimiento-invitacion-list.component';
import { RequerimientoAprobacionHistorialComponent } from './requerimiento-aprobacion-historial/requerimiento-aprobacion-historial.component';
import { RequerimientoAprobacionSupervisorPnComponent } from './requerimiento-aprobacion-supervisor-pn/requerimiento-aprobacion-supervisor-pn.component';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { RequerimientoIntranetRoutingModule } from './requerimiento-intranet-routing.module';
import { RequerimientoDocumentoListComponent } from './requerimiento-documento-list/requerimiento-documento-list.component';
import { RequerimientoDocumentoEvaluarComponent } from './requerimiento-documento-evaluar/requerimiento-documento-evaluar.component';
import { RequerimientoModule } from '../requerimiento/requerimiento.module';
import { RequerimientoDocumentoEvaluarDetalleComponent } from './requerimiento-documento-evaluar-detalle/requerimiento-documento-evaluar-detalle.component';
import { RequerimientoEditarContratoComponent } from './requerimiento-editar-contrato/requerimiento-editar-contrato.component';
import { RequerimientoContratoListComponent } from './requerimiento-contrato-list/requerimiento-contrato-list.component';

@NgModule({
  declarations: [
    RequerimientoListComponent,
    RequerimientoInformeAddComponent,
    RequerimientoInformePnAddComponent,
    RequerimientoInvitacionListComponent,
    RequerimientoAprobacionHistorialComponent,
    RequerimientoAprobacionSupervisorPnComponent,
    RequerimientoDocumentoListComponent,
    RequerimientoDocumentoEvaluarComponent,
    RequerimientoDocumentoEvaluarDetalleComponent,
    RequerimientoEditarContratoComponent,
    RequerimientoContratoListComponent
  ],
  imports: [
    CommonModule,
    RequerimientoIntranetRoutingModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
    PageLayoutModule,
    BreadcrumbsModule,
    SecondaryToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatExpansionModule,
    MatMenuModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    SharedModule,
    InputMaskModule,
    MaterialModule,
    ScrollbarModule,
    RequerimientoModule
  ],
  exports: [
    RequerimientoListComponent,
    RequerimientoInformeAddComponent,
    RequerimientoInformePnAddComponent,
    RequerimientoAprobacionSupervisorPnComponent,
    RequerimientoDocumentoListComponent,
    RequerimientoDocumentoEvaluarComponent,
    RequerimientoContratoListComponent
  ]
})
export class RequerimientoIntranetModule { }
