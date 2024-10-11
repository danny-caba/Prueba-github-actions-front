import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePe from '@angular/common/locales/es-PE';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';

import { MatPaginatorIntlES } from 'src/helpers/custom-mat-pag';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { CoreModule } from './core/core.module';
import { SharedAppModule } from './shared-app/shared-app.module';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { CustomLayoutPublicModule } from './custom-layout-public/custom-layout-public.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

registerLocaleData(localePe);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Core
    CoreModule,
    SharedAppModule,

    // Vex
    VexModule,
    CustomLayoutModule,
    CustomLayoutPublicModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlES},
    { provide: LOCALE_ID, useValue: "es-PE" },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    //{ provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true }
    //{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill', floatLabel: 'always'}}
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
