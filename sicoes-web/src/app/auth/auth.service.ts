import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, Observable, of, throwError } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ConfigService, TokenStorageService } from '../core/services';
import * as AuthActions from './store/auth.actions';
import { AuthState, AuthUser, TokenStatus } from './store/auth.models';
import * as AuthSelectors from './store/auth.selectors';

export interface AccessData {
  token_type: 'Bearer';
  expiresIn: number;
  access_token: string;
  refresh_token: string;
  active: boolean;
}

@Injectable()
export class AuthService {
  private hostUrl: string;
  private hostOath: string;
  private app: string;
  private key: string;
  private credenciales: string;

  constructor(
    private store: Store,
    private http: HttpClient,
    private configService: ConfigService,
    private tokenStorageService: TokenStorageService
  ) {
    this.hostUrl = this.configService.getAPIUrl();
    this.hostOath = this.configService.getAPIOauth();
    const authConfig = this.configService.getAuthSettings();

    this.credenciales = authConfig.clientConsumer;
  }

  /**
   * Returns a promise that waits until
   * refresh token and get auth user
   *
   * @returns {Promise<AuthState>}
   */
  init(): Promise<AuthState> {

    this.store.dispatch(AuthActions.checkTokenRequest());
    //this.store.dispatch(AuthActions.refreshTokenRequest());

    const authState$ = this.store.select(AuthSelectors.selectAuth).pipe(
      filter(
        auth =>
          auth.refreshTokenStatus === TokenStatus.INVALID ||
          (auth.refreshTokenStatus === TokenStatus.VALID && !!auth.user)
      ),
      take(1)
    );

    return lastValueFrom(authState$);
  }

  ckeckToken(): Observable<AccessData> {

    const accessToken = this.tokenStorageService.getAccessToken();
    if (!accessToken) {
      return throwError(() => new Error('Access token does not exist')); 
    }

    let urlEndpoind = this.hostOath + '/oauth/check_token';
    //let credenciales = btoa(`${this.app}:${this.key}`);
    const httpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + this.credenciales
    });

    urlEndpoind = urlEndpoind + '?token=' + accessToken;

    return this.http.get<any>(urlEndpoind, { headers: httpHeaders});
}

  /**
   * Performs a request with user credentials
   * in order to get auth tokens
   *
   * @param {string} username
   * @param {string} password
   * @returns Observable<AccessData>
   */
  login(email: string, password: string): Observable<AccessData> {
    //let credenciales = btoa(`${this.app}:${this.key}`);
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + this.credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', email);
    params.set('password', password);

    return this.http.post<AccessData>(`${this.hostOath}/oauth/token`, params.toString(), { headers: httpHeaders });
  }

  /**
   * Performs a request for logout authenticated user
   *
   * @param {('all' | 'allButCurrent' | 'current')} [clients='current']
   * @returns Observable<void>
   */
  logout(): Observable<void> {
    return this.http.get<void>(`${this.hostUrl}/oauth/logout`);
  }

  /**
   * Asks for a new access token given
   * the stored refresh token
   *
   * @returns {Observable<AccessData>}
   */
  refreshToken(): Observable<AccessData> {
    const refreshToken = this.tokenStorageService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token does not exist'));
    }

    let urlEndpoind = this.hostOath + '/oauth/token';
    //let credenciales = btoa(`${this.app}:${this.key}`);
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + this.credenciales
    });
        
    let params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);

    return this.http.post<AccessData>(urlEndpoind, params.toString(), { headers: httpHeaders });
  }

  /**
   * Returns authenticated user
   * based on saved access token
   *
   * @returns {Observable<AuthUser>}
   */
  getAuthUser(): Observable<AuthUser> {
    const accessToken = this.tokenStorageService.getAccessToken();
    if (!accessToken) {
      return throwError(() => new Error('Refresh token does not exist'));
    }
    return this.http.get<AuthUser>(`${this.hostOath}/api/usuarios/perfil`);
  }
}

export const authServiceInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService) => () => authService.init(),
  deps: [AuthService],
  multi: true,
};
