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
import { ProcesoIntranetRoutingModule } from './proceso-intranet-routing.module';
import { ProcesoIntranetListIntranetComponent } from './proceso-list-intranet/proceso-list-intranet.component';
import { ProcesoAddComponent } from './proceso-add/proceso-add.component';
import { ProcesoEditComponent } from './proceso-edit/proceso-edit.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ProcesoSidenavComponent } from './components/proceso-sidenav/proceso-sidenav.component';
import { ProcesoSidenavLinkComponent } from './components/proceso-sidenav-link/proceso-sidenav-link.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { ProcesoVerPostulanteComponent } from './proceso-ver-postulante/proceso-ver-postulante.component';
import { ProcesoBitacoraComponent } from './proceso-bitacora/proceso-bitacora.component';


@NgModule({
  declarations: [
    ProcesoIntranetListIntranetComponent,
    ProcesoAddComponent,
    ProcesoEditComponent,
    ProcesoSidenavComponent,
    ProcesoSidenavLinkComponent,
    ProcesoVerPostulanteComponent,
    ProcesoBitacoraComponent
  ],
  imports: [
    CommonModule,
    MatRadioModule,
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
    SharedModule,
    MatSidenavModule,
    ScrollingModule,
    ScrollbarModule
  ]
})
export class ProcesoIntranetModule { }
