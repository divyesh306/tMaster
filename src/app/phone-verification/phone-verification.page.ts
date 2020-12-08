import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
// import { Directive, Renderer2, ElementRef } from '@angular/core';
import { configService } from '../Service/config.service';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx'

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationPage implements OnInit {
  wrongCode = false;
  verificationCode;
  otp = "";
  public smsTextmessage: string = '';
  public appHashString: string = '';
  constructor(private router: Router, private userService: userService,
    private localStorage: LocalstorageService, private configService: configService, private smsRetriever: SmsRetriever) {
    this.verificationCode = {}
  }

  ngOnInit() {
    this.getHashCode()
  }

  getHashCode() {
    this.smsRetriever.getAppHash()
      .then((res: any) => {
        this.appHashString = res;
        console.log(res);
      })
      .catch((error: any) => console.error(error));
  }

  getSMS() {
    this.smsRetriever.startWatching()
      .then((res: any) => {
        this.smsTextmessage = res.Message;
        console.log(res);
      })
      .catch((error: any) => console.error(error));
  }
  inputChnage(event, nextInput, prvInput) {
    if (event.target.value != null) {
      if (event.keyCode == 8) {
        prvInput.setFocus();
        prvInput.value = null;
      }
      else {
        nextInput.setFocus();
      }
    }
  }

  verfyOtp(code) {
    var otp = code.o1 + code.o2 + code.o3 + code.o4 + code.o5 + code.o6;
    const mutation = {
      name: 'verify_otp',
      inputtype: 'VerifyOtpInputType',
      data: {
        phone: this.localStorage.getphonenumber(),
        otp: otp
      }
    }
    this.userService.sendApi(mutation).subscribe(result => {
      console.log();
      const res = result['data'].verify_otp;
      console.log("Verify Otp : ", res)
      if (!res.hasError) {
        if (res.data['is_register']) {
          this.router.navigate(['/tabs/hangout']);
          const token = res.data['token'];
          const user = res.data['user'];
        }
        else {
          this.router.navigate(['/select-position']);
        }
      } else {
        this.configService.sendToast("danger", "OTP Not Verify", "bottom");
        this.wrongCode = true;
      }
    }, err => {
      // console.log("Somthing Went Wrong",err)
      alert(err.message);
    });
  }
  resend() {
    const mutation = {
      name: 'send_otp',
      inputtype: 'SendOtpInputType',
      data: {
        phone: this.localStorage.getphonenumber()
      }
    }
    this.userService.sendApi(mutation).subscribe(data => {
      const res = data['data'].send_otp;
      if (!res.hasError) {
        this.configService.sendToast("dark", "Otp Resend Successfully", "bottom");
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
    }
  }
}
