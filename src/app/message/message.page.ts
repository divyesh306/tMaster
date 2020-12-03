import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  openSelectOption=false;
  constructor() { }

  ngOnInit() {
  }
  selectOption(){
    this.openSelectOption=!this.openSelectOption;
  }
}
