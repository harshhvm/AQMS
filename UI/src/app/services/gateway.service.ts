import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class GatewayService {

  constructor(private http: Http) { }

  addGateway(cust) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('http://localhost:8080/gateway/', cust, { headers: headers })
      .map(res => res.json())
  }

  getAllGateways(CustId) {
    return this.http
      .get('http://localhost:8080/gateway/byCustId?CustID='+ CustId)
      .map(res => res.json())
  }

  updateGateway(gwObj) {
    console.log("updateGateway");
    console.log(gwObj);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('http://localhost:8080/gateway/', gwObj, { headers: headers })
      .map(res => res.json())
  }

}
