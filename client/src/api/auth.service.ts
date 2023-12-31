import { Injectable } from '@angular/core';
import { AuthDTO, Tokens } from '@shared/types';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { pipe, tap } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {

  constructor(
    http: HttpClient,
    private sessionService: SessionService,
    ) {
    super(http)
  }

  public signUp(user: AuthDTO) {
    console.log(`[CLIENT/USERSERVICE] sent signup request for User ${user} to server`);
    return this.http.post<Tokens>(`${this.url}/auth/local/signup`, user)
      .pipe(
        tap((t: Tokens) => {
          this.sessionService.createSession(user, t)
        })
      )
  }

  public signIn(user: AuthDTO) {
    console.log(`[CLIENT/USERSERVICE] sent signin request for User ${user} to server`);
    return this.http.post<Tokens>(`${this.url}/auth/local/signin`, user)
      .pipe(
        tap((t: Tokens) => {
          this.sessionService.createSession(user, t)
        })
      );
  }
}
