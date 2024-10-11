import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError, delay } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingDialogService } from 'src/helpers/loading';
import Swal from 'sweetalert2';

import { TokenStorageService } from '../../core/services';
import { AuthFacade } from '../store/auth.facade';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authFacade: AuthFacade,
    private tokenStorageService: TokenStorageService,
    private loadingDialogService: LoadingDialogService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenStorageService.getAccessToken();
    
    this.loadingDialogService.setLoading(true, req.url);
    this.listenToLoading();

    if (accessToken && (!req.url.includes("oauth/token") && !req.url.includes("oauth/check_token"))
          && !req.url.includes("listado-publico")
          && !req.url.includes("usuarios/publico")
        ) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
        // !Attention: it used only at Fake API, remove it in real app
        // params: req.params.set('auth-token', accessToken),
      });
    }

    return next.handle(req).pipe(
      s => this.handleErrors(s, req.url), 
      finalize(() => this.loadingDialogService.setLoading(false, req.url)));
  }

  private handleErrors(
    source: Observable<HttpEvent<unknown>>,
    urlPath: string
  ): Observable<HttpEvent<unknown>> {
    return source.pipe(
      catchError((error: HttpErrorResponse) => {
        this.loadingDialogService.setLoading(false, urlPath);

        // try to avoid errors on logout
        // therefore we check the url path of '/auth/'
        if (error.status === 401) {
          if(error?.error && error?.error.error_description.includes("Access token expired")){
            return this.refresh();
          }else{
            return this.handle401();
          }
        }

        if(error.status === 400 && error.error?.errorCode === 'V00507'){
          if(error.error?.uri.includes("/sicoes-api/oauth/token")){
            //return this.handle401();
            this.mostarError(error);
            this.router.navigateByUrl('/');
          }else{
            return this.refresh();
          }
        }

        if(error.status < 200 || error.status > 300 ){
          this.mostarError(error)
        }
        
        // rethrow error
        return throwError(() => error);
      })
    )
  }

  private mostarError(error){
    if(!error?.error?.errorCode && !error?.error?.errorCode){
      return;
    }
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 8000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: error.error.errorCode + ': ' + error.error.errorMessage,
      background: '#f27474',
      iconColor: 'white',
      color: 'white'
    })
  }

  private refresh() {
    this.authFacade.refresh();
    return EMPTY;
  }

  private handle401() {
    this.authFacade.logout();
    return EMPTY;
  }

  listenToLoading(): void {
    this.loadingDialogService.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        if(loading){
            this.loadingDialogService.openDialog();
        }else{
            this.loadingDialogService.hideDialog();
        }
      });
}
}
