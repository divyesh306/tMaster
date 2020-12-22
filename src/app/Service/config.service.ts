import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})
export class configService {
    SERVER_URL;
    constructor(public toastController: ToastController) {
        // this.SERVER_URL = "http://a830e2f6839a.ngrok.io/api/";
        this.SERVER_URL = "http://54.248.130.122:3008/api/";
    }
    getServerUrl(): String {
        return this.SERVER_URL;
    }

    async sendToast(color,message, position) {
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
