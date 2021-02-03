import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx'
import { LoadingService } from '../Service/loading.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationPage implements OnInit {
  @ViewChild('otp1') myinput;
  private focused: boolean;
  wrongCode = false;
  verificationCode;
  otp = "";
  public smsTextmessage: string = '';
  public appHashString: string = '';
  constructor(private router: Router,
    private userService: userService,
    private loading: LoadingService,
    private localStorage: LocalstorageService,
    private configService: configService,
    private smsRetriever: SmsRetriever,
    private keyboard: Keyboard,
    public navCtrl: NavController,
    public elRef: ElementRef) {
    this.verificationCode = {}
  }

  ngOnInit() {
    this.getHashCode();
    this.focused = true;
  }

  getHashCode() {
    this.smsRetriever.getAppHash()
      .then((res: any) => {
        this.appHashString = res;
      })
      .catch((error: any) => console.error(error));
  }

  inputChnage(event, nextInput, prvInput) {
    if (!event.target.value || event.target.value.trim().length === 0 || event.target.value != null) {
      if (event.keyCode == 8) {
        prvInput.setFocus();
        prvInput.value = null;
      }
      else {
        nextInput.setFocus();
      }
    }
  }

  ionViewDidEnter() {
    this.myinput.setFocus();
    this.keyboard.show()
  }

  verfyOtp(code) {
    var otp = code.o1 + code.o2 + code.o3 + code.o4 + code.o5 + code.o6;
    const mutation = {
      name: 'verify_otp',
      inputtype: 'VerifyOtpInputType',
      data: {
        phone: this.localStorage.getsingel('phonenumber'),
        otp: otp
      }
    }
    this.loading.present();
    this.userService.sendApi(mutation).subscribe(result => {
      const res = result['data'].verify_otp;
      this.loading.dismiss();
      if (!res.hasError) {
        if (res.data['is_register']) {
          this.localStorage.setsingel('loginToken', res.data['token']);
          this.localStorage.set('userDetail', res.data['user']);
          if (this.localStorage.getsingel('loginToken'))
            this.router.navigate(['/tabs/hangout']);
        }
        else {
          this.router.navigate(['/select-position']);
        }
      } else {
        this.configService.sendToast("danger", "OTP Not Verify", "bottom");
        this.wrongCode = true;
      }
    }, err => {
      this.loading.dismiss();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

  resend() {
    const mutation = {
      name: 'send_otp',
      inputtype: 'SendOtpInputType',
      data: {
        phone: this.localStorage.getsingel('phonenumber')
      }
    }
    this.loading.present();
    this.userService.sendApi(mutation).subscribe(data => {
      const res = data['data'].send_otp;
      this.loading.dismiss();
      if (!res.hasError) {
        this.configService.sendToast("dark", "Otp Resend Successfully", "bottom");
      }
    }, err => {
      this.loading.dismiss();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
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
