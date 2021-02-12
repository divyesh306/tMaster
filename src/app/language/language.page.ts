import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { LocalstorageService } from '../Service/localstorage.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  language = "";
  constructor(private localstorage: LocalstorageService,
    public appCOmponent: AppComponent) {
    let selectedLanguage = this.localstorage.get('selectedLanguage');
    if (selectedLanguage != {} || selectedLanguage != null) {
      this.language = selectedLanguage;
    }
  }

  ngOnInit() {
  }
  changeLanguage(ev) {
    this.language = ev.target.value;
    this.localstorage.set('selectedLanguage', this.language);
    this.appCOmponent.changeLanguage(this.language);
  }
  
}
