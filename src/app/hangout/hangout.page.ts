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
  gender = '';
  user_type = '';
  sorting = {
    male: false,
    female: false,
    client: false,
    counslor: false,
  }
  user_list = [];
  tagList;
  filtertagList;
  s3Url;
  isItemAvailable = false;
  constructor(private router: Router, private localStorage: LocalstorageService,
    private userService: userService, private configService: configService, public loadingservice: LoadingService) {
    this.getTags();
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
    this.loadingservice.showLoader();
    this.userService.closeQuery(body).subscribe(result => {
      if (result['hasError']) {
        this.loadingservice.hideLoader();
        this.isItemAvailable = false;
      } else {
        this.user_list = this.splitKeyValue(result['data'].user_list);
        this.isItemAvailable = false;
        this.loadingservice.hideLoader();
      }
    }, err => {
      this.loadingservice.hideLoader();
      if (err['status'] == 401)
        this.router.navigate(['/verify-number']);
    })
  }
  selectItem(value) {
    this.search_term = value;
    this.getUsers(this.search_term, this.gender, this.user_type);
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
    this.loadingservice.hideLoader();
    return res;
  };

  getTags() {
    const body = {
      name: 'tags{id tag}'
    }
    this.userService.closeQuery(body).subscribe(result => {
      if (result['hasError']) {

      } else {
        this.tagList = result['data'].tags;
        this.filtertagList = result['data'].tags;
      }
    }, err => {
    })
  }

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
    var val = value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.filtertagList = this.tagList.filter((item) => {
        return (item.tag.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.isItemAvailable = false;
      this.getUsers('', '', '');
    }
  }
  categoryDetail(userList, userassets) {
    this.localStorage.set('categoryUser', userList);
    if (this.localStorage.get('categoryUser'))
      this.router.navigate(['tabs/letstalknow/' + userassets]);
  }
  calculateAge(bdate) {
    const dobDate = new Date(bdate);
    const todayDate = new Date();
    const ageyear = todayDate.getFullYear() - dobDate.getFullYear();
    return ageyear;
  }
}
