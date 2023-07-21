import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService{

  constructor(http: HttpClient){
    super(http)
  }

  public signUp(user: User) {
    return this.http.post<User>(`${this.url}/signup`, user);
  }

  public getUserById(id: number) {
    return this.http.get<User>(`${this.url}/users/${id}`)
  }

  public checkIfUsernameExists(username: string) {
    return this.http.get<{ exists: boolean }>(`${this.url}/users/check-username`, 
    {
      params: {username},
    })
  }
}
