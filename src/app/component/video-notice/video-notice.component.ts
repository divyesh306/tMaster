import { Component, Input, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-video-notice',
  templateUrl: './video-notice.component.html',
  styleUrls: ['./video-notice.component.scss'],
})
export class VideoNoticeComponent implements OnInit {
  wantToVideoChat = false;
  @Input() onClick = () => { };
  user: any;
  constructor(private popoverCtrl: PopoverController, private navParams: NavParams) {
    this.user = this.navParams.get('user');
  }

  ngOnInit() { }
  acceptNotice() {
    this.wantToVideoChat = true;
  }
  start() {
    this.popoverCtrl.dismiss();
    this.onClick();
  }
  cancel() {
    this.popoverCtrl.dismiss();
  }
}
