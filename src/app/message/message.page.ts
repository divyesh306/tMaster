import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { chats } from '../Service/chat.service';
import { configService } from '../Service/config.service';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  activeTab = 'know';
  openSelectOption = false;
  sortOption = 'Sort by popular';
  addNewUser = false;
  data = { nickname: "", roomname: '' };
  rooms = [];
  nickname = "";
  loginUser;
  roomlist = [];
  s3Url;
  ref;
  constructor(public router: Router,
    private localStorage: LocalstorageService,
    private ConfigService: configService,
    private userService: userService,
    private chatService: chats,
    private loading: LoadingService,
    public firestore: AngularFirestore,) {
    this.ref = this.firestore.collection('chatroom/').snapshotChanges();
  }

  ionViewDidEnter() {
    this.loginUser = this.localStorage.get('userDetail');
    this.s3Url = this.ConfigService.getS3();
    const body = {
      name: 'room_list(id:"' + this.loginUser.id + '"){sender_id receiver_id room_id room_key created_at receiver{nick_name picture coins} sender{nick_name picture coins} type}'
    }
    this.loading.present();
    this.activeTab = 'know'
    this.userService.closeQuery(body).subscribe(result => {
      this.loading.dismiss();
      this.roomlist = result['data'].room_list;//this.splitKeyValue(result['data'].room_list);
      this.roomlist.forEach(element => {
        element.chatuserdata = {};
        if (element.receiver.nick_name == this.loginUser.nick_name)
          element.chatuserdata = element.sender;
        else
          element.chatuserdata = element.receiver;
      });
      this.rooms = this.roomlist.filter(element => element.type == this.activeTab || element.type == "" || element.type == null);
    }, err => {
      this.loading.dismiss();
      this.ConfigService.sendToast('danger', "Something Went Wrong : " + err, 'bottom');
    })

    this.data.nickname = this.loginUser.nick_name;
  }

  splitKeyValue = (obj) => {
    const keys = Object.keys(obj);
    const res = [];
    for (let i = 0; i < keys.length; i++) {
      res.push({
        'asset': keys[i],
        'data': obj[keys[i]]
      });
    };
    return res;
  };

  ngOnInit() { }

  selectTab(roomArray, tab) {
    this.activeTab = tab;
    if (tab === 'know')
      this.rooms = roomArray.filter(element => element.type == tab || element.type == '' || element.type == null);
    else
      this.rooms = roomArray.filter(element => element.type == tab);
  }

  optionSelected(option, roomlist, filed) {
    this.sortOption = option;
    this.rooms = roomlist.sort((a, b) => 0 - (new Date(a[filed]) > new Date(b[filed]) ? -1 : 1));
    this.openSelectOption = false;
  }

  sortByLowtoHigh(option, roomlist) {
    this.sortOption = option;
    this.rooms = roomlist.sort((a, b) => 0 - (a.chatuserdata.coins > b.chatuserdata.coins ? -1 : 1));
    this.openSelectOption = false;
  }

  sortByHightoLow(option, roomlist) {
    this.sortOption = option;
    this.rooms = roomlist.sort((a, b) => 0 - (b.chatuserdata.coins > a.chatuserdata.coins ? -1 : 1));
    this.openSelectOption = false;
  }

  selectOption() {
    this.openSelectOption = !this.openSelectOption;
  }

  openChatWindow(key) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        key: key.room_key,
        nickname: this.data.nickname,
        chatUser: key.receiver.nick_name == this.data.nickname ? JSON.stringify(key.sender) : JSON.stringify(key.receiver),
        chatUser_id: key.receiver.nick_name == this.data.nickname ? key.sender_id : key.receiver_id,
        userType: key.type
      }
    };
    this.router.navigate(['/chat-window'], navigationExtras);
  }

  addNewChat() {
    this.addNewUser = true;
  }

  addName() {
    this.addNewUser = false;
    let newData = this.ref.push();
    newData.set({
      roomname: this.data.roomname
    });
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