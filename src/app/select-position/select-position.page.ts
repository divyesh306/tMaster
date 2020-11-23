import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-position',
  templateUrl: './select-position.page.html',
  styleUrls: ['./select-position.page.scss'],
})
export class SelectPositionPage implements OnInit {

  constructor( private router:Router) { }

  ngOnInit() {
  }
  positionSelected(position){
    this.router.navigate(['/registration/'+position]);
  }
}
