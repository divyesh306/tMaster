import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    // loader: any;
    // loader: HTMLIonLoadingElement;
    constructor(public loadingCtrl: LoadingController) {
    }
    async present() {
        let loader = await this.loadingCtrl.create();
        loader.present();
    }
    async dismiss() {
        // await this.loader.dismiss();
        this.loadingCtrl.getTop().then(loader => {
            if (loader) {
                loader.dismiss();
            }
        });
    }
}