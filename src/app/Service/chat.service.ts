import { Injectable } from "@angular/core";
import { inject } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class chats {
    data = { type: '', nickname: '', message: '' };
    chats = [];
    roomkey: string;
    nickname: string;
    offStatus: boolean = false;
    ref;
    constructor(public router: Router, public firestore: AngularFirestore,
        public route: ActivatedRoute, public navCtrl: NavController) {
        this.ref = this.firestore.collection('chatroom/').snapshotChanges();
        console.log('chat ref', this.ref);
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