import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { configService } from '../Service/config.service';
import { Platform } from '@ionic/angular';
import { userService } from '../Service/user.service';
import { chats } from '../Service/chat.service';

declare var RTCMultiConnection;
@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.page.html',
  styleUrls: ['./video-chat.page.scss'],
})
export class VideoChatPage implements OnInit {
  changeEyeIcon = true;
  userDetail: any;
  topVideoFrame = 'partnerVideo';
  userId: string;
  chatUser_id: string;
  loginUser: any;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  partnerVideo;
  myVideo;
  MessageData = { type: '', nickname: '', message: '' };
  chats = [];
  openModal = false;
  roomkey: string;
  nickname: string;
  chatUser;
  userType: string;
  s3Url;
  timecount = 0;
  minutes = 0;
  interval: any;
  connection: any;
  socket: any;
  callerType;
  constructor(public popoverController: PopoverController,
    public navCtrl: NavController,
    public localStorage: LocalstorageService,
    public elRef: ElementRef,
    public loading: LoadingService,
    public route: ActivatedRoute,
    public router: Router,
    public config: configService,
    private platform: Platform,
    private userService: userService,
    private chatService: chats,
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
    this.callerType = this.localStorage.getsingel('callerType');
    this.loginUser = this.localStorage.get('userDetail');
    this.webrtc();
    this.join(this.roomkey);
    this.userId = this.loginUser.id;
    this.MessageData.type = 'message';
    this.MessageData.nickname = this.nickname;
    this.chatService.getChatList(this.roomkey).subscribe(value => {
      this.chats = [];
      this.chats = value;
    })
  }
  sendMessage(data) {
    if (!data.message.trim().length) {
      //Empty String Not Send On message
    }
    else {
      const messagedata = {
        type: data.type,
        user: data.nickname,
        message: data.message,
        sendDate: Date()
      }
      this.chatService.sendMessage(messagedata, this.roomkey);
    }
    this.MessageData.message = '';
  }
  ngAfterViewInit() {
    this.platform.ready().then(() => {
    });
  }
  sendCoins(coins) {
    if (!this.changeEyeIcon) {
      const message = {
        type: 'message',
        nickname: this.nickname,
        message: "Send Me " + coins.toString() + " Coins",
      }
      this.sendMessage(message);
    } else {
      const mutation = {
        name: 'coin_management',
        inputtype: 'CoinManagementInputType',
        data: { user_id: this.chatUser_id, coin: coins, type: "message" }
      }
      this.loading.showLoader();
      this.userService.CloseApi(mutation).subscribe(result => {
        const res = result['data'].coin_management;
        this.loading.hideLoader();
        if (!res.hasError) {
          this.loginUser.coins = this.userDetail.coins - coins;
          const message = {
            type: 'SendCoin',
            nickname: this.nickname,
            message: coins.toString(),
          }
          this.sendMessage(message);
        } else {
          this.config.sendToast("danger", res.message, "bottom");
        }
        this.closeCoinModal();
      }, err => {
        this.loading.hideLoader();
        this.config.sendToast("danger", "Something Went Wrong" + err, "bottom");
      });
    }
  }
  join(roomid) {
    this.connection.openOrJoin(roomid);
  }
  changeBeautifyOption() {
    this.changeEyeIcon = !this.changeEyeIcon;
  }
  openCoinModal() {
    this.openModal = !this.openModal;
  }
  closeCoinModal() {
    this.openModal = false;
  }
  close() {
    var videoEl = this.elRef.nativeElement.querySelector('#myVideo');
    const stream = videoEl.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
      track.stop();
    });
    videoEl.srcObject = null;
    const params = "key=" + this.roomkey + "@nickname=" + this.nickname + "&chatUser=" + JSON.stringify(this.chatUser) + "&chatUser_id=" + this.chatUser_id + "&userType=" + this.userType;
    this.navCtrl.navigateRoot(`/chat-window?${params}`);
  }
  webrtc() {
    // let content = document.querySelector('#myContent') as HTMLElement;
    const chatUser_id = this.chatUser_id;
    const userService = this.userService;
    const interval = this.interval;
    const userdetail = this.loginUser;
    const localStorage = this.localStorage.getsingel('callerType');
    let partnerVideo = this.elRef.nativeElement.querySelector('#partnerVideo');
    let myVideo = this.elRef.nativeElement.querySelector('#myVideo');
    let time = this.elRef.nativeElement.querySelector('#time');
    this.connection = new RTCMultiConnection(); // this line is VERY_important 
    this.connection.socketURL = 'http://ec2-54-248-130-122.ap-northeast-1.compute.amazonaws.com:3008/'; // if you want text chat 
    this.connection.session = { data: true } // all below lines are optional; however recommended. 
    this.connection.session = { audio: false, video: true };
    this.connection.maxParticipantsAllowed = 2;
    this.connection.onMediaError = function (error) { };
    this.connection.mediaConstraints = { video: true, audio: false };
    this.connection.sdpConstraints.mandatory = { OfferToReceiveAudio: false, OfferToReceiveVideo: true };
    this.connection.onstream = function (event) {
      if (!myVideo.srcObject)
        myVideo.srcObject = event.stream;
      else if (!partnerVideo.srcObject && myVideo.srcObject)
        partnerVideo.srcObject = event.stream;

      if (event.type === "remote") {
        this.timecount = 0;
        this.minutes = 0;
        this.interval = setInterval(() => {
          this.timecount++;
          if (this.timecount == 60) {
            this.minutes++;
            this.timecount = 0;
            deductcoin(50);
          }
          time.innerHTML = `TIME:${this.minutes}:${this.timecount}`;
        }, 1000)
      }
      // content.appendChild(event.mediaElement);
    };
    this.connection.onstreamended = function (event) {
      const stream = myVideo.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      clearInterval(this.interval);
      partnerVideo.srcObject = null;
      myVideo.srcObject = null;
    }

    function deductcoin(coins) {
      if (localStorage === "sender") {
        const mutation = {
          name: 'coin_management',
          inputtype: 'CoinManagementInputType',
          data: { user_id: chatUser_id, coin: coins, type: "message" }
        }
        userService.CloseApi(mutation).subscribe(result => {
          const res = result['data'].coin_management;
          if (!res.hasError) {
            userdetail.coins = userdetail.coins - coins;
          } else {
            const stream = myVideo.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(function (track) {
              track.stop();
            });
            clearInterval(interval);
            partnerVideo.srcObject = null;
            myVideo.srcObject = null;
          }
        }, err => {
          this.config.sendToast("danger", "Something Went Wrong" + err, "bottom");
        });
      }
    }
  }

  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }

}