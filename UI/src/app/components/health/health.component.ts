import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { DeviceService } from '../../services/device.service';
import { GatewayService } from '../../services/gateway.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {


  constructor(private reportService: ReportService,
    private deviceService: DeviceService,
    private authService: AuthService,
    private gatewayService: GatewayService,
    private router: Router) { }


  CustId: String;
  HealthData: Array<healthdata>;
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
    this.reportService.getAllHealthDataByCustId(this.CustId).subscribe((data) => {
      if (data.success) {
        this.HealthData = data.msg;
        this.HealthData.forEach(rec => {
          var devObj = this.Devices.filter(dev => dev._id == rec.devId);
          rec["devName"] = "";
          if (devObj.length > 0)
          rec["devName"] = devObj[0].name;
          rec["rss"] = Math.min(Math.max(2 * (rec["rss"] + 100), 0), 100)
          var dt = new Date(Math.round(rec["timestamp"]/1000));
          rec["datetime"] = dt.toLocaleString();
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

interface healthdata {
  _id: string;
  devName: string;
  custId: string;
  devId: string;
  rss: number;
  heap : number;
  vcc : number;
  timestamp : number;
  datetime : string;
}