import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { configService } from '../Service/config.service';
import { LocalstorageService } from '../Service/localstorage.service';

@Component({
  selector: 'app-letstalknow',
  templateUrl: './letstalknow.page.html',
  styleUrls: ['./letstalknow.page.scss'],
})
export class LetstalknowPage implements OnInit {
  openSelectOption = false;
  user_list = [];
  s3Url;
  constructor(private navCtrl: NavController, private configService: configService, private localStorage: LocalstorageService, private router: Router) {
    this.user_list = this.localStorage.get('categoryUser');
    this.s3Url = this.configService.getS3();
  }

  ngOnInit() {
  }
  goBack() {
    this.localStorage.remove('categoryUser');
    this.navCtrl.back();
  }
  gotoProfile(selectuser) {
    this.router.navigate(['tabs/video-detail/' + selectuser.id]);
    this.localStorage.set('selectedUser', selectuser);
  }
  selectOption() {
    this.openSelectOption = !this.openSelectOption;
  }
  calculateAge(bdate) {
    var dobDate = new Date(bdate);
    var todayDate = new Date();
    var ageyear = todayDate.getFullYear() - dobDate.getFullYear();
    return ageyear;
  }
  videoDetails() { }
}
