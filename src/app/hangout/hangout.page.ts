import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  search_term=null;
  gender;
  user_list = [];
  constructor(private router: Router, private localStorage: LocalstorageService, private userService: userService) {
    this.localStorage.get('userDetail');
    this.localStorage.remove('selectedUser');
    this.getUsers(null,null);
  }

  ngOnInit() {
  }
  getUsers(search_term : string, gender:string) {
    const body = {
      name: 'user_list(search_term:"' + search_term + '" ,gender:"' + gender + '")'
    }
    this.userService.closeQuery(body).subscribe(result => {
      this.user_list = this.splitKeyValue(result['data'].user_list);
      console.log("User List : ", this.user_list);
    }, err => {
      console.log("Somthing Went Wrong : ", err)
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
    this.menuOpen = false;
  }
  onSearch(value) {
    console.log(value);
    this.search_term = value;
    // this.searchModal = true;
  }
  categoryDetail() {
    this.router.navigate(['tabs/letstalknow']);
  }
  calculateAge(bdate) {
    var dobDate = new Date(bdate);
    var todayDate = new Date();
    var ageyear = todayDate.getFullYear() - dobDate.getFullYear();
    return ageyear;
  }
}
