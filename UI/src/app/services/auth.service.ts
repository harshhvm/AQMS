import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  login(cust) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('http://localhost:8080/customer/login', cust, { headers: headers })
      .map(res => res.json())
  }

  storeUserData(user){
    localStorage.setItem('user',JSON.stringify(user));
  }

  getStoredUser(){
    return JSON.parse(localStorage.getItem('user'));
  }

  isLoggedIn(){
    if(this.getStoredUser())
      return true;
    else
      return false;
  }

  logout(){
    localStorage.clear()
  }

}
