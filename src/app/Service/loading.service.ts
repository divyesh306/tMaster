import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    loader: any;
    isLoading = false;
    // loader: HTMLIonLoadingElement;
    constructor(public loadingCtrl: LoadingController) {
    }

    // Show the loader for infinite time
    showLoader() {
        this.loadingCtrl.create({
            message: 'Please wait...',
            duration: 10000,
        }).then((res) => {
            res.present().then(() => {
                if (!this.isLoading) {
                    res.dismiss();
                }
            });;
        });

    }

    // Hide the loader if already created otherwise return error
    hideLoader() {
        this.isLoading = false;
        this.loadingCtrl.dismiss().then((res) => {
            console.log('Loading dismissed!', res);
        }).catch((error) => {
            console.log('error', error);
        });

    }
}