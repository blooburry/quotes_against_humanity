import { Injectable } from '@angular/core';
import { Tokens } from '@shared/types';
import { User } from 'common/types';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private FIFTEEN_MINUTES = 15 * 60 * 1000; // in milliseconds

  constructor() { }

  public createSession(user: User, tokens: Tokens) {
    const now = Date.now();
    const session = {
      username: user.username,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiry: new Date(now + this.FIFTEEN_MINUTES),
    };
    localStorage.setItem('session', JSON.stringify(session));
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('session');
  }

  get username(): string {
    const session = JSON.parse(localStorage.getItem('session')!);
    return session.username;
  }

  // TODO: request new access token when expiry date nears
}
