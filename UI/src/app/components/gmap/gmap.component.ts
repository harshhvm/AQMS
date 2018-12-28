import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { GatewayService } from '../../services/gateway.service';
import { AuthService } from '../../services/auth.service';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { log } from 'util';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  constructor(private deviceService: DeviceService,
    private gatewayService: GatewayService,
    private authService: AuthService,
    private reportService: ReportService,
    private router: Router) { }


  CustId: String;
  Gateways: Array<Object>;
  Devices: Array<device>;
  DevMarkers: Array<marker>;
  Test: Array<Object>;

  ngOnInit() {
    var cust = this.authService.getStoredUser();
    this.CustId = cust._id;
    this.gatewayService.getAllGateways(this.CustId).subscribe((data) => {
      if (data.success) {
        this.Gateways = data.msg;
      }
      else
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
    this.deviceService.getAllDevices(this.CustId).subscribe((data) => {
      if (data.success) {
        this.Devices = data.msg;
        var temp = [];
        this.Devices.forEach(dev => {
          this.reportService.getCurrentStatus(dev._id).subscribe((cData) => {
            if (cData.success){
              var d = {
                lat: parseFloat(dev.latitude),
                lng: parseFloat(dev.longitude),
                label: dev.name,
                draggable: false,
                temp: 'NA',
                humi: 'NA',
                ppm: 'NA'
              }
              if ((cData.msg).length > 0)
              {
                d['temp'] = cData.msg[0].temp;
                d['humi'] = cData.msg[0].hum;
                d['ppm'] = cData.msg[0].aq;
              }
              temp.push(d);
            }
            else
              console.log(cData.msg);
          },
            err => {
              console.log(err);
            }
          );
        });
        this.DevMarkers = temp;
      }
      else
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
  }

  zoom: number = 12;

  title: string = 'Air Quality Data';
  lat: number = 18.5348706;
  lng: number = 73.8110101;
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
  temp: number;
  humi: number;
  ppm: number;
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
