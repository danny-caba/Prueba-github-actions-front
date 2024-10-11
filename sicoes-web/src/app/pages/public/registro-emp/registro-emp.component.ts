import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls } from 'src/helpers/internal-urls.components';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { ParametriaService } from 'src/app/service/parametria.service';

@Component({
  selector: 'vex-registro-emp',
  templateUrl: './registro-emp.component.html',
  styleUrls: ['./registro-emp.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RegistroEmpComponent implements OnInit {

  intenalUrls: InternalUrls;

  flagJuridico = false;

  form = this.fb.group({
    opcionJuridica: true
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService,
    private sanitizer: DomSanitizer
  ) {
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.flagJuridico = true;
  }

  flagIsJuridico(val) {
    this.flagJuridico = val;
  }

  descargarPDF(): SafeResourceUrl {
    const pdfPath = 'assets/file-empresas/facturacion.pdf';
    return this.sanitizer.bypassSecurityTrustResourceUrl(pdfPath);
  }

}
