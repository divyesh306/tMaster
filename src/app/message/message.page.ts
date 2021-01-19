import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as firebase from 'firebase';
import { chats } from '../Service/chat.service';
import { configService } from '../Service/config.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  activeTab = 'Know';
  openSelectOption = false;
  sortOption = 'Sort by popular';
  addNewUser = false;
  data = { nickname: "komu", roomname: '' };
  rooms = [];
  nickname = "";
  loginUser;
  roomlist = [];
  s3Url;
  ref = firebase.database().ref('chatroom/');

  constructor(public router: Router, private localStorage: LocalstorageService, private ConfigService: configService, private userService: userService, private chatService: chats) {
    this.loginUser = this.localStorage.get('userDetail');
    this.s3Url = this.ConfigService.getS3();
    const body = {
      name: 'room_list(id:"' + this.loginUser.id + '"){sender_id receiver_id room_id room_key receiver{nick_name picture} sender{nick_name picture}}'
    }
    this.userService.closeQuery(body).subscribe(result => {
      this.rooms = this.splitKeyValue(result['data'].room_list);
      console.log("User List : ", this.rooms);
    }, err => {
      console.log("Somthing Went Wrong : ", err)
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
  ngOnInit() {
    console.log(this.data.nickname);

  }
  selectTab(tab) {
    this.activeTab = tab;
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
        chatUser_id: key.receiver.nick_name == this.data.nickname ? key.sender_id : key.receiver_id
      }
    };
    console.log(navigationExtras);
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