import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginIntranetComponent } from './login-intranet/login-intranet.component';
import { IntranetComponent } from './intranet.component';
import { IntranetRoutingModule } from './intranet-routing.module';

@NgModule({
  declarations: [
    IntranetComponent,
    LoginIntranetComponent
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,

    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class IntranetModule { }
