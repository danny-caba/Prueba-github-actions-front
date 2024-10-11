import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtranetRoutingModule } from './extranet-routing.module';
import { ExtranetComponent } from './extranet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginSunatComponent } from './login-sunat/login-sunat.component';
import { MatTableModule } from '@angular/material/table';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CustomLayoutModule } from 'src/app/custom-layout/custom-layout.module';

@NgModule({
  declarations: [
    ExtranetComponent,
    LoginSunatComponent,
  ],
  imports: [
    CommonModule,
    ExtranetRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,

    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,

    PageLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatMenuModule,
    MatDatepickerModule,
    CustomLayoutModule
  ]
})
export class ExtranetModule { }
