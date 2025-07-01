import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-reemplazo-pers-form',
  templateUrl: './reemplazo-pers-form.component.html'
})
export class ReemplazoPersFormComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toGoBandejaContratos() {
        functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST]);
            }
          });
    }

}
