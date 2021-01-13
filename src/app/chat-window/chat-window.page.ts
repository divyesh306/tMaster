import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonContent, NavController, PopoverController } from '@ionic/angular';
import { VideoNoticeComponent } from '../component/video-notice/video-notice.component';
import * as firebase from 'firebase';
import { chats } from '../Service/chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.page.html',
  styleUrls: ['./chat-window.page.scss'],
})
export class ChatWindowPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  data = { type: '', nickname: '', message: '' };
  chatmsgs = [];
  roomkey: string;
  nickname: string;
  offStatus: boolean = false;
  openModal = false;
  fileOption = false;
  constructor(public router: Router,
    public popoverController: PopoverController,
    public actionSheetController: ActionSheetController,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public chatService: chats) {
    this.route.queryParams.subscribe(params => {
      if (params && params.key && params.nickname) {
        this.roomkey = params.key;
        this.nickname = params.nickname;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.key && params.nickname) {
        this.roomkey = params.key;
        this.nickname = params.nickname;
      }
    });
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    firebase.database().ref('chatroom/' + this.roomkey + '/chats').on('value', resp => {
      this.chatmsgs = [];
      this.chatmsgs = snapshotToArray(resp);
      setTimeout(() => {
        if (this.offStatus === false) {
          // this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }


  sendMessage() {
    let newData = firebase.database().ref('chatroom/' + this.roomkey + '/chats').push();
    newData.set({
      type: this.data.type,
      user: this.data.nickname,
      message: this.data.message,
      sendDate: Date()
    });
    this.data.message = '';
  }

  exitChat() {
    let exitData = firebase.database().ref('chatroom/' + this.roomkey + '/chats').push();
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

  openFileOption() {
    this.fileOption = !this.fileOption;
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
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Add favorite',
        handler: () => {
          console.log('Favorite clicked');
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
    returnArr.push(item);
  });

  return returnArr;
};

