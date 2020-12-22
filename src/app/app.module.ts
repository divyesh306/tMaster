import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { File } from '@ionic-native/file/ngx';

import { S3Controller } from './Service/upload.service';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SmsRetriever,
    MediaCapture,
    VideoPlayer,
    S3Controller,
    VideoEditor,
    File
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
