import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthFacade } from 'src/app/auth/store/auth.facade';

import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-intranet-sunat',
  templateUrl: './login-intranet.component.html',
  styleUrls: ['./login-intranet.component.scss']
})
export class LoginIntranetComponent implements OnInit {

  cryto: string = '';
  
  constructor(private router: Router,
    private authFacade: AuthFacade,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //this.activatedRoute.snapshot.queryParams.returnUrl = Link.INTRANET + '/' + Link.SOLICITUDES_LIST;

    const queryParams: Params = { returnUrl: Link.INTRANET };

    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
    });

    this.cryto = this.activatedRoute.snapshot.queryParamMap.get('xxyyxxx');
    
    let usu: any = {
      token : this.cryto
    }

    sessionStorage.setItem("USUARIO", this.cryto);
    this.authFacade.login(JSON.stringify(usu), '12345');
  }

  send(){
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST]);
  }

}
