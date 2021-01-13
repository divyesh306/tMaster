import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CloseVideoComponent } from '../component/close-video/close-video.component';
import { WarningComponent } from '../component/warning/warning.component';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.page.html',
  styleUrls: ['./video-chat.page.scss'],
})
export class VideoChatPage implements OnInit {
  closeEye=true;
  constructor( public popoverController: PopoverController,) { }

  ngOnInit() {
  }
  changeBeautifyOption(){
    this.closeEye=!this.closeEye;
  }
  async endCall(ev){
    const popover = await this.popoverController.create({
      component: CloseVideoComponent,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true,
      componentProps:{
        onClick:()=>{
        }
      }
    });
    return await popover.present();
    // const popover = await this.popoverController.create({
    //   component: WarningComponent,
    //   cssClass: 'warning-popover',
    //   event: ev,
    //   translucent: true,
    // });
    // return await popover.present();
  }
}
