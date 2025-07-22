import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputMaskModule } from '@ngneat/input-mask';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentoPnDetalleComponent } from './requerimiento-documento-add/documento-pn-detalle/documento-pn-detalle.component';
import { RequerimientoDocumentoAddComponent } from './requerimiento-documento-add/requerimiento-documento-add.component';
import { RequerimientoDocumentoListComponent } from './requerimiento-documento-list/requerimiento-documento-list.component';
import { RequerimientoRoutingModule } from './requerimiento-routing.module';
import { RequerimientoDocumentoReviewComponent } from './requerimiento-documento-review/requerimiento-documento-review.component';

@NgModule({
  declarations: [
    RequerimientoDocumentoListComponent,
    RequerimientoDocumentoAddComponent,
    DocumentoPnDetalleComponent,
    RequerimientoDocumentoReviewComponent
  ],
  imports: [
    CommonModule,
    RequerimientoRoutingModule,
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
    ScrollbarModule
  ],
  exports:[
    RequerimientoDocumentoListComponent,
    DocumentoPnDetalleComponent
  ]
})
export class RequerimientoModule { }
