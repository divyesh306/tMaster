import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {
  activeTab='Tag';
  constructor() { }

  ngOnInit() {
  }
  selectTab(tab){
    this.activeTab=tab;
  }
  toggleMenu(){

  }
}
