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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ContratoRoutingModule } from './contrato-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { ContratoListComponent } from './components/contrato-list/contrato-list.component';
import { ContratoFormComponent } from './components/contrato-form/contrato-form.component';
import { ContratoSeccionComponent } from './components/contrato-seccion/contrato-seccion.component';
import { DocumentoContratoComponent } from './components/documento-contrato/documento-contrato.component';
import { PersonalPropuestoComponent } from './components/personal-propuesto/personal-propuesto.component';
import { FielCumplimientoComponent } from './components/fiel-cumplimiento/fiel-cumplimiento.component';
import { MontoDiferencialComponent } from './components/monto-diferencial/monto-diferencial.component';
import { CmpEvaluacionContratoComponent } from './components/cmp-evaluacion-contrato/cmp-evaluacion-contrato.component';
import { ContratoDocumentosComponent } from './components/contrato-documentos/contrato-documentos.component';
import { RequerimientoModule } from '../requerimiento/requerimiento.module';

@NgModule({
  declarations: [
    ContratoListComponent,
    ContratoFormComponent,
    ContratoSeccionComponent,
    DocumentoContratoComponent,
    PersonalPropuestoComponent,
    FielCumplimientoComponent,
    MontoDiferencialComponent,
    CmpEvaluacionContratoComponent,
    ContratoDocumentosComponent
  ],
  imports: [
    CommonModule,
    ContratoRoutingModule,
    CommonModule,
    MatRadioModule,
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
    SharedModule,
    MatSidenavModule,
    ScrollingModule,
    ScrollbarModule,
    RequerimientoModule
  ], exports: [
    ContratoSeccionComponent,
    DocumentoContratoComponent,
    PersonalPropuestoComponent,
    FielCumplimientoComponent,
    MontoDiferencialComponent,
  ]
})
export class ContratoModule { }
