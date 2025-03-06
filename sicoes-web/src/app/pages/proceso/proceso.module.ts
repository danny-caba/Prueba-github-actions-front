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
import {MatRadioModule} from '@angular/material/radio';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProcesoIntranetRoutingModule } from './proceso-routing.module';
import { ProcesoItemPresentarComponent } from './proceso-item-presentar/proceso-item-presentar.component';
import { ProcesoListComponent } from './proceso-list/proceso-list.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DatosProcesoFormComponent } from './proceso-item-presentar/datos-proceso-form/datos-proceso-form.component';
import { InvitarProfesionalFormComponent } from './proceso-item-presentar/invitar-profesional-form/invitar-profesional-form.component';
import { PropuestaEconomicaFormComponent } from './proceso-item-presentar/propuesta-economica-form/propuesta-economica-form.component';
import { PropuestaTecnicaFormComponent } from './proceso-item-presentar/propuesta-tecnica-form/propuesta-tecnica-form.component';
import { PropuestaWizardComponent } from './propuesta-wizard/propuesta-wizard.component';
import { PropuestaSidenavComponent } from './components/propuesta-sidenav/propuesta-sidenav.component';
import { PropuestaSidenavLinkComponent } from './components/propuesta-sidenav-link/propuesta-sidenav-link.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { ResumenPropuestaComponent } from './proceso-item-presentar/resumen-proceso/resumen-proceso.component';
import { PropuestaResumenComponent } from './propuesta-resumen/propuesta-resumen.component';
import { FormulacionConsultasComponent } from './formulacion-consultas/formulacion-consultas.component';
import { TruncateWordPipe } from 'src/app/shared/pipes/truncate-word.pipe';

@NgModule({
  declarations: [
    DatosProcesoFormComponent,
    InvitarProfesionalFormComponent,
    PropuestaEconomicaFormComponent,
    PropuestaTecnicaFormComponent,
    PropuestaWizardComponent,
    ResumenPropuestaComponent,
    
    PropuestaSidenavComponent,
    PropuestaSidenavLinkComponent,
    PropuestaResumenComponent,

    ProcesoListComponent,
    ProcesoItemPresentarComponent,
    FormulacionConsultasComponent,
    TruncateWordPipe

  ],
  imports: [
    CommonModule,
    ProcesoIntranetRoutingModule,
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
    MatStepperModule,
    MatRadioModule,
    SharedModule,

    MatSidenavModule,
    ScrollingModule,
    ScrollbarModule
  ]
})
export class ProcesoModule { }
