import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-videocallreceive',
  templateUrl: './videocallreceive.component.html',
  styleUrls: ['./videocallreceive.component.scss'],
})
export class VideocallreceiveComponent implements OnInit {
  @Input() onClick=()=>{};
  constructor(private popoverCtrl:PopoverController) { }

  ngOnInit() {}
  
  receive(){
    this.popoverCtrl.dismiss();
    this.onClick();
  }
  decline(){
    this.popoverCtrl.dismiss();
  }
}
