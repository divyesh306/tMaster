import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as firebase from 'firebase';

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
  ref = firebase.database().ref('chatroom/');

  constructor(public router: Router) {
    this.ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      console.log(this.rooms);
    });
  }

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
  openChatWindow(key){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        key: key,
        nickname: this.data.nickname
      }
    };
   console.log(navigationExtras);
    this.router.navigate(['/chat-window'],navigationExtras);
  }
  addNewChat() {
    this.addNewUser = true;
  }
  enterNickname(){
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