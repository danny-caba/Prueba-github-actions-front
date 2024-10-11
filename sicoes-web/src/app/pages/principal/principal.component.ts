import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class PrincipalComponent implements OnInit {

  links: any[] = [
    {
      label: 'MÓDULOS DE EMPRESAS SUPERVISORAS',
      route: '../' + Link.EXTRANET,
      //icon: icBook
    },
    {
      label: 'MÓDULO DE GESTIÓN DE OSINERMING',
      route: '../' + Link.INTRANET,
      //icon: icBook
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
