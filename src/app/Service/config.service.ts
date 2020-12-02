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

    async sendTost(color,message, position) {
        const toast = await this.toastController.create({
            color: color,
            message: message,
            position: position,
            duration: 2000
        });
        toast.present();
    }
}