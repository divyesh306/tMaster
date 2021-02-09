import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(public router: Router, private iab: InAppBrowser) { }

  ngOnInit() {
  }

  openTerms() {
    const browser = this.iab.create('https://tokmay.com/termsandconditions/');
    browser.executeScript;
  }

  blockList() {
    this.router.navigate(['/blocklist']);
  }
  selectLanguages() {
    this.router.navigate(['/language']);
  }
  bugReport() {
    this.router.navigate(['/bugreport']);
  }
  deleteAccount() {
    this.router.navigate(['/delete-account']);
  }
}
