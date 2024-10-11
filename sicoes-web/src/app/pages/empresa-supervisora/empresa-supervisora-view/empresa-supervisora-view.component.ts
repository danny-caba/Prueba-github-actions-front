import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-empresa-supervisora-view',
  templateUrl: './empresa-supervisora-view.component.html',
  styleUrls: ['./empresa-supervisora-view.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class EmpresaSupervisoraViewComponent extends BaseComponent implements OnInit, OnDestroy {

  tipoPersonaEnum = TipoPersonaEnum;

  usuario$ = this.authFacade.user$;
  SUPERVISORA: any;
  editable: boolean = false;
  @Input() viewEvaluacion: boolean;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private supervisoraService: SupervisoraService,
    private authFacade: AuthFacade
  ) {
    super();
  }

  ngOnInit(): void {

    this.activeRoute.data.subscribe(data => {
      if(data.editable){
        this.editable = data.editable;
      }
    })

    let idSupervisora = this.activeRoute.snapshot.paramMap.get('idSupervisora');
    if(idSupervisora){
      this.supervisoraService.obtenerSupervisora(idSupervisora).subscribe( resp => {
        this.SUPERVISORA = resp;
      })
    }
  }

  ngOnDestroy(): void {
    
  }

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST]);
  }

}