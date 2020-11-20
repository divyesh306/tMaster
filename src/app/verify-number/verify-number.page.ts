import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from "@ionic/core";
@Component({
  selector: 'app-verify-number',
  templateUrl: './verify-number.page.html',
  styleUrls: ['./verify-number.page.scss'],
})
export class VerifyNumberPage implements OnInit {
  public selectedCountry='United States';
  public temp=[];
  public countries=['United States',  'United States Minor Outlying Islands',  'Uruguay',  'Uzbekistan',  'Vanuatu',  'Venezuela, Bolivarian Republic of',  'Viet Nam',  'Virgin Islands, British',  'Virgin Islands, U.S.',  'Wallis and Futuna',  'Western Sahara',  'Yemen', 'Zambia',  'Zimbabwe'];
  selectBoxOpen=false;
  constructor(private pickerController:PickerController,
    private router:Router) { }

  ngOnInit() {
  }
  // selectOption(){
  //   this.selectBoxOpen = !this.selectBoxOpen;
  // }
  optionSelected(option){
    this.selectedCountry=option;
    this.selectBoxOpen=false;
  }

  async selectOption() {
    this.selectBoxOpen = !this.selectBoxOpen;
     let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Ok',
          handler:(data:any) => {
            this.temp=[]=Object.values(data);
            this.selectedCountry=this.temp[0].value;
            this.selectBoxOpen=false; 
             console.log(this.temp[0].value);
          }
        }
      ],
      columns:[{
        name:'Countries',
        options:this.getColumnOptions()
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  getColumnOptions(){
    let options = [];
    this.countries.forEach(x => {
      options.push({text:x,value:x});
    });
    return options;
  }
  next(){
    this.router.navigate(['/phone-verification']);
  }
}
  