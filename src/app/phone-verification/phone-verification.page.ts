import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import { Directive, Renderer2, ElementRef } from '@angular/core';
import { configService } from '../Service/config.service';

@Directive({
  selector: '[focuser]' // Attribute selector
})
@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationPage implements OnInit {
  wrongCode = false;
  verificationCode;
  otp="";
  constructor(private router: Router, private userService: userService,
    private localStorage: LocalstorageService, private configService: configService) {
    this.verificationCode = {}
  }

  ngOnInit() {
  }
  inputChnage(event,nextInput) {
   if(event.target.value != null){
     nextInput.setFocus();
   }
  }
  verfyOtp(code) {
    var otp = code.o1 + code.o2 + code.o3 + code.o4 + code.o5 + code.o6;
    let body = {
      query: 'mutation verify_otp($data:VerifyOtpInputType!){verify_otp(data:$data){hasError,message,data}}',
      variables: {
        data: {
          phone: this.localStorage.getphonenumber(),
          otp: otp
        }
      }
    }
    this.userService.sendApi(body).subscribe(result => {
      console.log();
      const res = result['data'].verify_otp;
      console.log("Verify Otp : ", res)
      if (!res.hasError) {
        this.router.navigate(['/select-position']);
      } else {
        this.configService.sendTost("danger", "OTP Not Verify", "bottom");
        this.wrongCode = true;
      }
    }, err => {
      console.log("Somthing Went Wrong")
    });
  }
  resend() {
    let body = {
      query: 'mutation send_otp($data:SendOtpInputType!){send_otp(data:$data){hasError,message,userErrors,data}}',
      variables: {
        data: {
          phone: this.localStorage.getphonenumber()
        }
      }
    }
    this.userService.sendApi(body).subscribe(data => {
      const res = data['data'].send_otp;
      if (!res.hasError) {
        this.configService.sendTost("dark", "Otp Resend Successfully", "bottom");
      }
    }, err => {
      console.log("Somthing Went Wrong")
    });
  }
  confirm(otp) {
    if (!this.verificationCode.o1 || !this.verificationCode.o2 || !this.verificationCode.o3 ||
      !this.verificationCode.o4 || !this.verificationCode.o5 || !this.verificationCode.o6) {
      this.wrongCode = true;
    }
    else {
      this.verfyOtp(otp);
      this.router.navigate(['/select-position']);
    }
  }
}
