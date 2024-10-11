import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { InvitacionService } from 'src/app/service/invitacion.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-invitacion-form',
  templateUrl: './invitacion-form.component.html',
  styleUrls: ['./invitacion-form.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class InvitacionFormComponent extends BaseComponent implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  PROPUESTA_PROFESIONAL
  displayedColumns: string[] = ['nombre', 'fechaInicio', 'fechaFin'];
  dataSource:any;

  constructor(
    private authFacade: AuthFacade,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private invitacionService: InvitacionService
  ) { 
    super();
  }

  ngOnInit(): void {
    let idPropuestaProfesional = this.activeRoute.snapshot.paramMap.get('idPropuestaProfesional');
    let propuestaUuid = this.activeRoute.snapshot.paramMap.get('propuestaUuid');

    this.invitacionService.obtenerPropuestaProfesional(idPropuestaProfesional, propuestaUuid).subscribe(inv => {
      this.PROPUESTA_PROFESIONAL = inv;
      this.dataSource = this.PROPUESTA_PROFESIONAL.propuesta.procesoItem.proceso.etapas;
    });
    
  }

  cancelar(){
    this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST]);
  }
  
  aceptar(){
    functionsAlertMod2.preguntarSiNo('¿Estás seguro de aceptar la invitación?<br>Recuerda: La respuesta no podrá ser cambiada', 'Sí, aceptar invitación').then((result) => {
      if(result.isConfirmed){
        this.invitacionService.aceptarInvitacion(this.PROPUESTA_PROFESIONAL.idPropuestaProfesional, this.PROPUESTA_PROFESIONAL.propuesta.propuestaUuid,this.PROPUESTA_PROFESIONAL).subscribe(inv => {
          functionsAlertMod2.alertaConfigurable('Tu invitación se aceptó correctamente', 'Continuar', 'success').then((result => {
            this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST]);
          }))
        });
      } 
    });
  }

  rechazar(){
    functionsAlertMod2.preguntarSiNo('¿Estás seguro de rechazar la invitación?<br>Recuerda: La respuesta no podrá ser cambiada', 'Sí, rechazar invitación').then((result) => {
      if (result.isConfirmed) {
        this.invitacionService.rechazarInvitacion(this.PROPUESTA_PROFESIONAL.idPropuestaProfesional, this.PROPUESTA_PROFESIONAL.propuesta.propuestaUuid,this.PROPUESTA_PROFESIONAL).subscribe(inv => {
          functionsAlertMod2.alertaConfigurable('Tu invitación fue rechazada', 'Continuar', 'warning').then((result => {
            this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST]);
          }))
        }); 
      }
    });
  }
}
