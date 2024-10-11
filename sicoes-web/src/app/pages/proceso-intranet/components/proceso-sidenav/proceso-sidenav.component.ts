import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { LayoutService } from 'src/@vex/services/layout.service';
import { ProcesoService } from 'src/app/service/proceso.service';
import { EstadoProcesoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';

interface MailSidenavLink {
  label: string;
  codigo?: string;
  route: string[];
  icon: string;
  status: string;
  check?: boolean;
  routerLinkActiveOptions?: { exact: boolean };
}

@Component({
  selector: 'vex-proceso-sidenav',
  templateUrl: './proceso-sidenav.component.html',
  styleUrls: ['./proceso-sidenav.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})

export class ProcesoSidenavComponent implements OnInit, OnDestroy {

  suscriptionProceso: Subscription;
  PROCESO

  @Input() drawer: MatDrawer;
  @Input() editable: boolean = false;

  linksAdd: MailSidenavLink[] = [];

  constructor(
    private layoutService: LayoutService,
    private procesoService: ProcesoService
  ) { }

  ngOnInit(): void {
    this.suscribirSolicitud();
    if(this.editable){
      this.linksAdd = [
        {
          label: '1. Datos generales',
          codigo: 'datos',
          route: ['./datos'],
          icon: 'mat:inbox',
          status: 'active'
        },
        {
          label: '2. Fecha por etapa',
          codigo: 'etapa',
          route: ['./fecha'],
          icon: 'mat:all_inbox',
          status: 'active'
        },
        {
          label: '3. Miembros del comité',
          codigo: 'miembros',
          route: ['./miembros'],
          icon: 'mat:star',
          status: 'active'
        },
        {
          label: '4. Ítems',
          codigo: 'items',
          route: ['./items'],
          icon: 'mat:drafts',
          status: 'active'
        }
      ];
    }else{
      this.noEditable();
    }
  }

  private suscribirSolicitud(){
    this.suscriptionProceso = this.procesoService.suscribeSolicitud().subscribe(sol => {
      this.PROCESO = sol;
      if(this.PROCESO){
        let pubCount = 0;
        this.linksAdd.forEach(element => {
          if(element.check){
            delete element.check;
          }
          if(this.PROCESO.datosGenerales == true && element.codigo.includes('datos')){
            element.check = true;
            pubCount++;
          }
          if(this.PROCESO.etapa == true && element.codigo.includes('etapa')){
            element.check = true;
            pubCount++;
          }
          if(this.PROCESO.miembros == true && element.codigo.includes('miembros')){
            element.check = true;
            pubCount++;
          }
          if(this.PROCESO.items == true && element.codigo.includes('items')){
            element.check = true;
            pubCount++;
          }
          if(pubCount == 4 && this.linksAdd.length == 4 && this.PROCESO.estado?.codigo == EstadoProcesoEnum.EN_ELABORACION){
            this.linksAdd.push({
              label: 'Publicar',
              codigo: 'publicar',
              route: ['./publicar'],
              icon: 'mat:drafts',
              status: 'active'
            })
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
        label: '1. Datos generales',
        route: ['./datos'],
        icon: 'mat:inbox',
        status: 'active'
      },
      {
        label: '2. Fecha por etapa',
        route: ['./fecha'],
        icon: 'mat:all_inbox',
        status: 'inactive'
      },
      {
        label: '3. Miembros del comité',
        route: ['./miembros'],
        icon: 'mat:star',
        status: 'inactive'
      },
      {
        label: '4. Ítems',
        route: ['./items'],
        icon: 'mat:drafts',
        status: 'inactive'
      }
    ];
  }

  ngOnDestroy(): void {
    this.suscriptionProceso.unsubscribe();
  }
  
}
