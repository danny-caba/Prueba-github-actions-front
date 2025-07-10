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
import { SolicitudIntranetRoutingModule } from './solicitud-intranet-routing.module';
import { SolicitudIntranetListIntranetComponent } from './solicitud-list-intranet/solicitud-list-intranet.component';
import { SolicitudListPendientesComponent } from './solicitud-list-pendientes/solicitud-list-pendientes.component';
import { SolicitudPnProcesarComponent } from './solicitud-pn-procesar/solicitud-pn-procesar.component';
import { SolicitudModule } from '../solicitud/solicitud.module';
import { SolicitudListAtencionComponent } from './solicitud-list-atencion/solicitud-list-atencion.component';
import { SolicitudListAprobacionComponent } from './solicitud-list-aprobacion/solicitud-list-aprobacion.component';
import { ReemplazarPersonalComponent } from './solicitud-list-aprobacion/reemplazar-personal-propuesto/reemplazar-personal-propuesto.component';
import { AdendaReemplazarPersonalComponent } from './solicitud-list-aprobacion/adenda-reemplazar-personal/adenda-reemplazar-personal.component';
import { HistoriaAprobacionesComponent } from './solicitud-list-aprobacion/historial-aprobaciones/historial-aprobaciones.component';

@NgModule({
  declarations: [
    SolicitudIntranetListIntranetComponent,
    SolicitudListPendientesComponent,
    SolicitudPnProcesarComponent,
    SolicitudListAtencionComponent,
    SolicitudListAprobacionComponent,
    ReemplazarPersonalComponent,
    AdendaReemplazarPersonalComponent,
    HistoriaAprobacionesComponent
  ],
  imports: [
    CommonModule,
    SolicitudIntranetRoutingModule,
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
export class SolicitudIntranetModule { }
