import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalstorageService } from './Service/localstorage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,private router: Router, private localStorage: LocalstorageService
  ) {
    if (this.localStorage.getsingel('loginToken')) {
      this.router.navigate(['/tabs/hangout']);
    }
    else {
      this.router.navigate(['']);
    }
    if (this.platform.is('cordova')) {
      console.log("I am an cordova Device");
    }
    else {
      console.log("I am an Browser");
    }
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}