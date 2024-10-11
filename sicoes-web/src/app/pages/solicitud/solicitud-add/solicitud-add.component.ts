import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';

@Component({
  selector: 'vex-solicitud-add',
  templateUrl: './solicitud-add.component.html',
  styleUrls: ['./solicitud-add.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudAddComponent extends BaseComponent implements OnInit {

  usuario$ = this.authFacade.user$;
  tipoPersonaEnum = TipoPersonaEnum

  $tipoPers: string

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authFacade: AuthFacade
  ) {
    super();

    this.route.queryParamMap.subscribe(queryParamMap => {
      if (queryParamMap.has('tipoPersona')) {
        this.$tipoPers = queryParamMap.get('tipoPersona');
      }
    });
  }

  ngOnInit(): void {
    
  }

}