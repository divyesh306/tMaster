import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalstorageService } from './Service/localstorage.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { Globalconst } from './Service/enviroment';
import { AngularFireModule } from '@angular/fire';
// import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  selectedLanguage = "";
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, private router: Router, private localStorage: LocalstorageService,
    private translate: TranslateService, private androidPermissions: AndroidPermissions, private file: File
  ) {
    if (this.localStorage.getsingel('loginToken')) {
      this.router.navigate(['/tabs/hangout']);
    }
    else {
      this.router.navigate(['']);
    }
    console.log("Fire Base : ",Globalconst.accessKeyId),
    this.translate.addLangs(['en', 'jst']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.selectedLanguage = localStorage.get('selectedLanguage');
    this.initializeApp();
    this.changeLanguage(this.selectedLanguage);
    // AngularFireModule.initializeApp(Globalconst.firebase_config);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('ios')) {

      }
      else {
        this.androidPermissions.requestPermissions(
          [
            this.androidPermissions.PERMISSION.CAMERA,
            this.androidPermissions.PERMISSION.READ_PHONE_STATE,
            this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          ]
        );
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.STORAGE).then(
          result => console.log('CAMERA Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.STORAGE)
        );
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
          result => console.log('CAMERA Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        );
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(
          result => console.log('READ_PHONE_STATE Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
        );
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS).then(
          result => console.log('MODIFY_AUDIO_SETTINGS Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
        );
      }
    });
  }

  changeLanguage(language) {
    if (language == {}) {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.localStorage.set('selectedLanguage', 'en');
    } else {
      this.translate.setDefaultLang(language);
      this.translate.use(language);
    }
  }
}