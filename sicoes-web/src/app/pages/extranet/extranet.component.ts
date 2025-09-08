import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { ModalTerminosComponent } from 'src/app/shared/modal-terminos/modal-terminos.component';
import { environment } from 'src/environments/environment';
import { FormatoLocal } from 'src/helpers/constantes.components';
import { Link } from 'src/helpers/internal-urls.components';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'vex-extranet',
  templateUrl: './extranet.component.html',
  styleUrls: ['./extranet.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class ExtranetComponent implements OnInit {

  form: UntypedFormGroup;

  inputType = 'password';
  visible = false;

  usuarioInternos = environment.usuarioInternos;
  usuarioExternos = environment.usuarioExternos;

  constructor(private router: Router,
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private adjuntoService: AdjuntosService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  openLoginExtranjero() {
    this.router.navigate([Link.PUBLIC, Link.LOGIN_EXTRANJERO]);
  }

  openRegistro() {
    this.router.navigate([Link.PUBLIC, Link.REGISTRO_EMP]);
  }

  openRegistroSuspCanc() {
    this.router.navigate([Link.PUBLIC, Link.REGISTRO_EMP_SUSP_CANC]);
  }
  send() {
    window.open(environment.loginSunat)

    //window.open('https://certosiservicioslinea.osinergmin.gob.pe/osiservicioslinea/pages/inicio')
    //window.open('https://api-seguridad.sunat.gob.pe/v1/clientessol/dcdb35ac-3e61-4a90-aa82-58191e49af2a/oauth2/login?originalUrl=https://osiservicioslinea.osinergmin.gob.pe/osiservicioslinea/pages/login.jsp&state=s')
  }
  listUsuarioIntranet = [{
    username: 'KSILVAP',
    codigo: 'RESP_ADM//EVA_ADM',
    xxyyxxx: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDc0OTYzNDEsInVzZXJfbmFtZSI6IktTSUxWQVAiLCJqdGkiOiJlZTVlZmU2OS1iMWMyLTQyNTYtYjgzZi00YWE1ZjMxZDRiODQiLCJjbGllbnRfaWQiOiJhcHAiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiaWRVc3VhcmlvIjo4NX0.ZwwBKRd2AEMIBsFy7vWyvyDw7g-r8NVNuigvj4-NNlU'
  }, {
    username: 'RZEGARRA',
    codigo: 'RESP_TEC//EVA_TEC',
    xxyyxxx: '6joTjlStnSLBNBWze/2GK138J38WZ+AKzfv51GHNuyMNgowXSRdhfmrwhNoPwB2csN4BARmk0no1CyJxC463V8PBdyjbujkKMcTWQ4HRgI7NbdDyYQvzfWcp2kIPEEDbp3mMlZzqpzTzVvf2m4xYYm8IA2HRa6DyB073lnnzpDpvp/zOOAd8Xuhyp2wxySk5'
  }, {
    username: 'JURCIA',
    codigo: 'EVA_ADM//EVA_TEC',
    xxyyxxx: 'xnMXR4naxvz2fZT9SMLlRh8m6rFXnmQVVt7nnySeAzCYPcPQ2yEsc4aId086125ErZNvSOIwp0ZLBY7y9HGOaaVbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+9jiCBA4ayBlzLDItJwCzmvbDjjz57ybvlx0g8XFgfGQ='
  }, {
    username: 'EFIELD',
    codigo: 'EVA_ADM//EVA_TEC',
    xxyyxxx: 'NEbs3MYOAEWJmSf3V8IOfAvzUi4JPwRutSgvwBUQkB4WMBBYkSSs9+kk6p5U9/dPYT2MTQ6Rfl99nD601UsaY6Vbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+9Xds6Kj8d+jmwexEMD8WB/bDjjz57ybvlx0g8XFgfGQ='
  }, {
    username: 'RVERAC',
    codigo: 'APROB-TEC',
    xxyyxxx: 'P7DPENzlY/TtfrnvZq7vuZRQHoX3DQCz1W+8rs01QhxyjBf4HJkQoS16A07EatNm0zcGjoYvkDJwMTta5HEG5aVbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+hmFQv3E8iAFsMAZPDCxU1vbDjjz57ybvlx0g8XFgfGQ='
  }, {
    username: 'JVASQUEZG',
    codigo: 'APROB-ADM',
    xxyyxxx: '43ZbRa/R7YztgmDLfOaPQp6FrXMsCTEdJQCSaIZYQ7tgsuOtFG43/MQq3l5T4fYcFBZp4w0wde3PV1ZHGgFt1opiTLJm/IMN7Zfq4zg2Ox0C3fqelr5RQFGlMJ+20hl3XZLnrL5ixuqier5dpTkcpX5nlT35CYsbnObjUpjoyDNzcvJ4UHLLcOUZXmrj8Q0g'
  }, {
    username: 'AOYOLA',
    codigo: 'APROB-TEC',
    xxyyxxx: 'P7DPENzlY/TtfrnvZq7vuZRQHoX3DQCz1W+8rs01QhxyjBf4HJkQoS16A07EatNm0zcGjoYvkDJwMTta5HEG5aVbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+hmFQv3E8iAFsMAZPDCxU1vbDjjz57ybvlx0g8XFgfGQ=3'
  }, {
    username: 'AOLIVERA',
    codigo: 'APROB-TEC',
    xxyyxxx: 'P7DPENzlY/TtfrnvZq7vuZRQHoX3DQCz1W+8rs01QhxyjBf4HJkQoS16A07EatNm0zcGjoYvkDJwMTta5HEG5aVbtk6cww7+slbBOJgLjMCaURsqosnhWKOdL4oxfPR+hmFQv3E8iAFsMAZPDCxU1vbDjjz57ybvlx0g8XFgfGQ=2'
  }, {
    username: 'AALFARO',
    codigo: 'RESP_TEC//EVA_TEC',
    xxyyxxx: '43ZbRa/R7YztgmDLfOaPQp6FrXMsCTEdJQCSaIZYQ7tgsuOtFG43/MQq3l5T4fYcFBZp4w0wde3PV1ZHGgFt1opiTLJm/IMN7Zfq4zg2Ox0C3fqelr5RQFGlMJ+20hl3XZLnrL5ixuqier5dpTkcpX5nlT35CYsbnObjUpjoyDNzcvJ4UHLLcOUZXmrj8Q0g'
  }, {
    username: 'AALCA',
    codigo: 'RESP_ADM//EVA_ADM',
    xxyyxxx: 'Sa2bU75VZUDSFNSThL5wGDUCOma3K1ppp4mdyUlSsnL56aN7CrnV2UJO/skS22CLFH53Gq1QE1UpnJteBDiCRtd4t37v6KRA96g/hWON0OCJtbaWApm/8FNfrp8GsLwr7dgg0RLJB9PVgh6ZQ3zivbDjjz57ybvlx0g8XFgfGQ='
  }, {
    username: 'AORTEGA',
    codigo: 'EVA_TEC',
    xxyyxxx: '79nsoT8QOWpkZCOy49KNLHKjpHB5clrcTAoE/YJv1LEN56e3Y7zYC59hVYkFSFl0D7KCh0jQXrX119qzKH8DhwNk6VRaLkUMQyLXsh8qxl7pXc/w4y/xwNyqFKQNFYO6e2tESJQYeX//UfHkTx/m8IA2HRa6DyB073lnnzpDpvp/zOOAd8Xuhyp2wxySk5'
  }, {
    username: 'AORTIZ',
    codigo: 'EVA_ADM',
    xxyyxxx: '8l5GaJTvB8D2KdlKdMZJ7ctOiQDEoB/ZnJDfVrxTxuWrCagj61EeFzihjJMB/n4EHHCR8ZyMQZToKSr2S0GgPC89Evtsk2ouwhX8C7Tihhts2gXmvxQ1AAWWZwWkACnxpf2HbDG1UK0h7skfs2i/2QQbtvRkFwCjU4Dykxo='
  }, {
    username: 'CBANDINI',
    codigo: 'APROB-TEC',
    xxyyxxx: 'fL1QfTIWWczOpDXWkqEHbMspq64aIowm6UC9dUNEdU4RbJrVmm/ERb1YGtAzBv7d3usC9xTLAFFdI971pPQu5XTsTrTUt3RH8S30cB3vTdo02lx83zvpJwLP6aTLRjP8x1xfFOrUE3cqSl4cH5nlT35CYsbnObjUpjoyDNzcvJ4UHLLcOUZXmrj8Q0g'
  }, {
    username: 'CBARREDA',
    codigo: 'APROB-TEC',
    xxyyxxx: 'uOAGbR97MIpnmMrnZ0vJLJR61WZxx9o/9Fy5mmAQ2/fUIpZgcn/SxEhsAVXy5VmN65np7xICI2jhl5v2jkfQu5XTsTrTUt3RH8S30cB3vTdo02lx83zvpJwLP6aTL7g9ggYgEn/Z/GSnc0gCawH5nlT35CYsbnObjUpjoyDNzcvJ4UHLLcOUZXmrj8Q0g'
  }, {
    username: 'CBARRENO',
    codigo: 'APROB-TEC',
    xxyyxxx: 'uOAGbR97MIpnmMrnZ0vJLP2FOjCj/mn5J9Z5aP4McgnjmPWKmA2Ccf5rrSCXclVIvKuhLWLVf1BGBUkQ4Ue6s/Qu5XTsTrTUt3RH8S30cB3vTdo02lx83zvpJwLP6aTLB1EkEQaRdYmc1t0YPMCxO35nlT35CYsbnObjUpjoyDNzcvJ4UHLLcOUZXmrj8Q0g'
  }]

  listUsuarioSissged = [{
    username: 'Veronica Garcia',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+Ixchn94XLX1NjIrs7J1spUFhW1zHemYJDtGKdukfg2O5buJQqIyAsxQbriHa6Qm35+7VurLK6u7O5zMBBK2RPq7FjPlzmbqVS2DrnSk7z6mPs5JFYERc2w/SWKkqLmmAIe9NYGlTLrZKb0v7El7u2XmzLEGJX6di+KpXL0oAW+6mk='
  }, {
    username: 'Harold Paucarcaja',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+IxdkhiormowuRRfVNIsdmF5j0IjrTjZMp+b+G1Aidw8fFHVfxQj9Ok5ixGHVGroQIsphR6iIjlW58VJHeU0Lp7+ibOX8p+TL5XzzA2egxdBBJX14ZO5DkpKItNcA7eiQR5rxsFb3CZYegUo6aSHwIaJM/Xor1nAsaRcQAQGdcA0eI='
  }, {
    username: 'Anthony Anguiz',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+IxXMESfiho+Nu9GmBV1Mfnv1vNuYkjNGfBht7FCwgMvbTiIyBfqV3p5iln2GMgtVJWp7wcbpD+IEXGFfvl4Ag30NUX8jyZwjCcpJ9Uomkphe++EfdjYQ25Sy2xl8kuWZuel20H83tBkzpP6DJuMWJDBPkO77t/EkMu5P+xiMZYioc='
  }, {
    username: 'Jorge García',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+IxXMESfiho+Nu9GmBV1Mfnvx3X2Foe9U6umfo6exJgbNniIyBfqV3p5iln2GMgtVJWvi7niDucpGInP32WVtblajQhHmyE3yIWCG2HrSOqI/YfYiTIGOqlyVYAwZp1+6nQvEF1FxgB4hba+lKvhP7X1A=='
  }, {
    username: 'Samantha Mendoza',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+IxcbJBkGYxD6ePV+7xlU7rfwALw0ESBDvLytUB6rM4Sb+BovnpLO18z2Z7pl5ZQdS44zkL5UhqhcYCFM+wSxWmmUdaUwhyCeQp8/fDCeN4q3fio23yOG0kJtP+DpETPOUPzeOIGo+hfhJc3ulfjxqqZjAz7JyF3P6KUbHOZHgJaNo='
  }, {
    username: 'Luis Rosales',
    xxyyxxx: 'ARb3+X2ceVwRds8BVbs2NLo78H5PIMW+DNbceLl3DOA6MRDr7b0GvFS3Lk/aVE2R0GHx/29AP/BDSKufoDxRCjQwhT76De0sOAUpAXYvpEDRLZMR+GaWnI1xxhSk7pr2x8+sQuPIVOBeJfx6IbTiSI6+hvXvEiGgqDvaPUxUwf7iIyBfqV3p5iln2GMgtVJWrtHWEHhAQ2inPU/b7wntYnXB0p/fSBjaqsSd0ZwYv//89YbHm3Z13SbHJKPniRoxfttORHSI36KCeWmE4KFog30T6JKZF/dg0LNYqkIzI/U='
  }, {
    username: 'VOLVO',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUXRd2DlpADDMb3U/VkDsaQMrd8DeaV0rk3Tl9BKVIT/IIm73yi+6gXl2V+s24+mJ4G3qmm2ZyEan+dqDQOGJTqjN+p9enNVK6+9KAeKwP8Wro7igMVYtfs/SCxZnuqN6afjRs3bFr/iewaIzjt7GIi4Xr9mmQGxL1HtAjOEBA9QoXvHifDORbVelFrRDC0pTEw=='
  }, {
    username: 'LUCAS & MORENA',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUXRd2DlpADDMb3U/VkDsaQMrd8DeaV0rk3Tl9BKVIT/IfuWD8Z8TQUVwOJuiHNmAKm3qmm2ZyEan+dqDQOGJTqgwrgavOkGiHcjomtEjBvHkQHa/DetIIX7J76yn2gpqb8spXS9a//8hgFQpJkueNtZkYh37nScFrh+unlL1qFbWNka0Cw5pALH5BgWBt0RKtA=='
  }, {
    username: 'CELSAT PERU',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+Ixchn94XLX1NjIrs7J1spUFnJJyUc6gyYg/GYgCFT/Bw2he8CGMhP90m39qAsA+zzgztB1UpXT65G6dBdl9aVxM6CHqyrhvLC3HcYuVvtKMmAdRMXow39sO37K9QY0mwVUKKdUyJp8wB6gZF6VThiO030T6JKZF/dg0LNYqkIzI/U='
  }, {
    username: 'S4COM',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+Ixchn94XLX1NjIrs7J1spUFgz6hWGhoYYHIjafoDssqud56o276fripxUeI28YiQlt03z11FANISncbjmOlB4A7v0eAlgSAQi4jav9kY2D7VG3ADDSZQp5fsAbkIEmB4Qhu7zUtM3/vkA/W32qCiTYSA=='
  }, {
    username: 'IGOOLT',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+Ixchn94XLX1NjIrs7J1spUFhd+gzDRc0l5s9bvyDvYL6wQpr1cnQX+ffPH1Hd9miDNqetNp2c/k23fZg/k8MjtjwuhZGFUJY3/vpjT9pNyfXrPdLFgi++RJB2/xWfwRXI8qP8zR/8XEkjs+8D7jcuxHw=='
  }, {
    username: 'IGOOLT 222',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEAQEKBtpTKT7ySgtHjaLlypchn94XLX1NjIrs7J1spUFuIjIF+pXenmKWfYYyC1UlYgq1mmO8TKccUEt2rHOiMPy2gFfSSqkdVw3y1Xi+yz+Q1QeqFmwaK7pT7TZzrJ/0GO3uyv9MAgRiUgo3R7miBjcwyUtbYrj90sCF8VhatuiA=='
  }, {
    username: 'BE ONE BUSINESS',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEBTNADEt18ip83O/sXYX+Ixchn94XLX1NjIrs7J1spUFjcgHYj49pbXCpVyc6BceO3p0QYlMdIcgwBacVxMbpdW6Oh/s78PJ43YuVrVCK/WPF5UfprrFJTLgLDkUdu0IdOkEd1dXqzKdEcSFFbHcm/q7B0T1Pb+3ZdafUWJdVFoig=='
  }, {
    username: 'CARLOS TINEO',
    xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEDJ6PO2Kw9eaT8GwnDJH9gOESdpvSjMl5zRP1/cF0bd+29JNTiBCNu4oTCua6SEaopZSbCTj1V1cSNag1lzcYyyMHzKMioWFPgjW85NgU1WayohByZ8DU0Moi2JbfQBlygtCWV8DoGYh4meHUL72V+TFVU1RyoonrjsPwc54PAIg3He5Rz46/edLy84VY0EZhQ='
  // }
  }, {
    username: 'NELSON ALARCON',
    xxyyxxx: 'odDpCfIUkFvLtN2ZVZj+iHef5QHEm5jYXI+3eTWbJKh45kVGlsEWG3ERQ235+ei4YbAZV8O2w90eSTqlDBOeOTQwhT76De0sOAUpAXYvpEBPl/IlfNzwb36fmiCqQ1EIyZiURFrXfw3CFwae9akFpwTvtlvGuBt4NR4UGPXdSc56uEQBt0iseRHqFtrz905SoYiyj6derU6bOo9GJ6hGM5AFGeKxexOTbau94rVE/NQVTpcyn0NzXkhEwwvvj8VQgaL56SztfM9me6ZeWUHUuH0T6JKZF/dg0LNYqkIzI/U='
  }
  ]//, {
    //username: 'RUBIO',
    //xxyyxxx: '2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpECW77o15W+YTIOXb50VpJXbESdpvSjMl5zRP1/cF0bd+70VGQAWn5sW0QpADov5Fv2BovnpLO18z2Z7pl5ZQdS43auz4/51RPl4yCw3tml7yIeIjlno1cfdNN7ZQN+WFkbz+OnSt2T/ZuY64EXX40Fnrw19GpRYLCNiiZkjNUAJfA=='
  //}]

  //https://sicoes.osinergmin.gob.pe/sicoes/#/extranet/login-sunat?xxyyxxx=2+nGD/zXfAdFQMPXDQlygI0LTIdA/iJu8c/tCnh0SrjdYtADKtHz6ysVXzHXxJggA2V/0ONZqUG+5Qsakf+jUTQwhT76De0sOAUpAXYvpEAQEKBtpTKT7ySgtHjaLlypchn94XLX1NjIrs7J1spUFuIjIF+pXenmKWfYYyC1UlYgq1mmO8TKccUEt2rHOiMPy2gFfSSqkdVw3y1Xi+yz+Q1QeqFmwaK7pT7TZzrJ/0GO3uyv9MAgRiUgo3R7miBjcwyUtbYrj90sCF8VhatuiA==&session=994BEDB50EBAE57731D70B1168F759C2

  procesoSeleccion() {
    this.router.navigate([Link.PUBLIC, Link.REGISTRO_PROCESO_SELECCION]);
    // window.open('https://www.osinergmin.gob.pe/seccion/institucional/institucional/procesos-seleccion/presentacion');
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  validateUsuInt(usu): String {
    for (const us of this.listUsuarioIntranet) {
        if (us.username === usu.username) {
            return "Interno";
        }
    }
  }

  validateUsuExt(usu): String {
    for (const us of this.listUsuarioSissged) {
        if (us.username === usu.username) {
            return "Externo";
        }
    }
  }

  sendFake(usu) {
    this.usuarioService.setTipoUser(this.validateUsuExt(usu));
    this.router.navigate([Link.EXTRANET, Link.LOGIN_SUNAT], {
      queryParams: {
        xxyyxxx: usu.xxyyxxx
      }
    });
  }

  sendFakeIntra(usu) {
    this.usuarioService.setTipoUser(this.validateUsuInt(usu));
    this.router.navigate([Link.INTRANET, Link.LOGIN_INTRANET], {
      queryParams: {
        xxyyxxx: usu.xxyyxxx
      }
    });
  }

  abrirTerminos() {
    this.dialog.open(ModalTerminosComponent, {
      disableClose: true,
      width: '800px',
      maxHeight: 'auto',
      data: {
        accion: 'view'
      },
    }).afterClosed().subscribe(result => {

    });

  }

  descargarManualUsuario() {
    this.adjuntoService.downloadFormatoPublico(FormatoLocal.MANUAL_USUARIO, "MANUAL_USUARIO.pdf");
  }

}
