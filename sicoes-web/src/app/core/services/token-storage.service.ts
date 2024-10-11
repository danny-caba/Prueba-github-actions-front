import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private accessTokenKey: string;
  private refreshTokenKey: string;

  constructor(
    private configService: ConfigService,
    private localStorageService: LocalStorageService
  ) {
    const authSettings = this.configService.getAuthSettings();
    this.accessTokenKey = 'accessToken';
    this.refreshTokenKey = 'refreshToken';
  }

  getAccessToken(): string {
    return this.localStorageService.getItem(this.accessTokenKey) as string;
  }

  saveAccessToken(token: string) {
    this.localStorageService.setItem(this.accessTokenKey, token);
  }

  getRefreshToken(): string {
    return this.localStorageService.getItem(this.refreshTokenKey) as string;
  }

  saveRefreshToken(token: string) {
    this.localStorageService.setItem(this.refreshTokenKey, token);
  }

  saveTokens(idToken: string, refreshToken: string) {
    this.saveAccessToken(idToken);
    this.saveRefreshToken(refreshToken);
  }

  removeTokens() {
    this.localStorageService.removeItem(this.accessTokenKey);
    this.localStorageService.removeItem(this.refreshTokenKey);
  }
}
