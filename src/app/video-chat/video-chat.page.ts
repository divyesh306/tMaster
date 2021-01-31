import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { CloseVideoComponent } from '../component/close-video/close-video.component';
import { WarningComponent } from '../component/warning/warning.component';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { WebrtcService } from '../Service/webrtc.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.page.html',
  styleUrls: ['./video-chat.page.scss'],
})
export class VideoChatPage implements OnInit {
  closeEye = true;
  userDetail: any;
  topVideoFrame = 'partnerVideo';
  userId: string;
  chatUser_id: string;
  loginUser: any;
  partnerVideo;
  myVideo;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  constructor(public popoverController: PopoverController, public navCtrl: NavController, public webRTC: WebrtcService,
    public localStorage: LocalstorageService, public elRef: ElementRef, public loading: LoadingService,
    public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.chatUser_id) {
        this.chatUser_id = params.chatUser_id;
      }
    });
    this.loginUser = this.localStorage.get('userDetail');
    this.userId = this.loginUser.id;
    this.init();
  }
  init() {
    this.myEl = this.elRef.nativeElement.querySelector('#myVideo');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partnerVideo');
    this.webRTC.init(this.userId, this.myEl, this.partnerEl);
    this.loading.present();
    setTimeout(() => {
      this.loading.dismiss();
      this.call();
    }, 5000);
  }

  call() {
    this.webRTC.call(this.chatUser_id);
    this.swapVideo('myVideo');
  }

  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }
  changeBeautifyOption() {
    this.closeEye = !this.closeEye;
  }
  async endCall(ev) {
    const popover = await this.popoverController.create({
      component: CloseVideoComponent,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true,
      componentProps: {
        onClick: () => {
          this.webRTC.endCall();
          this.navCtrl.pop();
        }
      }
    });
    return await popover.present();
    // const popover = await this.popoverController.create({
    //   component: WarningComponent,
    //   cssClass: 'warning-popover',
    //   event: ev,
    //   translucent: true,
    // });
    // return await popover.present();
  }
}
