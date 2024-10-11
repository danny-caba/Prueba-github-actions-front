import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';

import { TokenStorageService } from '../../core/services';
import { AuthService } from '../auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      exhaustMap(credentials =>
        this.authService.login(credentials.username, credentials.password).pipe(
          map(data => {
            // save tokens
            this.tokenStorageService.saveTokens(data.access_token, data.refresh_token);
            // trigger login success action
            return AuthActions.loginSuccess();
          }),
          catchError(error => of(AuthActions.loginFailure({ error })))
        )
      )
    );
  });

  onLoginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => {
        // redirect to return url or home
        this.router.navigateByUrl(
          this.activatedRoute.snapshot.queryParams.returnUrl || '/extranet/solicitudes'
        );
        return AuthActions.getAuthUserRequest();
      })
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() => {
          this.router.navigateByUrl('/');
          return this.authService
            .logout()
            .pipe(finalize(() => this.tokenStorageService.removeTokens()));
        })
      );
    },
    { dispatch: false }
  );

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.refreshTokenSuccess, AuthActions.getAuthUserRequest, AuthActions.checkTokenSuccess),
      exhaustMap(() =>
        this.authService.getAuthUser().pipe(
          map(user => AuthActions.getAuthUserSuccess({ user })),
          catchError(() => of(AuthActions.getAuthUserFailure()))
        )
      )
    );
  });

  refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.refreshTokenRequest),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map(data => {
            // save tokens
            this.tokenStorageService.saveTokens(data.access_token, data.refresh_token);
            // trigger refresh token success action
            return AuthActions.refreshTokenSuccess();
          }),
          catchError(() => of(AuthActions.refreshTokenFailure()))
        )
      )
    );
  });

  checkToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.checkTokenRequest),
      exhaustMap(() =>
        this.authService.ckeckToken().pipe(
          map(data => {
            // save tokens
            //this.tokenStorageService.saveTokens(data.access_token, data.refresh_token);
            // trigger refresh token success action
            if(data.active){
              //return AuthActions.getAuthUserSuccess;
            }
            return AuthActions.checkTokenSuccess();
          }),
          catchError(() => of(AuthActions.checkTokenFailure()))
        )
      )
    );
  });

  onCheckTokenFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.checkTokenFailure),
        tap((error) => {
          this.tokenStorageService.removeTokens();
        })
      );
    },
    { dispatch: false }
  );

  onLoginOrRefreshTokenFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(() => {
          this.tokenStorageService.removeTokens();
        })
      );
    },
    { dispatch: false }
  );

  onRefreshTokenFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.refreshTokenFailure),
        tap(() => {
          this.tokenStorageService.removeTokens();
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService
  ) {}
}
