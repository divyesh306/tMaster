import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.page.html',
    styleUrls: ['./register-form.page.scss'],
})
export class RegisterFormPage implements OnInit {
    title = "";
    constructor(private navCtrl: NavController) {
        this.title = localStorage.getItem('formTitle');
    }

    ngOnInit() { }
    ionViewWillEnter() {
        this.title = localStorage.getItem('formTitle');
    }
    save() {
        this.navCtrl.back();
    }
    goBack() {
        this.navCtrl.back();
    }
}
