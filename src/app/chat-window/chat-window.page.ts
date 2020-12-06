import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, PopoverController } from '@ionic/angular';
import { VideoNoticeComponent } from '../component/video-notice/video-notice.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.page.html',
  styleUrls: ['./chat-window.page.scss'],
})
export class ChatWindowPage implements OnInit {
  openModal=false;
  fileOption=false;
  constructor(public router:Router,
    public popoverController: PopoverController,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
  }
  openCoinModal(){
    this.openModal=!this.openModal;
  }
  closeCoinModal(){
    this.openModal=false;
  }
  openFileOption(){
    this.fileOption=!this.fileOption;
  }
  async videoCall(ev:any){
      const popover = await this.popoverController.create({
        component: VideoNoticeComponent,
        event: ev,
        translucent: true,
        componentProps:{
          onClick:()=>{
            this.router.navigate(['/video-chat']);
          }
        }
      });
      return await popover.present();
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Add favorite',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Release',
        role: 'destructive',
        handler: () => {
          console.log('DeleReleasete clicked');
        }
      }, {
        text: 'Block',
        handler: () => {
          console.log('Block clicked');
        }
      }, {
        text: 'Report',
        handler: () => {
          console.log('Report');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
