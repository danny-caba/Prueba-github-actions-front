import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { UsuarioService } from 'src/app/service/usuario.service';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-solicitud-opcion',
  templateUrl: './solicitud-opcion.component.html',
  styleUrls: ['./solicitud-opcion.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudOpcionComponent implements OnInit {

  tipoPersonaEnum = TipoPersonaEnum

  usuario$ = this.authFacade.user$;
  usuario: AuthUser

  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    })
  }

  nuevaSolicitud(){
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_ADD]);
  }

  nuevaSolicitudPostorValidar(){
    this.usuarioService.validarTipoPersona().subscribe(res => {
      this.nuevaSolicitudPostor(res)
    });
  }

  nuevaSolicitudPostor(usu){
    if(usu?.nombreTipoNegocio != 'PERSONA NATURAL CON NEGOCIO'){
      functionsAlert.error('Para poder registrar su solicitud usted debe ser una Persona Natural Con Negocio').then((result) => {
        
      });
      return;
    }

    let queryParams: Params = { tipoPersona: TipoPersonaEnum.PN_POSTOR };
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_ADD], {
      queryParams: queryParams
    });
  }

  nuevaSolicitudPersPropuesto(){
    let queryParams: Params = { tipoPersona: TipoPersonaEnum.PN_PERS_PROPUESTO };
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_ADD], {
      queryParams: queryParams
    });
  }

}
 