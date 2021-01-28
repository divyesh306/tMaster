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
// import { FCM } from '@ionic-native/fcm/ngx';

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
  selectedLanguage = "";
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen, private navCtrl: NavController,
    private statusBar: StatusBar, private router: Router, private localStorage: LocalstorageService,
    private translate: TranslateService, private androidPermissions: AndroidPermissions, private file: File
  ) {
    if (this.localStorage.getsingel('loginToken')) {
      this.router.navigate(['/tabs/hangout']);
    }
    else {
      this.router.navigate(['']);
    }
    this.translate.addLangs(['en', 'jst']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.selectedLanguage = localStorage.get('selectedLanguage');
    if (this.platform.is('cordova')) {
      console.log("I am an cordova Device");
    }
    else {
      console.log("I am an Browser");
    }
    this.initializeApp();
    this.changeLanguage(this.selectedLanguage);
    firebase.initializeApp(config);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.STORAGE).then(
        result => {
          this.file.externalDataDirectory + "files/videos/";
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.STORAGE)
      );

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.STORAGE, this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.RECORD_VIDEO, this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS, this.androidPermissions.PERMISSION.MODIFY_VIDEO_SETTINGS]);

      // this.fcm.onNotification().subscribe(data => {
      //   if (data.wasTapped) {
      //     console.log("Received in background");
      //   } else {
      //     console.log("Received in foreground");
      //   };
      // });

      // this.fcm.onTokenRefresh().subscribe(token => {
      //   console.log(token);
      //   // Register your new token in your back-end if you want
      //   // backend.registerToken(token);
      // });
    });
  }
  changeLanguage(language) {
  console.log(language);
    if (language =={}) {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    } else {
      this.translate.setDefaultLang(language);
      this.translate.use(language);
    }
  }
  // subscribeToTopic() {
  //   this.fcm.subscribeToTopic('enappd');
  // }
  // getToken() {
  //   this.fcm.getToken().then(token => {
  //     console.log(token);
  //     // Register your new token in your back-end if you want
  //     // backend.registerToken(token);
  //   });
  // }
  // unsubscribeFromTopic() {
  //   this.fcm.unsubscribeFromTopic('enappd');
  // }
}