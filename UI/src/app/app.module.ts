import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { FlashMessagesModule } from 'angular2-flash-messages';

import { AgmCoreModule } from '@agm/core';
// import { Ng4AlertModule } from 'ng4-alert';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
// import { AlertComponent } from './components/alert/alert.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { GatewayComponent } from './components/gateway/gateway.component';
import { DeviceComponent } from './components/device/device.component';
import { GmapComponent } from './components/gmap/gmap.component';
import { AqdComponent } from './components/aqd/aqd.component';
import { HealthComponent } from './components/health/health.component';
import { AqanalysisComponent } from './components/aqanalysis/aqanalysis.component';

import { AuthService } from './services/auth.service';
import { RegisterService } from './services/register.service';
import { GatewayService } from './services/gateway.service';
import { DeviceService } from './services/device.service';
import { ReportService } from './services/report.service';




// import { AlertService } from './services/alert.service';


const appRoute = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gateway', component: GatewayComponent },
  { path: 'device', component: DeviceComponent },
  { path: 'aqd', component: AqdComponent },
  { path: 'health', component: HealthComponent },
  { path: 'aqanalysis', component: AqanalysisComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    TopbarComponent,
    GatewayComponent,
    DeviceComponent,
    GmapComponent,
    AqdComponent,
    HealthComponent,
    AqanalysisComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpModule, CommonModule,
    RouterModule.forRoot(appRoute),
    FlashMessagesModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBMRBw6oWxwKwO2b8Y5qUoIjQAlKz_UDxg'
    })
    // Ng4AlertModule.forRoot()
  ],
  providers: [AuthService, RegisterService, GatewayService, DeviceService,ReportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
