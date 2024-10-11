import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import {  GestionUsuarioModel } from 'src/app/interface/gestion-usuario';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';

@Component({
  selector: 'vex-usuario-add',
  templateUrl: './usuario-add.component.html',
  styleUrls: ['./usuario-add.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class UsuarioAddComponent extends BasePageComponent<GestionUsuarioModel> implements OnInit {
  @Input() userData: any;
 
  constructor(  private fb: FormBuilder) {
    super();
   }

  ngOnInit(): void {
  }

  serviceTable(filtro) {
    
  }

  obtenerFiltro() {

  }

}
