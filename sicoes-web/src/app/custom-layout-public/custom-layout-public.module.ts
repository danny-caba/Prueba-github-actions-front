import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../@vex/layout/layout.module';
import { CustomLayoutPublicComponent } from './custom-layout-public.component';
import { SidenavModule } from '../../@vex/layout/sidenav/sidenav.module';
import { FooterModule } from '../../@vex/layout/footer/footer.module';
import { ConfigPanelModule } from '../../@vex/components/config-panel/config-panel.module';
import { SidebarModule } from '../../@vex/components/sidebar/sidebar.module';
import { QuickpanelModule } from '../../@vex/layout/quickpanel/quickpanel.module';
import { ToolbarPublicModule } from 'src/@vex/layout/toolbar-public/toolbar-public.module';


@NgModule({
  declarations: [CustomLayoutPublicComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SidenavModule,
    ToolbarPublicModule,
    FooterModule,
    ConfigPanelModule,
    SidebarModule,
    QuickpanelModule
  ]
})
export class CustomLayoutPublicModule {
}
