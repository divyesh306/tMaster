import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private router: Router, private localStorage: LocalstorageService) {
    const userdetail = this.localStorage.get("userDetail");
    if (this.localStorage.getsingel('loginToken')) {
      this.router.navigate(['/tabs/hangout']);
    }
    else {
      
    }
  }

  ngOnInit() {
  }
  accept() {
    this.router.navigate(['/verify-number']);
  }
}