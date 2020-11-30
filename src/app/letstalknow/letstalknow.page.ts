import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-letstalknow',
  templateUrl: './letstalknow.page.html',
  styleUrls: ['./letstalknow.page.scss'],
})
export class LetstalknowPage implements OnInit {
  openSelectOption=false;
  constructor(private navCtrl:NavController) { }

  ngOnInit() {
  }
  goBack(){
    this.navCtrl.back();
  }
  selectOption(){
    this.openSelectOption=!this.openSelectOption;
  }
}
