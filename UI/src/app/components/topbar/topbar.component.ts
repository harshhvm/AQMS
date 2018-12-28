import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) { }

  CustName : String;
  ngOnInit() {
    var cust = this.authService.getStoredUser();
    this.CustName = cust.name;
  }

  OnLogoutClick(){
    console.log("LogOut");
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
