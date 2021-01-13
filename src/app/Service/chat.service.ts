import { Injectable } from "@angular/core";
import { inject } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";

import * as firebase from 'firebase';


@Injectable({
    providedIn: 'root'
})

export class chats {
    data = { type: '', nickname: '', message: '' };
    chats = [];
    roomkey: string;
    nickname: string;
    offStatus: boolean = false;
    ref = firebase.database().ref('chatroom/');
    constructor(public router: Router,
        public route: ActivatedRoute, public navCtrl: NavController) {
    }
    createRoom(data) {
        let newData = this.ref.push();
        newData.set({
            roomname: data.roomname
        });
        return newData;
    }

    getrooms(data) {
        return snapshotToArray(data);
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