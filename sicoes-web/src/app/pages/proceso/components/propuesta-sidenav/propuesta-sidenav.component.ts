import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { LayoutService } from 'src/@vex/services/layout.service';
import { PropuestaService } from 'src/app/service/propuesta.service';

interface MailSidenavLink {
  label: string;
  route: string[];
  icon: string;
  status: string;
  codigo?: string;
  check?: boolean;
  routerLinkActiveOptions?: { exact: boolean };
}

@Component({
  selector: 'vex-propuesta-sidenav',
  templateUrl: './propuesta-sidenav.component.html',
  styleUrls: ['./propuesta-sidenav.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})

export class PropuestaSidenavComponent implements OnInit, OnDestroy {

  suscriptionPropuesta: Subscription;
  PROPUESTA

  @Input() drawer: MatDrawer;
  @Input() editable: boolean = false;

  linksAdd: MailSidenavLink[] = [];

  constructor(
    private layoutService: LayoutService,
    private propuestaService: PropuestaService) { }

  ngOnInit(): void {
    this.suscribirPropuesta();
    if(this.editable){
      this.linksAdd = [
        {
          label: '1. Datos del Proceso',
          codigo: 'datoProceso',
          route: ['./datos'],
          icon: 'mat:inbox',
          status: 'active'
        },
        {
          label: '2. Propuesta Técnica',
          codigo: 'proTecnica',
          route: ['./propuesta-tecnica'],
          icon: 'mat:all_inbox',
          status: 'active'
        },
        {
          label: '3. Invitar Profesionales',
          codigo: 'invitarProfesionales',
          route: ['./invitar-profesionales'],
          icon: 'mat:star',
          status: 'active'
        },
        {
          label: '4. Propuesta Económica',
          codigo: 'proEconomica',
          route: ['./propuesta-economica'],
          icon: 'mat:drafts',
          status: 'active'
        }
      ];
    }else{
      this.noEditable();
    }
  }

  private suscribirPropuesta(){
    this.suscriptionPropuesta = this.propuestaService.suscribePropuesta().subscribe(sol => {
      this.PROPUESTA = sol;
      if(this.PROPUESTA){
        let pubCount = 0;
        this.linksAdd.forEach(element => {
          if(this.PROPUESTA.datoProceso == true && element.codigo.includes('datoProceso')){
            element.check = true;
            pubCount++;
          }
          if(this.PROPUESTA.proTecnica == true && element.codigo.includes('proTecnica')){
            element.check = true;
            pubCount++;
          }
          if(this.PROPUESTA.invitarProfesionales == true && element.codigo.includes('invitarProfesionales')){
            element.check = true;
            pubCount++;
          }
          if(this.PROPUESTA.proEconomica == true && element.codigo.includes('proEconomica')){
            element.check = true;
            pubCount++;
          }
          if(pubCount == 4 && this.linksAdd.length == 4){
            this.linksAdd.push({
              label: 'Presentar propuesta',
              codigo: 'presentarPro',
              route: ['./propuesta-resumen'],
              icon: 'mat:drafts',
              status: 'active'
            })
          }
          if(this.PROPUESTA.presentarPro == true && element.codigo.includes('presentarPro')){
            element.check = true;
          }
        });
      }
    });
  }

  closeDrawer() {
    if (this.layoutService.isLtLg()) {
      this.drawer?.close();
    }
  }

  noEditable(){
    this.linksAdd = [
      {
        label: '1. Datos del Proceso',
        route: ['./datos'],
        icon: 'mat:inbox',
        status: 'active'
      },
      {
        label: '2. Propuesta Técnica',
        route: ['./propuesta-tecnica'],
        icon: 'mat:all_inbox',
        status: 'inactive'
      },
      {
        label: '3. Invitar Profesionales',
        route: ['./invitar-profesionales'],
        icon: 'mat:star',
        status: 'inactive'
      },
      {
        label: '4. Propuesta Económica',
        route: ['./propuesta-economica'],
        icon: 'mat:drafts',
        status: 'inactive'
      }
    ];
  }

  ngOnDestroy(): void {
    this.suscriptionPropuesta.unsubscribe();
  }

}
