import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-number',
  templateUrl: './verify-number.page.html',
  styleUrls: ['./verify-number.page.scss'],
})
export class VerifyNumberPage implements OnInit {
  public selectedCountry='United States';
  selectOpen=false;
  constructor() { }

  ngOnInit() {
  }
  selectOption(){
    this.selectOpen = !this.selectOpen;
  }
  optionSelected(option){
    this.selectedCountry=option;
    this.selectOpen=false;
  }
}
