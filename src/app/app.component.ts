import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalstorageService } from './Service/localstorage.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { environment } from '../environments/environment';
import firebase from 'firebase/app';
import { AngularFireModule } from '@angular/fire';
// for AngularFireDatabase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
// import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  selectedLanguage = "";
  constructor(
    private platform: Platform, private firestore: AngularFirestore,
    private splashScreen: SplashScreen, private navCtrl: NavController, private inAppPurchase: InAppPurchase2, private af: AngularFireAuth,
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
    AngularFireModule.initializeApp(environment.firebase_config);
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
      this.af.onAuthStateChanged(user => {
        console.log(user);
        if (user) {
          var myStatusRef = firebase.database().ref("users/" + user.uid + '/status');
          var connectedRef = firebase.database().ref(".info/connected");
          console.log('connectedRef', connectedRef);
          connectedRef.on('value', function (snap) {
            if (snap.val() == true) {
              myStatusRef.onDisconnect().remove();
              myStatusRef.set('online');
              myStatusRef.onDisconnect().set('Offline');
            }
          });
        } else {
          document.onvisibilitychange = (e) => {
            if (document.visibilityState == 'hidden') {
              myStatusRef.set('away');
            } else {
              myStatusRef.set('online');
            }
          }
        }
      })
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
    if (language == {}) {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.localStorage.set('selectedLanguage', 'en');
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