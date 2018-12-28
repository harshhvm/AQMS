import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService,
    private _flashMessagesService: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn())
      this.router.navigate(['/login']);
    else {
      this.router.navigate(['/dashboard']);
    }
    this._flashMessagesService.show('Welcome', { cssClass: 'alert-success', timeout: 1000 });
  }


}
