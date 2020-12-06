import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  activeTab='Know';
  openSelectOption=false;
  sortOption='Sort by popular';
  constructor(public router:Router) { }

  ngOnInit() {
  }
  selectTab(tab){
    this.activeTab=tab;
  }
  optionSelected(option){
    this.sortOption=option;
    this.openSelectOption=false;
  }
  selectOption(){
    this.openSelectOption=!this.openSelectOption;
  }
}
