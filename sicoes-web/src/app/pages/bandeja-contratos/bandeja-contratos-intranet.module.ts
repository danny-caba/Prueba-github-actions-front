import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { ContratoModule } from '../contrato/contrato.module';
import { BandejaContratosIntranetRoutingModule } from './bandeja-contratos-intranet-routing.module';
import { BandejaContratosListComponent } from './components/bandeja-contratos-list/bandeja-contratos-list.component';
import { BandejaContratosProcesarComponent } from './components/bandeja-contratos-procesar/bandeja-contratos-procesar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    BandejaContratosListComponent,
    BandejaContratosProcesarComponent
  ],
  imports: [
    CommonModule,
    BandejaContratosIntranetRoutingModule,
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
    ContratoModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ]
})
export class BandejaContratosIntranetModule { }
