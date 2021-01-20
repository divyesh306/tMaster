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
  user_list = [];
  s3Url;
  constructor(private router: Router, private localStorage: LocalstorageService,
    private userService: userService, private configService: configService, private loading: LoadingService) {
    this.localStorage.get('userDetail');
    this.getUsers('', '', '');
    this.s3Url = this.configService.getS3();
    if (this.localStorage.get('selectedUser'))
      this.localStorage.remove('selectedUser');
  }

  ngOnInit() {
    this.localStorage.get('userDetail');
    if (this.localStorage.get('selectedUser'))
      this.localStorage.remove('selectedUser');
    this.getUsers('', '', '');
  }

  ionViewDidEnter() {
    this.localStorage.get('userDetail');
    if (this.localStorage.get('selectedUser'))
      this.localStorage.remove('selectedUser');
    this.getUsers('', '', '');
  }

  selectGender(gender) {
    if (!this.gender || this.gender === undefined || this.gender == '')
      this.gender = gender;
    else
      this.gender = (gender == this.gender ? '' : (this.gender != gender ? '' : gender));

    console.log("Gemder : ", this.gender);
  }

  selectType(type) {
    if (!this.user_type || this.user_type === undefined || this.user_type == '')
      this.user_type = type;
    else
      this.user_type = (type == this.user_type ? '' : (this.user_type != type ? '' : type));

    console.log("Type : ", this.user_type);
  }

  getUsers(search_terms, gender, type) {
    const body = {
      name: 'user_list(search_term:"' + search_terms + '" ,gender:"' + gender + '",type:"' + type + '")'
    }
    // this.loading.present();
    this.userService.closeQuery(body).subscribe(result => {
      console.log("Result : ", result['status'])
      // this.loading.dismiss();
      if (result['hasError']) {
        
      } else {
        // this.loading.dismiss();
        this.user_list = this.splitKeyValue(result['data'].user_list);
        console.log("User List : ", this.user_list);
      }
    }, err => {
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
    return res;
  };
  gotoProfile(selectuser) {
    this.router.navigate(['tabs/video-detail/' + selectuser.id]);
    this.localStorage.set('selectedUser', selectuser);
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
  categoryDetail(userList) {
    this.localStorage.set('categoryUser', userList);
    if (this.localStorage.get('categoryUser'))
      this.router.navigate(['tabs/letstalknow']);
  }
  calculateAge(bdate) {
    const dobDate = new Date(bdate);
    const todayDate = new Date();
    const ageyear = todayDate.getFullYear() - dobDate.getFullYear();
    return ageyear;
  }
}
