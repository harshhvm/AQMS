import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { DeviceService } from '../../services/device.service';
import { GatewayService } from '../../services/gateway.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import * as Chart from 'chart.js'

@Component({
  selector: 'app-aqanalysis',
  templateUrl: './aqanalysis.component.html',
  styleUrls: ['./aqanalysis.component.css']
})
export class AqanalysisComponent implements OnInit, AfterViewInit {

  constructor(private reportService: ReportService,
    private deviceService: DeviceService,
    private authService: AuthService,
    private gatewayService: GatewayService,
    private router: Router) { }

  CustId: String;
  AqData: Array<aqdata>;
  Gateways: Array<gateway>;
  Devices: Array<device>;
  labelsTime: string[];
  dataSets: Array<Object>;
  avgPPM : Number;
  avgTemp : Number;
  avgHumi : Number;
  // [
  //   { 
  //     data: [12,12,1,5,1,5,5,65,9,41],
  //     borderColor: "#3cba9f",
  //     fill: false
  //   },
  //   { 
  //     data: [55,4,84,21,5,42,1,54,5],
  //     borderColor: "#ffcc00",
  //     fill: false
  //   },
  // ]
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
      var dataPoints = []
      var dataPoints1 = []
      var dataPoints2 = []
      var dataLables = []
      if (data.success) {

        this.AqData = data.msg;
        this.AqData.forEach((rec, indx) => {
          var devObj = this.Devices.filter(dev => dev._id == rec.devId);
          rec["devName"] = "";
          if (devObj.length > 0)
            rec["devName"] = devObj[0].name;
          dataPoints.push(rec.aq);
          dataPoints1.push(rec.hum);
          dataPoints2.push(rec.temp);
          dataLables.push((indx).toString());

        });
        this.labelsTime = dataLables;
        this.dataSets = [{
          data: dataPoints,
          borderColor: "#3cba9f",
          fill: false
        },
        {
          data: dataPoints1,
          borderColor: "#ffcc00",
          fill: false
        },
        {
          data: dataPoints2,
          borderColor: "#3cba9f",
          fill: false
        }]
        var sum = dataPoints.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur), 0);
        console.log(sum)
        this.avgPPM = Math.round(sum/dataPoints.length)
        var sum1 = dataPoints1.reduce((acc, cur) => parseInt(acc) + parseInt(cur), 0);
        this.avgHumi = Math.round(sum1/dataPoints1.length)
        var sum2 = dataPoints2.reduce((acc, cur) => parseInt(acc) + parseInt(cur), 0);
        this.avgTemp = Math.round(sum2/dataPoints2.length)
        console.log(this.dataSets)
        this.drawGrph();
      }
      else
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
  }

  canvas: any;
  ctx: any;
  ngAfterViewInit() {

  }
  drawGrph() {
    console.log("drawGrph");
    console.log(this.dataSets)
    this.canvas = document.getElementById('areaChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.labelsTime,
        datasets: this.dataSets,
      },
      options: {
        responsive: false,
        // display:true
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            afterTickToLabelConversion: function (data) {


              var xLabels = data.ticks;

              xLabels.forEach(function (labels, i) {
                if (i % 2 == 1) {
                  xLabels[i] = '';
                }
              });
            }
          }]
        }
      }
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
  temp: number;
  hum: number;
  timestamp: number;
}

