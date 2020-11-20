import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationPage implements OnInit {
  wrongCode=false;
  constructor(private router:Router) { }

  ngOnInit() {
  }
  inputChnage(){
    this.wrongCode=true;
  }
  resend(){

  }
  confirm(){
    this.router.navigate(['/select-position']);
  }
}
