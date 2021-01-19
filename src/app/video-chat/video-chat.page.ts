import { Component, ElementRef, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CloseVideoComponent } from '../component/close-video/close-video.component';
import { WarningComponent } from '../component/warning/warning.component';
import { WebrtcService } from '../Service/webrtc.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.page.html',
  styleUrls: ['./video-chat.page.scss'],
})
export class VideoChatPage implements OnInit {
  closeEye = true;
  userDetail: any;
  topVideoFrame = 'partner-video';
  userId: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  constructor(public popoverController: PopoverController, public webRTC: WebrtcService,
    public elRef: ElementRef) {
    this.userDetail = localStorage.getItem('userDetail');
    console.log(this.userDetail);
  }

  ngOnInit() {
  }
  init() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    this.webRTC.init(this.userId, this.myEl, this.partnerEl);
  }

  call() {
    this.webRTC.call(this.partnerId);
    this.swapVideo('my-video');
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
  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }
}
