import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SERVER_URL } from '@client/env';

import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected url = SERVER_URL;

  constructor(
    protected http: HttpClient,
  ) { }
}
