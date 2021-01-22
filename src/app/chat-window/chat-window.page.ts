import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonContent, NavController, PopoverController } from '@ionic/angular';
import { VideoNoticeComponent } from '../component/video-notice/video-notice.component';
import { MediaCapture, MediaFile, CaptureError, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import * as firebase from 'firebase';
import { chats } from '../Service/chat.service';
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';
import { LoadingService } from '../Service/loading.service';
import { Chooser } from '@ionic-native/chooser/ngx';
import { S3Controller } from '../Service/upload.service';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.page.html',
  styleUrls: ['./chat-window.page.scss'],
})
export class ChatWindowPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  MessageData = { type: '', nickname: '', message: '' };
  chats = [];
  roomkey: string;
  nickname: string;
  offStatus: boolean = false;
  openModal = false;
  fileOption = false;
  chatUser: String;
  chatUser_id: string;

  constructor(public router: Router,
    public popoverController: PopoverController,
    public actionSheetController: ActionSheetController,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public userService: userService,
    public configService: configService,
    public uploadservice: S3Controller,
    public loading: LoadingService,
    private mediaCapture: MediaCapture,
    public chatService: chats,
    private file: File,
    private chooser: Chooser) {
    this.route.queryParams.subscribe(params => {
      console.log('params: ', params);
      if (params && params.key && params.nickname) {
        this.roomkey = params.key;
        this.nickname = params.nickname;
        this.chatUser = JSON.parse(params.chatUser);
        this.chatUser_id = params.chatUser_id;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('params: ', params);
      if (params && params.key && params.nickname) {
        this.roomkey = params.key;
        this.nickname = params.nickname;
        this.chatUser = JSON.parse(params.chatUser);
        this.chatUser_id = params.chatUser_id;
      }
    });
    this.MessageData.type = 'message';
    this.MessageData.nickname = this.nickname;
    console.log('roomkey', this.roomkey);

    firebase.database().ref('chatroom/' + this.roomkey + '/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if (this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage(data) {
    let newData = firebase.database().ref('chatroom/' + this.roomkey + '/chats').push();
    newData.set({
      type: data.type,
      user: data.nickname,
      message: data.message,
      sendDate: Date()
    });
    this.MessageData.message = '';
  }

  exitChat() {
    this.offStatus = true;

    this.router.navigate(['room']);
  }

  openCoinModal() {
    console.log('open');
    this.openModal = !this.openModal;
  }

  closeCoinModal() {
    this.openModal = false;
  }

  openFile(url) {
    console.log("File Url : ", url);
  }
  
  openFileOption() {
    this.fileOption = !this.fileOption;
  }

  selectFile() {
    this.chooser.getFile()
      .then(file => {
        console.log(file ? file : 'canceled')
        if (file) {
          this.loading.present();
          this.uploadservice.uploadFile(file.data, file.name, (url) => {
            const se3url = this.configService.getS3() + url.Key;
            this.loading.dismiss();
            const message = {
              type: "File",
              nickname: this.nickname,
              message: se3url
            }
            this.sendMessage(message);
          });
        }
        else {

        }
      })
      .catch((error: any) => console.error(error));
  }

  recordAudio() {
    this.mediaCapture.captureAudio()
      .then(
        async (data: MediaFile[]) => {
          this.loading.present();
          var path = data[0].fullPath.replace('/private', 'file:///');
          // const newBaseFilesystemPath = this.file.externalDataDirectory + "files/videos/";
          const videofilename = path.substr(path.lastIndexOf('/') + 1);
          const videopath = path.substr(0, path.lastIndexOf('/') + 1);
          const filename = videofilename.substr(0, videofilename.lastIndexOf('.'));
          console.log("File Name : ", filename);
          console.log("videofilename Name : ", videofilename);
          console.log("videopath Name : ", videopath);
          this.loading.dismiss();
          // this.file.readAsArrayBuffer(videopath, videofilename).then((body) => {
          //   this.uploadservice.uploadFile(body, videofilename, async (url) => {
          //     this.userData.video = url.Key;
          //     if (this.userData.video)
          //       this.loading.dismiss();

          //   });
          // }).catch(err => {
          //   this.configService.sendToast('danger', 'readAsDataURL failed: (' + err.code + ")" + err.message, 'bottom');
          // });
        },
        (err: CaptureError) => this.configService.sendToast('danger', err.code, 'bottom')
      );
  }
  async videoCall(ev: any) {
    const popover = await this.popoverController.create({
      component: VideoNoticeComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onClick: () => {
          this.router.navigate(['/video-chat']);
        }
      }
    });
    return await popover.present();
  }

  addFavorite() {
    const mutation = {
      name: 'add_to_favorite_user',
      inputtype: 'AddFavoriteUserInputType',
      data: { favorite_user: this.chatUser_id }
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].add_to_favorite_user;
      this.loading.dismiss();
      if (!res.hasError) {
        this.configService.sendToast('success', 'This User Add As a Favorite', 'bottom');
      } else {

      }
    }, err => {
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

  removeFavorite() {
    const mutation = {
      name: 'remove_favorite_user',
      inputtype: 'RemoveFavoriteUserInputType',
      data: { favorite_user: this.chatUser_id }
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].remove_favorite_user;
      this.loading.dismiss();
      if (!res.hasError) {
        this.configService.sendToast('success', 'This User Remove From Favorite', 'bottom');
      } else {

      }
    }, err => {
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Add favorite',
        handler: () => {
          this.addFavorite();
        }
      }, {
        text: 'Release',
        role: 'destructive',
        handler: () => {
          console.log('DeleReleasete clicked');
        }
      }, {
        text: 'Block',
        handler: () => {
          console.log('Block clicked');
        }
      }, {
        text: 'Report',
        handler: () => {
          console.log('Report');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    console.log("Chat : ", item);
    returnArr.push(item);
  });

  return returnArr;
};

