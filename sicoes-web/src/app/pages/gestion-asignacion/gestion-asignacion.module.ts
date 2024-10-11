import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandejaAsignacionComponent } from './bandeja-asignacion/bandeja-asignacion.component';
import { GestionAsignacionRoutingModule } from './gestion-asignacion-routing.module';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { MatSidenavModule } from '@angular/material/sidenav';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    BandejaAsignacionComponent
  ],
  imports: [
    GestionAsignacionRoutingModule,
    CommonModule,
    MatSidenavModule,
    ScrollbarModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    BreadcrumbsModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatIconModule,
    MatInputModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class GestionAsignacionModule { }
