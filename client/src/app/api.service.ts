import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

import { SERVER_URL } from '@client/env';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected url = SERVER_URL;

  constructor(
    protected http: HttpClient,
  ) { }

}
