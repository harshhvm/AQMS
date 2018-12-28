import { Component, OnInit } from '@angular/core';
import { GatewayService } from '../../services/gateway.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.css']
})
export class GatewayComponent implements OnInit {

  constructor(private gatewayService: GatewayService,
    private authService: AuthService,
    private router: Router) { }

  CustId: String;
  Gateways: Array<Object>;
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
  }
  gwname: String;
  longitude: Number;
  latitude: Number;
  gatewayid: Number;
  edgw_id : Number;
  edgwname: String;
  edlongitude: Number;
  edlatitude: Number;
  edgatewayid: Number;
  addGateway() {
    let cust = {
      name: this.gwname,
      longitude: this.longitude,
      latitude: this.latitude,
      gwId: this.gatewayid,
      custId: this.CustId
    }
    this.gatewayService.addGateway(cust).subscribe((data) => {
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

  openEditGateway(gwObj){
    console.log(gwObj);
    this.edgw_id = gwObj._id;
    this.edgwname = gwObj.name;
    this.edlongitude = gwObj.longitude;
    this.edlatitude = gwObj.latitude;
    this.edgatewayid = gwObj.gwId;
    $("#editGateway").modal('show');
  }

  editGateway(){
    let gw = {
      _id : this.edgw_id,
      name: this.edgwname,
      longitude: this.edlongitude,
      latitude: this.edlatitude,
      gwId: this.edgatewayid,
      custId: this.CustId
    }
    
    this.gatewayService.updateGateway(gw).subscribe((data) => {
      if (data.success) {
        $("#editGateway").modal('hide');
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
