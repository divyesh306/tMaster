import { Injectable } from "@angular/core";
import firebase from 'firebase/app'
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})

export class chats {
    data = { type: '', nickname: '', message: '' };
    chats = [];
    roomkey: string;
    nickname: string;
    offStatus: boolean = false;
    chatRef: AngularFireList<any>;   // Reference to Student object, its an Observable too
    constructor(public router: Router,
        public route: ActivatedRoute, public navCtrl: NavController,
        public db: AngularFireDatabase) {
    }

    setStatus(userId) {
        var myStatusRef = firebase.database().ref("users/" + userId + '/status');
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on('value', function (snap) {
            if (snap.val() == true) {
                myStatusRef.onDisconnect().remove();
                myStatusRef.set('online');
                myStatusRef.onDisconnect().set('Offline');
            }
        });
    }

    getStatus(firebase_user_id) {
        return firebase.database().ref('users/' + firebase_user_id + '/status')
    }
    getChatList(roomkey) {
        return this.db.list('chatroom/' + roomkey + '/chats').valueChanges();
    }
    createRoom(data) {
        var roomdata = {
            roomname: data.roomname
        };
        let newData = this.db.list('chatroom/').push(roomdata);
        return newData;
    }
    sendMessage(data, roomkey) {
        this.chatRef = this.db.list('chatroom/' + roomkey + '/chats');
        this.chatRef.push(data);
    }
}