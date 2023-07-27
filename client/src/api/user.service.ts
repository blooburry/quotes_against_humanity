import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Tokens } from '@shared/types';

import { User } from '../common/types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService{

  constructor(http: HttpClient){
    super(http)
  }

  public signUp(user: User) {
    console.log(`[CLIENT/USERSERVICE] sent signup request for User ${user} to server`);
    return this.http.post<Tokens>(`${this.url}/auth/local/signup`, user);
  }

  public signIn(user: User) {
    console.log(`[CLIENT/USERSERVICE] sent signin request for User ${user} to server`);
    return this.http.post<Tokens>(`${this.url}/auth/local/signin`, user)
  }

  public getUserById(id: number) {
    return this.http.get<User>(`${this.url}/users/${id}`)
  }

  public checkIfUsernameExists(username: string) {
    return this.http.get<{ exists: boolean }>(`${this.url}/users/check-username`, 
    {
      params: {username},
    });
  }
}
