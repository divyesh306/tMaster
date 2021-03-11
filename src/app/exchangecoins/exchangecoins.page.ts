import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { configService } from '../Service/config.service';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-exchangecoins',
  templateUrl: './exchangecoins.page.html',
  styleUrls: ['./exchangecoins.page.scss'],
})
export class ExchangecoinsPage implements OnInit {
  method='bank_transfer';
  exchangeComplete=false;
  exchangeData;
  exchangeCoin;
  userCoins;
  coinForm: FormGroup;
  isSubmitted=false;

  constructor(private userService: userService,
    private localStorage:LocalstorageService,
    private configService: configService,
    public formBuilder: FormBuilder,
    private loading: LoadingService) { 
      let userData=this.localStorage.get('userDetail');
      this.userCoins=userData.coins;
      this.coinForm = this.formBuilder.group({
        coin:['',[Validators.required,Validators.max(this.userCoins)]],
        amount:['',Validators.required],
        method: ['',Validators.required],
        bank_name: ['',Validators.required],
        bank: ['',Validators.required],
        branch: ['',Validators.required],
        account_number: ['',Validators.required],
        paypal_name: ['',Validators.required],
        paypal_email: ['',[Validators.required,Validators.pattern("^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$")]]
      });
    }

  ngOnInit() {
  }

  get errorControl() {
    return this.coinForm.controls;
  }
  changeBankOption(event){
    this.method=event.target.value;
  }
  apply(){
    this.isSubmitted=true;
    this.exchangeData=this.coinForm.value;
    this.exchangeData.coin = this.exchangeData.coin.toString();
    this.exchangeData.amount = this.exchangeData.amount.toString();
    this.exchangeData.account_number = this.exchangeData.account_number.toString();
    console.log(this.exchangeData);
 
    const mutation = {
      name: 'add_exchange_request',
      inputtype: 'ExchangeRequestInputType',
      data: this.exchangeData
    }
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].add_exchange_request;
      this.loading.hideLoader();
      if (!res.hasError) {
           this.coinForm.patchValue({
            coin:'',
            amount:'',
            method: '',
            bank_name: '',
            bank: '',
            branch: '',
            account_number: '',
            paypal_name: '',
            paypal_email: ''
    });
    this.exchangeComplete=true;

        this.configService.sendToast('success', result['message'], 'bottom');
      } else {

      }
    }, err => {
      this.loading.hideLoader();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }
}
