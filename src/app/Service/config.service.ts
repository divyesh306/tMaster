import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class configService {
    SERVER_URL;
    s3;
    socket;
    constructor(public toastController: ToastController) {
        this.socket = io("http://54.248.130.122:3008/");
        this.SERVER_URL = "http://54.248.130.122:3008/api/"; //live 
        // this.SERVER_URL = "http://192.168.1.69:3008/api/";
        this.s3 = "https://matukitestimg.s3.ap-south-1.amazonaws.com/" //https://matukitestimg.s3.ap-south-1.amazonaws.com/Profilevideo/20201231_171245.jpg
    }
    joincallroom(data) {
        this.socket.emit('join', data);
    }
    newMessageReceived() {
        let observable = new Observable<{ room_id: string, type: string }>(observer => {
            this.socket.on('videocall', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); }
        });
        return observable;
    }
    getServerUrl(): String {
        return this.SERVER_URL;
    }

    getSocket() {
        return this.socket;
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