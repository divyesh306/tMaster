import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as firebase from 'firebase';
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
  ref = firebase.database().ref('chatroom/');

  constructor(public router: Router, private localStorage: LocalstorageService, private ConfigService: configService, private userService: userService, private chatService: chats, private loading: LoadingService) {

  }

  ionViewDidEnter() {
    this.loginUser = this.localStorage.get('userDetail');
    this.s3Url = this.ConfigService.getS3();
    const body = {
      name: 'room_list(id:"' + this.loginUser.id + '"){sender_id receiver_id room_id room_key receiver{nick_name picture} sender{nick_name picture} type}'
    }
    this.loading.present();
    this.userService.closeQuery(body).subscribe(result => {
      this.loading.dismiss();
      this.roomlist = result['data'].room_list;//this.splitKeyValue(result['data'].room_list);
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

  ngOnInit() {}

  selectTab(roomArray, tab) {
    this.activeTab = tab;
    if (tab === 'know')
      this.rooms = roomArray.filter(element => element.type == tab || element.type == '' || element.type == null);
    else
      this.rooms = roomArray.filter(element => element.type == tab);
  }

  optionSelected(option) {
    this.sortOption = option;
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
  enterNickname() {
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