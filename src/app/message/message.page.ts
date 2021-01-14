import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as firebase from 'firebase';
import { chats } from '../Service/chat.service';
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
  data = { nickname: '', roomname: '' };
  rooms = [];
  nickname = "";
  loginUser;
  roomlist = [];
  ref = firebase.database().ref('chatroom/');

  constructor(public router: Router, private localStorage: LocalstorageService, private userService: userService ,private chatService: chats) {
    this.loginUser = this.localStorage.get('userDetail');
    const body = {
      name: 'room_list(id:"' + this.loginUser.id + '"){sender_id receiver_id room_id room_key receiver_name sender_name}'
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
        key: key,
        nickname: this.data.nickname
      }
    };
    console.log(navigationExtras);
    this.router.navigate(['/chat-window'], navigationExtras);
  }
  enterNickname() {
  }
}