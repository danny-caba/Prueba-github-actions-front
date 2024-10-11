import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, finalize, map } from 'rxjs/operators';
import { LoadingDialogService } from 'src/helpers/loading';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(
        private loadingDialogService: LoadingDialogService) {
            this.listenToLoading();
        }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingDialogService.setLoading(true, request.url);
        
        
        return next.handle(request)
        .pipe(
            catchError(err => {
                const error = (err && err.error && err.error.message) || err.statusText;
                this.loadingDialogService.setLoading(false, request.url);
                console.error(err);
                return throwError(error);
            }),
            finalize(() => this.loadingDialogService.setLoading(false, request.url))
        )
        .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
            if (evt instanceof HttpResponse) {
              this.loadingDialogService.setLoading(false, request.url);
            }
            return evt;
        }));
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