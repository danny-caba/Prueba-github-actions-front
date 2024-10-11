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

import { SharedModule } from 'src/app/shared/shared.module';

import { SolicitudModule } from '../solicitud/solicitud.module';
import { EmpresaSupervisoraRoutingModule } from './empresa-supervisora-routing.module';
import { EmpresaSupervisoraListComponent } from './empresa-supervisora-list/empresa-supervisora-list.component';
import { EmpresaSupervisoraPnViewComponent } from './empresa-supervisora-view/empresa-supervisora-pn-view/empresa-supervisora-pn-view.component';
import { EmpresaSupervisoraViewComponent } from './empresa-supervisora-view/empresa-supervisora-view.component';
import { EmpresaSupervisoraPjViewComponent } from './empresa-supervisora-view/empresa-supervisora-pj-view/empresa-supervisora-pj-view.component';
import { LayoutPerfilAprobadoComponent } from './empresa-supervisora-view/layout-perfil-aprobado/layout-perfil-aprobado.component';
import { EmpresaSupervisoraSuspenderComponent } from './empresa-supervisora-suspender/empresa-supervisora-suspender.component';
import { EmpresaSupervisoraPnPostorViewComponent } from './empresa-supervisora-view/empresa-supervisora-pn-postor-view/empresa-supervisora-pn-postor-view.component';
import { EmpresaSupervisoraCancelarComponent } from './empresa-supervisora-cancelar/empresa-supervisora-cancelar.component';
import { EmpresaSupervisoraSuspCancListComponent } from './empresa-supervisora-susp-canc-list/empresa-supervisora-susp-canc-list.component';
import { EmpresaSupervisoraSuspCancViewComponent } from './empresa-supervisora-susp-canc-view/empresa-supervisora-susp-canc-view.component';
import { EmpresaSupervisoraPjExtranjeroViewComponent } from './empresa-supervisora-view/empresa-supervisora-pj-extranjero-view/empresa-supervisora-pj-extranjero-view.component';


@NgModule({
  declarations: [
    EmpresaSupervisoraListComponent,
    EmpresaSupervisoraViewComponent,
    EmpresaSupervisoraSuspenderComponent,
    EmpresaSupervisoraCancelarComponent,
    EmpresaSupervisoraPnViewComponent,
    EmpresaSupervisoraPnPostorViewComponent,
    EmpresaSupervisoraPjViewComponent,
    EmpresaSupervisoraSuspCancListComponent,
    EmpresaSupervisoraSuspCancViewComponent,
    EmpresaSupervisoraPjExtranjeroViewComponent,
    LayoutPerfilAprobadoComponent
  ],
  imports: [
    CommonModule,
    EmpresaSupervisoraRoutingModule,
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

    SolicitudModule
  ]
})
export class EmpresaSupervisoraModule { }
