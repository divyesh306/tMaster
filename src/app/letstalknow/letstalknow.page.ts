import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  sortlistUser;
  sortOption = 'Sort by popular';
  userFilterName;
  s3Url;
  constructor(private navCtrl: NavController,
    private configService: configService,
    private localStorage: LocalstorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.user_list = this.localStorage.get('categoryUser');
    this.sorting('Sort by popular',this.user_list,'favorite_user_count');
    this.s3Url = this.configService.getS3();
    this.activatedRoute.params.subscribe(params => {
      this.userFilterName = params['userAssets'];
    })
  }

  ngOnInit() {
  }
  sorting(type,userlist, filed) {
    this.sortOption = type;
    this.sortlistUser =  userlist.sort((a, b) => 0 - (a[filed] > b[filed] ? -1 : 1));
    this.openSelectOption = false;
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
