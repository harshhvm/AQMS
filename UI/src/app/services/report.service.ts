import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class ReportService {

  constructor(private http: Http) { }

  getAllDataByCustId(CustId) {
    return this.http
      .get('http://localhost:8080/report/byCustId?CustID='+ CustId)
      .map(res => res.json())
  }

  getCurrentStatus(DevId) {
    return this.http
      .get('http://localhost:8080/report/byDevId?DevID='+ DevId)
      .map(res => res.json())
  }

  getAllHealthDataByCustId(CustId) {
    return this.http
      .get('http://localhost:8080/health/byCustId?CustID='+ CustId)
      .map(res => res.json())
  }

}
