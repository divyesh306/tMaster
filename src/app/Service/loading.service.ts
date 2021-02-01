import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    loader: any;
    // loader: HTMLIonLoadingElement;
    constructor(public loadingCtrl: LoadingController) {
    }
    async present() {
        this.loader = await this.loadingCtrl.create({
<<<<<<< HEAD
            message: 'Please wait...'
=======
            message: 'Please wait...',
            duration: 10000
>>>>>>> 9cdcaf15267104939cae72ee3524fb164e240105
        });
        await this.loader.present();
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