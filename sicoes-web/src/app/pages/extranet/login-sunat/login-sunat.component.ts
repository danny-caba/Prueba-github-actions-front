import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from 'src/app/auth/store/auth.facade';

import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-login-sunat',
  templateUrl: './login-sunat.component.html',
  styleUrls: ['./login-sunat.component.scss']
})
export class LoginSunatComponent implements OnInit {

  cryto: string = '';
  
  constructor(private router: Router,
    private authFacade: AuthFacade,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cryto = this.route.snapshot.queryParamMap.get('xxyyxxx');
    
    let usu: any = {
      token : this.cryto
    }

    this.authFacade.login(JSON.stringify(usu), '12345');
  }

  send(){
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

}
