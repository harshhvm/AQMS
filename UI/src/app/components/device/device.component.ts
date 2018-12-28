import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { GatewayService } from '../../services/gateway.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  constructor(private deviceService: DeviceService,
    private gatewayService: GatewayService,
    private authService: AuthService,
    private router: Router) { }

  CustId: String;
  Gateways: Array<gateway>;
  Devices: Array<device>;
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
        this.Devices.forEach(dev => {
          var gwObj = this.Gateways.filter(gw => gw._id == dev.gwId);
          dev["gwName"] = "";
          if (gwObj.length > 0)
            dev["gwName"] = gwObj[0].name;
        });
        console.log(this.Devices);

      }
      else
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
  }
  devname: String;
  longitude: Number;
  latitude: Number;
  gatewayid: String;
  gwname: String;
  devid: String;
  eddev_id: String;
  eddevname: String;
  edlongitude: Number;
  edlatitude: Number;
  edgatewayid: String;
  eddevid: String;

  addDevice() {
    var dev = {
      name: this.devname,
      longitude: this.longitude,
      latitude: this.latitude,
      custId: this.CustId,
      devId: this.devid
    }
    if (this.gatewayid)
      dev["gwId"] = this.gatewayid
    this.deviceService.addDevice(dev).subscribe((data) => {
      if (data.success) {
        $("#myModal").modal('hide');
        this.ngOnInit();
      }
      else
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
  }

  openEditDevice(devObj) {
    this.eddev_id = devObj._id;
    this.eddevname = devObj.name;
    this.edlongitude = devObj.longitude;
    this.edlatitude = devObj.latitude;
    this.edgatewayid = devObj.gwId;
    this.eddevid = devObj.devId;
    $("#updateDevice").modal('show');
  }

  updateDevice() {
    let dev = {
      _id: this.eddev_id,
      name: this.eddevname,
      longitude: this.edlongitude,
      latitude: this.edlatitude,
      gwId: this.edgatewayid,
      devId: this.eddevid,
      custId: this.CustId
    }

    this.deviceService.updateDevice(dev).subscribe((data) => {
      if (data.success) {
        $("#updateDevice").modal('hide');
        this.ngOnInit();
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