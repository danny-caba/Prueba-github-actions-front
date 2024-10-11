import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls } from 'src/helpers/internal-urls.components';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { SuspeCancService } from 'src/app/service/susp-canc.service';
import { TipoSuspensionCancelacionEnum } from 'src/helpers/constantes.components';

@Component({
  selector: 'vex-empresa-supervisora-susp-canc-view',
  templateUrl: './empresa-supervisora-susp-canc-view.component.html',
  styleUrls: ['./empresa-supervisora-susp-canc-view.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class EmpresaSupervisoraSuspCancViewComponent extends BaseComponent implements OnInit {

  intenalUrls: InternalUrls;
  SUSPENCION_CANCELACION: any
  tipoSuspensionCancelacionEnum = TipoSuspensionCancelacionEnum
  editable: boolean = false

  formGroup = this.fb.group({
    numeroDocumento: [{value: '', disabled: true }],
    razonSocial: [{value: '', disabled: true }],
    causal: [null],
    sustento: [''],
    fechaInicio: [null],
    fechaFin: [null],
  });

  listCausalSuspender: any[]

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private suspeCancService: SuspeCancService
  ) {
    super();
  }

  ngOnInit(): void {

    let idSuspensionCancelacion = this.activeRoute.snapshot.paramMap.get('idSuspensionCancelacion');
    if(idSuspensionCancelacion){
      this.suspeCancService.obtenerSuspCanc(idSuspensionCancelacion).subscribe( resp => {
        this.SUSPENCION_CANCELACION = resp;
        this.editable = (resp?.estado?.codigo == '01');
      })
    }

  }
  
  
}
