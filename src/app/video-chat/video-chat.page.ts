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
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';

declare var RTCMultiConnection;
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
  calluserId: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  partnerVideo;
  myVideo;
  MessageData = { type: '', nickname: '', message: '' };
  chats = [];
  roomkey: string;
  nickname: string;
  chatUser;
  userType: string;
  s3Url;

  connection: any;
  socket: any;

  constructor(public popoverController: PopoverController, public navCtrl: NavController, public webRTC: WebrtcService,
    public localStorage: LocalstorageService, public elRef: ElementRef, public loading: LoadingService,
    public route: ActivatedRoute,
    public config: configService,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {
    this.s3Url = this.config.getS3();
    this.socket = this.config.getSocket();
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
    this.calluserId = this.loginUser.firebase_user_id;
    this.partnerId = this.chatUser.firebase_user_id;
    this.webrtc();
    this.join(this.roomkey);
    this.userId = this.loginUser.id;
    this.MessageData.type = 'message';
    this.MessageData.nickname = this.nickname;
    firebase.database().ref('chatroom/' + this.roomkey + '/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
    });
    // this.init();
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
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.getPermission();
    });
  }
  getPermission() {
    this.diagnostic.requestCameraAuthorization().then((res) => {
      return this.diagnostic.requestMicrophoneAuthorization()
    })
      .then((res) => { })
      .catch((err) => { })
      .finally(() => { this.webrtc(); });
  }

  join(roomid) {
    this.socket.emit('call', JSON.stringify({ room_id: roomid, user_id: this.chatUser.firebase_user_id }));
    this.connection.openOrJoin(roomid);
  }

  close() {
    this.connection.getAllParticipants().forEach(function (participantId) {
      console.log(participantId); this.connection.disconnectWith(participantId);
    });
  }

  webrtc() {
    let content = document.querySelector('#myContent') as HTMLElement;
    this.connection = new RTCMultiConnection(); // this line is VERY_important 
    this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'; // if you want text chat 
    this.connection.session = { data: true } // all below lines are optional; however recommended. 
    this.connection.session = { audio: true, video: true };
    this.connection.onMediaError = function (error) { };
    this.connection.sdpConstraints.mandatory = { OfferToReceiveAudio: true, OfferToReceiveVideo: true };
    this.connection.onstream = function (event) {
      content.appendChild(event.mediaElement);
    };
    this.connection.onmessage = function (event) {
      alert(event);
    };
  }
  // init() {
  //   this.myEl = this.elRef.nativeElement.querySelector('#myVideo');
  //   this.partnerEl = this.elRef.nativeElement.querySelector('#partnerVideo');
  //   this.webRTC.init(this.myEl, this.partnerEl, () => {
  //     console.log('I\'m calling');
  //   });
  //   this.loading.present();
  //   setTimeout(() => {
  //     this.loading.dismiss();
  //     this.call();
  //   }, 5000);
  // }

  // call() {
  //   console.log("Video Call : ", this.chatUser.firebase_user_id);
  //   this.webRTC.call(this.chatUser.firebase_user_id);
  //   // this.webRTC.call(this.chatUser_id);s
  //   this.swapVideo('myVideo');
  // }

  // swapVideo(topVideo: string) {
  //   this.topVideoFrame = topVideo;
  // }
  // changeBeautifyOption() {
  //   this.closeEye = !this.closeEye;
  // }
  // async endCall(ev) {
  //   const popover = await this.popoverController.create({
  //     component: CloseVideoComponent,
  //     cssClass: 'custom-popover',
  //     event: ev,
  //     translucent: true,
  //     componentProps: {
  //       onClick: () => {
  //         this.webRTC.endCall();
  //         this.navCtrl.pop();
  //       }
  //     }
  //   });
  //   return await popover.present();
  //   // const popover = await this.popoverController.create({
  //   //   component: WarningComponent,
  //   //   cssClass: 'warning-popover',
  //   //   event: ev,
  //   //   translucent: true,
  //   // });
  //   // return await popover.present();
  // }
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