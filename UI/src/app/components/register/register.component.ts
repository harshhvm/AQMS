import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
// import { Ng4AlertService } from 'ng4-alert';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title = "AQMS";

  options = {
    text: "Success !",
    type: "fail",
    autoDismis: false,
    timeout: 2000
  }
  constructor(private regService: RegisterService,
    private router:Router
    //  private ng4AlertService: Ng4AlertService
    ) { }

  ngOnInit() {
    $("#warapperDiv").css({"background-color": "#d2d6de"});
  }
  name: String;
  username: String;
  password: String;
  mobno: Number;
  OnRegisterClick() {
    console.log(this.name, this.username, this.password, this.mobno);
    let cust = {
      name: this.name,
      emailid: this.username,
      password: this.password,
      mobno: this.mobno
    }
    this.regService.register(cust).subscribe((data) => {
      console.log(data);
      if (data.success)
      {
        // this.ng4AlertService.ng4Activate(this.options);
        // this.authService.storeUserData(data.msg);
        this.router.navigate(['/login']);
      }
      else 
        console.log(data.msg);
    },
      err => {
        console.log(err);
      });
  }

}
