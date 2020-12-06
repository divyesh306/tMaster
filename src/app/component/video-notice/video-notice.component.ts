import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-video-notice',
  templateUrl: './video-notice.component.html',
  styleUrls: ['./video-notice.component.scss'],
})
export class VideoNoticeComponent implements OnInit {
  wantToVideoChat=false;
  @Input() onClick=()=>{};
  constructor(private popoverCtrl:PopoverController) { }

  ngOnInit() {}
  acceptNotice(){
    this.wantToVideoChat=true;
  }
  start(){
    this.popoverCtrl.dismiss();
    this.onClick();
  }
  cancel(){
    this.popoverCtrl.dismiss();
  }
}
