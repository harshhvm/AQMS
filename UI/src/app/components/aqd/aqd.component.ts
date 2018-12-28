import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { DeviceService } from '../../services/device.service';
import { GatewayService } from '../../services/gateway.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aqd',
  templateUrl: './aqd.component.html',
  styleUrls: ['./aqd.component.css']
})
export class AqdComponent implements OnInit {

  constructor(private reportService: ReportService,
    private deviceService: DeviceService,
    private authService: AuthService,
    private gatewayService: GatewayService,
    private router: Router) { }


  CustId: String;
  AqData: Array<aqdata>;
  Gateways: Array<gateway>;
  Devices: Array<device>;
  ngOnInit() {
    var cust = this.authService.getStoredUser();
    this.CustId = cust._id;
    this.deviceService.getAllDevices(this.CustId).subscribe((data) => {
      if (data.success) {
        this.Devices = data.msg;
      }
      else
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
    this.reportService.getAllDataByCustId(this.CustId).subscribe((data) => {
      if (data.success) {
        this.AqData = data.msg;
        this.AqData.forEach(rec => {
          var devObj = this.Devices.filter(dev => dev._id == rec.devId);
          rec["devName"] = "";
          if (devObj.length > 0)
          rec["devName"] = devObj[0].name;
        });
      }
      else
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
  }

}


interface gateway {
  _id: string;
  name: string;
  longitude: any;
  latitude: any;
  gwId: string;
  custId: string;
  Key: string;
}

interface device {
  _id: string;
  name: string;
  longitude: any;
  latitude: any;
  gwId: string;
  custId: string;
  devId: string;
  Key: string;
}

interface aqdata {
  _id: string;
  devName: string;
  custId: string;
  devId: string;
  aq: number;
  temp : number;
  hum : number;
  timestamp : number;
}