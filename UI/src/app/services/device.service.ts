import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class DeviceService {

  constructor(private http: Http) { }

  getAllDevices(CustId) {
    return this.http
      .get('http://localhost:8080/device/byCustId?CustID='+ CustId)
      .map(res => res.json())
  }

  addDevice(dev) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post('http://localhost:8080/device/', dev, { headers: headers })
      .map(res => res.json())
  }

  updateDevice(devObj) {
    console.log("updateDevice");
    console.log(devObj);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .put('http://localhost:8080/device/', devObj, { headers: headers })
      .map(res => res.json())
  }

  

}
