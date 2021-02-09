import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { configService } from '../Service/config.service';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-hangout',
  templateUrl: './hangout.page.html',
  styleUrls: ['./hangout.page.scss'],
})
export class HangoutPage implements OnInit {
  menuOpen = false;
  searchModal = false;
  search_term = '';
  gender;
  user_type = '';
  sorting = {
    male: false,
    female: false,
    client: false,
    counslor: false,
  }
  user_list = [];
  s3Url;
  constructor(private router: Router, private localStorage: LocalstorageService,
    private userService: userService, private configService: configService, public loadingservice: LoadingService) {

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.localStorage.get('userDetail');
    this.s3Url = this.configService.getS3();
    if (this.localStorage.get('selectedUser'))
      this.localStorage.remove('selectedUser');
    this.getUsers('', '', '');
  }

  selectGender(gender) {
    if (gender == 'male') this.sorting.male ? this.sorting.male = false : this.sorting.male = true;
    if (gender == 'female') this.sorting.female ? this.sorting.female = false : this.sorting.female = true;

    if (this.sorting.male && this.sorting.female || !this.sorting.male && !this.sorting.female) this.gender = '';
    else if (this.sorting.male && !this.sorting.female) this.gender = 'male';
    else if (!this.sorting.male && this.sorting.female) this.gender = 'female';
  }

  selectType(type) {
    if (type == 'user') this.sorting.client ? this.sorting.client = false : this.sorting.client = true;
    if (type == 'counselor') this.sorting.counslor ? this.sorting.counslor = false : this.sorting.counslor = true;

    if (this.sorting.client && this.sorting.counslor || !this.sorting.client && !this.sorting.counslor) this.user_type = '';
    else if (this.sorting.client && !this.sorting.counslor) this.user_type = 'user';
    else if (!this.sorting.client && this.sorting.counslor) this.user_type = 'counselor';
  }

  getUsers(search_terms, gender, type) {
    const body = {
      name: 'user_list(search_term:"' + search_terms + '" ,gender:"' + gender + '",type:"' + type + '")'
    }
    this.loadingservice.present();
    this.userService.closeQuery(body).subscribe(result => {
      if (result['hasError']) {
        this.loadingservice.dismiss();
      } else {
        this.user_list = this.splitKeyValue(result['data'].user_list);
        console.log("User List : ", this.user_list);
      }
    }, err => {
      this.loadingservice.dismiss();
      if (err['status'] == 401)
        this.router.navigate(['/verify-number']);
    })
  }
  splitKeyValue = (obj) => {
    const keys = Object.keys(obj);
    const res = [];
    for (let i = 0; i < keys.length; i++) {
      res.push({
        'asset': keys[i],
        'data': obj[keys[i]]
      });
    };
    this.loadingservice.dismiss();
    return res;
  };
  gotoProfile(selectuser, userList) {
    this.router.navigate(['tabs/video-detail/' + selectuser.id]);
    this.localStorage.set('selectedUser', selectuser);
    this.localStorage.set('categoryUser', userList);
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  close() {
    if (!this.user_list.length)
      this.getUsers('', '', '');

    this.menuOpen = false;
  }
  onSearch(value) {
    console.log(value);
    this.search_term = value;
    // this.searchModal = true;
  }
  categoryDetail(userList,userassets) {
    this.localStorage.set('categoryUser', userList);
    if (this.localStorage.get('categoryUser'))
      this.router.navigate(['tabs/letstalknow/'+userassets]);
  }
  calculateAge(bdate) {
    const dobDate = new Date(bdate);
    const todayDate = new Date();
    const ageyear = todayDate.getFullYear() - dobDate.getFullYear();
    return ageyear;
  }
}
