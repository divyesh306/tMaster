import { Component } from '@angular/core';
import * as firebase from 'firebase';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalstorageService } from './Service/localstorage.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';

const config = {
  apiKey: 'AIzaSyDH0CirRvPmCSQt8qsEx4bLsm_urUqtTQE',
  authDomain: 'tmaster-d0da3.firebaseapp.com',
  databaseURL: 'https://tmaster-d0da3-default-rtdb.firebaseio.com/',
  projectId: 'tmaster-d0da3',
  storageBucket: 'tmaster-d0da3.appspot.com',
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen, private navCtrl: NavController,
    private statusBar: StatusBar, private router: Router, private localStorage: LocalstorageService,
    private translate: TranslateService, private androidPermissions: AndroidPermissions ,private file:File
  ) {
    if (this.localStorage.getsingel('loginToken')) {
      this.router.navigate(['/tabs/hangout']);
    }
    else {
      this.router.navigate(['']);
    }
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    if (this.platform.is('cordova')) {
      console.log("I am an cordova Device");
    }
    else {
      console.log("I am an Browser");
    }
    this.initializeApp();
    firebase.initializeApp(config);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.STORAGE).then(
        result => {
          console.log('Has permission?', result.hasPermission),
            this.file.externalDataDirectory + "files/videos/";
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.STORAGE)
      );

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.STORAGE, this.androidPermissions.PERMISSION.STORAGE]);
    });
  }
}