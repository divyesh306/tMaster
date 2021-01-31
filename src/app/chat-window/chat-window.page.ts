import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, NavController, PopoverController } from '@ionic/angular';
import { VideoNoticeComponent } from '../component/video-notice/video-notice.component';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import * as firebase from 'firebase';
import { chats } from '../Service/chat.service';
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';
import { LoadingService } from '../Service/loading.service';
import { Chooser } from '@ionic-native/chooser/ngx';
import { S3Controller } from '../Service/upload.service';
import { File } from '@ionic-native/file/ngx';
import { FileViewerService } from '../Service/file-viewer.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { WebrtcService } from '../Service/webrtc.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.page.html',
  styleUrls: ['./chat-window.page.scss'],
})
export class ChatWindowPage implements OnInit {
  MessageData = { type: '', nickname: '', message: '' };
  chats = [];
  roomkey: string;
  nickname: string;
  offStatus: boolean = false;
  openModal = false;
  fileOption = false;
  chatUser: String;
  chatUser_id: string;
  userType: string;

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
    private fileopenServcie: FileViewerService,
    private chooser: Chooser,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.key && params.nickname) {
        this.roomkey = params.key;
        this.nickname = params.nickname;
        this.chatUser = JSON.parse(params.chatUser);
        this.chatUser_id = params.chatUser_id;
        this.userType = params.userType;
      }
    });
    console.log("Type Params : ", this.userType);
    this.MessageData.type = 'message';
    this.MessageData.nickname = this.nickname;
    firebase.database().ref('chatroom/' + this.roomkey + '/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      if (this.chats) {
        if (!this.userType || this.userType == "know") {
          let nickname, otherUser;
          console.log("Chats : ", this.chats);
          for (var i = 0; i < this.chats.length; i++) {
            console.log("User Name : ", this.chats[i].nickname);
            if (this.chats[i].user == this.nickname)
              nickname = this.chats[i].user;
            else otherUser = this.chats[i].user;
          }
          console.log("Nickname : " + nickname + " Other User : " + otherUser);
          if (nickname && otherUser) {
            this.addFavorite('friend')
          }
        }
      }
    });
  }

  sendCoins(coins) {
    const mutation = {
      name: 'coin_management',
      inputtype: 'CoinManagementInputType',
      data: { user_id: this.chatUser_id, coin: coins, type: "message" }
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].coin_management;
      this.loading.dismiss();
      if (!res.hasError) {
        const message = {
          type: 'SendCoin',
          nickname: this.nickname,
          message: coins.toString(),
        }
        console.log("message Params : ",message);
        this.sendMessage(message);
      } else {

      }
    }, err => {
      this.loading.dismiss();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
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

  exitChat() {
    this.offStatus = true;

    this.router.navigate(['room']);
  }

  openCoinModal() {
    this.openModal = !this.openModal;
  }

  closeCoinModal() {
    this.openModal = false;
  }

  openFile(url) {
    const audiofilename = url.substr(url.lastIndexOf('/') + 1);
    this.fileopenServcie.download(url, audiofilename);
  }

  openFileOption() {
    this.fileOption = !this.fileOption;
  }

  selectFile() {
    this.chooser.getFile()
      .then(file => {
        if (file) {
          this.loading.present();
          console.log("File : ", file.mediaType);
          var type;
          if (file.mediaType == "video/mp4" || file.mediaType == "video/mpeg" || file.mediaType == "video/x-msvideo" || file.mediaType == "video/webm") {
            type = "Video"
          }
          else if (file.mediaType == "image/jpeg" || file.mediaType == "image/png" || file.mediaType == "image/bmp" || file.mediaType == "image/*") {
            type = "Image"
          }
          else {
            type = "File"
          }
          this.uploadservice.uploadFile(file.data, file.name, (url) => {
            const se3url = url.Location;
            this.loading.dismiss();
            const message = {
              type: type,
              nickname: this.nickname,
              message: se3url
            }
            this.sendMessage(message);
          });
        }
        else { }
      })
      .catch((error: any) => console.error(error));
  }

  capturePhoto() {
    this.mediaCapture.captureImage()
      .then(
        async (data: MediaFile[]) => {
          this.loading.present();
          var path = data[0].fullPath;//.replace('/private', 'file:///');
          const audiofilename = path.substr(path.lastIndexOf('/') + 1);
          const audiopath = path.substr(0, path.lastIndexOf('/') + 1);
          this.file.readAsArrayBuffer(audiopath, data[0].name).then((body) => {
            this.uploadservice.uploadFile(body, audiofilename, async (url) => {
              const se3url = url.Location;
              this.loading.dismiss();
              const message = {
                type: "Image",
                nickname: this.nickname,
                message: se3url
              }
              this.sendMessage(message);

            });
          }).catch(err => {
            this.loading.dismiss();
            this.configService.sendToast('danger', 'readAsDataURL failed: (' + err.code + ")" + err.message, 'bottom');
          });
        },
        (err: CaptureError) => this.configService.sendToast('danger', err.code, 'bottom')
      );
  }

  recordAudio() {
    this.mediaCapture.captureAudio()
      .then(
        async (data: MediaFile[]) => {
          this.loading.present();
          var path = data[0].fullPath;//.replace('/private', 'file:///');
          const audiofilename = path.substr(path.lastIndexOf('/') + 1);
          const audiopath = path.substr(0, path.lastIndexOf('/') + 1);
          this.file.readAsArrayBuffer(audiopath, data[0].name).then((body) => {
            this.uploadservice.uploadFile(body, audiofilename, async (url) => {
              const se3url = url.Location;
              this.loading.dismiss();
              const message = {
                type: "Audio",
                nickname: this.nickname,
                message: se3url
              }
              this.sendMessage(message);

            });
          }).catch(err => {
            this.loading.dismiss();
            this.configService.sendToast('danger', 'readAsDataURL failed: (' + err.code + ")" + err.message, 'bottom');
          });
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
          let navigationExtras: NavigationExtras = {
            queryParams: {
              chatUser_id: this.chatUser_id
            }
          };
          this.router.navigate(['/video-chat'], navigationExtras);
        }
      }
    });
    return await popover.present();
  }

  addFavorite(type) {
    const mutation = {
      name: 'add_to_favorite_user',
      inputtype: 'AddFavoriteUserInputType',
      data: { favorite_user: this.chatUser_id, type: type }
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].add_to_favorite_user;
      this.loading.dismiss();
      if (!res.hasError) {
        this.configService.sendToast('success', 'This User Add As a Favorite', 'bottom');
      } else { }
    }, err => {
      this.loading.dismiss();
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
      this.loading.dismiss();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

  userBlocked() {
    const mutation = {
      name: 'add_user_to_blocks',
      inputtype: 'BlockUserInputType',
      data: { blocked_user_id: this.chatUser_id }
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].add_user_to_blocks;
      this.loading.dismiss();
      if (!res.hasError) {
        this.configService.sendToast('success', 'User Blocked', 'bottom');
      } else {

      }
    }, err => {
      this.loading.dismiss();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

  removeUserBlocked() {
    const mutation = {
      name: 'remove_blocked_user',
      inputtype: 'RemoveBlockedUserInputType',
      data: { blocked_user_id: this.chatUser_id }
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].remove_blocked_user;
      this.loading.dismiss();
      if (!res.hasError) {
        this.configService.sendToast('success', 'User Remove From Blocked', 'bottom');
      } else {

      }
    }, err => {
      this.loading.dismiss();
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
          this.addFavorite("favorite");
        }
      }, {
        text: 'Release',
        role: 'destructive',
        handler: () => {
          this.removeUserBlocked();
        }
      }, {
        text: 'Block',
        handler: () => {
          this.userBlocked();
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
    returnArr.push(item);
  });

  return returnArr;
};

