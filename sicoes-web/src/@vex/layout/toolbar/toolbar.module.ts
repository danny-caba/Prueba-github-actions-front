import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { ToolbarNotificationsModule } from './toolbar-notifications/toolbar-notifications.module';
import { ToolbarUserModule } from './toolbar-user/toolbar-user.module';
import { ToolbarSearchModule } from './toolbar-search/toolbar-search.module';
import { NavigationModule } from '../navigation/navigation.module';
import { RouterModule } from '@angular/router';
import { NavigationItemModule } from '../../components/navigation-item/navigation-item.module';
import { MegaMenuModule } from '../../components/mega-menu/mega-menu.module';
import { ToolbarMobComponent } from './toolbar-mob.component';

@NgModule({
  declarations: [ToolbarComponent, ToolbarMobComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    ToolbarNotificationsModule,
    ToolbarUserModule,
    ToolbarSearchModule,

    NavigationModule,
    RouterModule,
    NavigationItemModule,
    MegaMenuModule
  ],
  exports: [ToolbarComponent, ToolbarMobComponent]
})
export class ToolbarModule {
}
