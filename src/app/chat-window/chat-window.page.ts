import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { VideoNoticeComponent } from '../component/video-notice/video-notice.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.page.html',
  styleUrls: ['./chat-window.page.scss'],
})
export class ChatWindowPage implements OnInit {
  openModal=false;
  constructor(public popoverController: PopoverController) { }

  ngOnInit() {
  }
  openCoinModal(){
    this.openModal=!this.openModal;
  }
  closeCoinModal(){
    this.openModal=false;
  }
  async videoCall(ev:any){
      const popover = await this.popoverController.create({
        component: VideoNoticeComponent,
        cssClass: 'my-custom-class',
        event: ev,
        translucent: true
      });
      return await popover.present();
  }
}
