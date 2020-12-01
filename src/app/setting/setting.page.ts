import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }
  blockList(){
    this.router.navigate(['/blocklist']);
  }
  selectLanguages(){
    this.router.navigate(['/language']);
  }
  bugReport(){
    this.router.navigate(['/bugreport']);
  }
  deleteAccount(){
    this.router.navigate(['/delete-account']);
  }
}
