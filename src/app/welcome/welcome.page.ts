import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalstorageService } from '../Service/localstorage.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private router: Router, private localStorage: LocalstorageService,private iab: InAppBrowser) {
  
    const userdetail = this.localStorage.get("userDetail");
  }

  ngOnInit() {
  }
  
  openService() {
    const browser = this.iab.create('https://tokmay.com/termsandconditions/');
    browser.executeScript;
  }

  accept() {
    this.router.navigate(['/verify-number']);
  }
}