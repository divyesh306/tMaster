import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { CloseVideoComponent } from '../component/close-video/close-video.component';
import { WarningComponent } from '../component/warning/warning.component';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { WebrtcService } from '../Service/webrtc.service';
import firebase from 'firebase/app';
import { configService } from '../Service/config.service';

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
  MessageData = { type: '', nickname: '', message: '' };
  chats = [];
  roomkey: string;
  nickname: string;
  chatUser;
  userType: string;
  s3Url;
  constructor(public popoverController: PopoverController, public navCtrl: NavController, public webRTC: WebrtcService,
    public localStorage: LocalstorageService, public elRef: ElementRef, public loading: LoadingService,
    public route: ActivatedRoute, public config: configService
  ) {
    this.s3Url = this.config.getS3();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.chatUser_id) {
        this.chatUser_id = params.chatUser_id;
        this.roomkey = params.key;
        this.nickname = params.nickname;
        this.chatUser = JSON.parse(params.chatUser);
        this.chatUser_id = params.chatUser_id;
        this.userType = params.userType;
      }
    });
    this.loginUser = this.localStorage.get('userDetail');
    this.userId = this.loginUser.id;
    this.MessageData.type = 'message';
    this.MessageData.nickname = this.nickname;
    firebase.database().ref('chatroom/' + this.roomkey + '/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
    });
    this.init();
  }

  sendMessage(data) {
    if (!data.message.trim().length) {
      //Empty String Not Send On message
    }
    else {
      let newData = firebase.database().ref('chatroom/' + this.roomkey + '/chats').push();
      newData.set({
        type: data.type,
        user: data.nickname,
        message: data.message,
        sendDate: Date()
      });
    }
    this.MessageData.message = '';
  }

  init() {
    this.myEl = this.elRef.nativeElement.querySelector('#myVideo');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partnerVideo');
    this.webRTC.init(this.myEl, this.partnerEl, () => {
      console.log('I\'m calling');
    });
    this.loading.present();
    setTimeout(() => {
      this.loading.dismiss();
      this.call();
    }, 5000);
  }

  call() {
    console.log("Video CCall : ", this.chatUser.firebase_user_id);
    this.webRTC.call(this.chatUser.firebase_user_id);
    // this.webRTC.call(this.chatUser_id);
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

export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};