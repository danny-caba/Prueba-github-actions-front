import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ExtranetRoutingModule } from '../extranet/extranet-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RegistroEmpComponent } from './registro-emp/registro-emp.component';
import { RegistroEmpSuspCancComponent } from './registro-emp-susp-canc/registro-emp-susp-canc.component';
import { LoginExtranjeroComponent } from './login-extranjero/login-extranjero.component';
import { RegistroEmpPnComponent } from './registro-emp/registro-emp-pn/registro-emp-pn.component';
import { RegistroEmpPjComponent } from './registro-emp/registro-emp-pj/registro-emp-pj.component';
import { RegistroEmpSuspCancPnComponent } from './registro-emp-susp-canc/registro-emp-susp-canc-pn/registro-emp-susp-canc-pn.component';
import { RegistroEmpSuspCancPjComponent } from './registro-emp-susp-canc/registro-emp-susp-canc-pj/registro-emp-susp-canc-pj.component';
import { RegistroEmpExtranjeraComponent } from './registro-emp-extranjera/registro-emp-extranjera.component';
import { RecuperarContraneniaComponent } from './recuperar-contrasenia/recuperar-contrasenia.component';

@NgModule({
  declarations: [
    RegistroEmpPnComponent,
    RegistroEmpPjComponent,
    RegistroEmpSuspCancPnComponent,
    RegistroEmpSuspCancPjComponent,
    RegistroEmpExtranjeraComponent,

    RegistroEmpComponent,
    RegistroEmpSuspCancComponent,
    LoginExtranjeroComponent,
    RecuperarContraneniaComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,

    ExtranetRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,

    MatTooltipModule,
    MatButtonModule,

    PageLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatButtonToggleModule
  ]
})
export class PublicModule { }
