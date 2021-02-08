import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
@Injectable({
    providedIn: 'root'
})
export class configService {
    SERVER_URL;
    s3;
    constructor(public toastController: ToastController) {
        this.SERVER_URL = "http://54.248.130.122:3008/api/";
        this.s3 = "https://matukitestimg.s3.ap-south-1.amazonaws.com/" //https://matukitestimg.s3.ap-south-1.amazonaws.com/Profilevideo/20201231_171245.jpg
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
    getStatus(userId) {
        return firebase.database().ref('users/' + userId + '/status').on('value', resp => {
            return resp.val();
          });
    }
    getServerUrl(): String {
        return this.SERVER_URL;
    }

    getS3(): String {
        return this.s3;
    }

    async sendToast(color, message, position) {
        const toast = await this.toastController.create({
            color: color,
            message: message,
            position: position,
            duration: 2000
        });
        toast.present();
    }
}

// web sdk app id : 4285e1dddbcc81686f098e4a4103c5dba75eadb57345643549b3707b6e317124254d33e311521a0c