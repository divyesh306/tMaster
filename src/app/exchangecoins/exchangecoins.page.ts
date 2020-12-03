import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchangecoins',
  templateUrl: './exchangecoins.page.html',
  styleUrls: ['./exchangecoins.page.scss'],
})
export class ExchangecoinsPage implements OnInit {
  selectedMethod='bank_transfer';
  exchangeComplete=false;
  constructor() { }

  ngOnInit() {
  }
  changeBankOption(event){
    console.log(event.target.value);
    this.selectedMethod=event.target.value;
  }
  apply(){
    this.exchangeComplete=true;
  }
}
