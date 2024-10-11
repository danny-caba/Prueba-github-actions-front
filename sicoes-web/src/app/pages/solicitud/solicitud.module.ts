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

import { SolicitudListComponent } from './solicitud-list/solicitud-list.component';
import { SolicitudRoutingModule } from './solicitud-routing.module';
import { SolicitudPnFormComponent } from './solicitud-add/solicitud-pn-form/solicitud-pn-form.component';
import { SolicitudPjFormComponent } from './solicitud-add/solicitud-pj-form/solicitud-pj-form.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { SolicitudAddComponent } from './solicitud-add/solicitud-add.component';
import { SolicitudEditComponent } from './solicitud-edit/solicitud-edit.component';
import { SolicitudPjEditComponent } from './solicitud-edit/solicitud-pj-edit/solicitud-pj-edit.component';
import { SolicitudPnEditComponent } from './solicitud-edit/solicitud-pn-edit/solicitud-pn-edit.component';
import { SolicitudOpcionComponent } from './solicitud-opcion/solicitud-opcion.component';
import { SolicitudPnPostorFormComponent } from './solicitud-add/solicitud-pn-postor-form/solicitud-pn-postor-form.component';
import { SolicitudPnPostorEditComponent } from './solicitud-edit/solicitud-pn-postor-edit/solicitud-pn-postor-edit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SolicitudPjExtrnajeroFormComponent } from './solicitud-add/solicitud-pj-extrnajero-form/solicitud-pj-extrnajero-form.component';
import { SolicitudPjExtranjeroEditComponent } from './solicitud-edit/solicitud-pj-extranejo-edit/solicitud-pj-extranjero-edit.component';

@NgModule({
  declarations: [
    SolicitudOpcionComponent,
    SolicitudAddComponent,
    SolicitudEditComponent,
    SolicitudPjEditComponent,
    SolicitudPnEditComponent,
    SolicitudPjExtranjeroEditComponent,
    SolicitudPnPostorEditComponent,
    SolicitudListComponent,
    SolicitudPnFormComponent,
    SolicitudPnPostorFormComponent,
    SolicitudPjFormComponent,
    SolicitudPjExtrnajeroFormComponent
  ],
  imports: [
    CommonModule,
    SolicitudRoutingModule,
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
  ],
  exports:[
    SolicitudPnEditComponent,
    SolicitudPjEditComponent,
    SolicitudPjExtranjeroEditComponent
  ]
})
export class SolicitudModule { }
