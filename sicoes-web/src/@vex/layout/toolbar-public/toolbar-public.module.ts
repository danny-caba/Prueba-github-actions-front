import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { NavigationModule } from '../navigation/navigation.module';
import { RouterModule } from '@angular/router';
import { NavigationItemModule } from '../../components/navigation-item/navigation-item.module';
import { MegaMenuModule } from '../../components/mega-menu/mega-menu.module';
import { ToolbarPublicComponent } from './toolbar-public.component';

@NgModule({
  declarations: [ToolbarPublicComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,

    NavigationModule,
    RouterModule,
    NavigationItemModule,
    MegaMenuModule
  ],
  exports: [ToolbarPublicComponent]
})
export class ToolbarPublicModule {
}
