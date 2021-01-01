import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

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
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate:TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    if(this.platform.is('cordova')){
      console.log("I am an cordova Device");
    }
    else{
      console.log("I am an Browser");
    }
    this.initializeApp();
    firebase.initializeApp(config);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
