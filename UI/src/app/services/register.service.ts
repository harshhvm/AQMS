import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class RegisterService {

  constructor(private http: Http) { }

  register(cust) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('http://localhost:8080/customer/', cust, { headers: headers })
      .map(res => res.json())
  }
}
