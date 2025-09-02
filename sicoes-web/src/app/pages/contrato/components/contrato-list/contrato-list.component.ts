import { Component } from '@angular/core';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';
import { AuthFacade } from '../../../../auth/store/auth.facade';

@Component({
  selector: 'vex-contrato-list',
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss']
})
export class ContratoListComponent {
  user$ = this.authFacade.user$;
  tipoPersonaEnum = TipoPersonaEnum;

  constructor(private authFacade: AuthFacade) { }
}