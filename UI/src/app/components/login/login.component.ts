import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'AQMS';

  constructor(private authService:AuthService,
    private _flashMessagesService: FlashMessagesService,
    private router:Router) { }

  ngOnInit() {
    $("#warapperDiv").css({"background-color": "#d2d6de"});
    if(this.authService.isLoggedIn())
      this.router.navigate(['/dashboard']);
  }

  emailid : String;
  password: String;
  OnLoginClick() {
    console.log(this.emailid, this.password);
    let cust = {
      emailid: this.emailid,
      password: this.password
    }
    this.authService.login(cust).subscribe((data) => {
      console.log(data);
      if (data.success)
      {
        // this.ng4AlertService.ng4Activate(this.options);
        this.authService.storeUserData(data.msg);
        this.router.navigate(['/dashboard']);
      }
      else 
      {
        this._flashMessagesService.show("Email and Password doesn't match", { cssClass: 'alert-error', timeout: 2000 });
        console.log(data.msg);
      }
        
    },
      err => {
        console.log(err);
      });
  }

}
