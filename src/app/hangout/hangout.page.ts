import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hangout',
  templateUrl: './hangout.page.html',
  styleUrls: ['./hangout.page.scss'],
})
export class HangoutPage implements OnInit {
  menuOpen=false;
  searchModal=false;
  constructor(private router:Router) { }

  ngOnInit() {
  }
  toggleMenu(){
    this.menuOpen=!this.menuOpen;
     }
   close(){
     this.menuOpen=false;
   }
   onSearch(value){
    console.log(value);
      this.searchModal=true;
   }
  result(){

  }
  categoryDetail(){
    this.router.navigate(['tabs/letstalknow']);
  }
}
