import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hangout',
  templateUrl: './hangout.page.html',
  styleUrls: ['./hangout.page.scss'],
})
export class HangoutPage implements OnInit {
  menuOpen=false;
  constructor() { }

  ngOnInit() {
  }
  toggleMenu(){
    this.menuOpen=!this.menuOpen;
  }
   close(){
     this.menuOpen=false;
   }
  result(){

  }
}
