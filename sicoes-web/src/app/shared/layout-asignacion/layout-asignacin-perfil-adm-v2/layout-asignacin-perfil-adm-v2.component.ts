import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../components/base.component';
import { Solicitud } from 'src/app/interface/solicitud.model';

@Component({
  selector: 'vex-layout-asignacin-perfil-adm-v2',
  templateUrl: './layout-asignacin-perfil-adm-v2.component.html',
  styleUrls: ['./layout-asignacin-perfil-adm-v2.component.scss']
})
export class LayoutAsignacinPerfilAdmV2Component extends BaseComponent implements OnInit, OnDestroy, OnChanges  {

  @Input() SOLICITUD: Partial<Solicitud>
  @Input() PERFIL: Partial<any>
  @Input() rolInput: string;

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  ngOnDestroy() {
  }

}
