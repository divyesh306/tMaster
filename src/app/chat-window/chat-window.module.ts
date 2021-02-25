import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatWindowPageRoutingModule } from './chat-window-routing.module';

import { ChatWindowPage } from './chat-window.page';
import { VideoNoticeComponent } from '../component/video-notice/video-notice.component';
import { TranslateModule } from '@ngx-translate/core';
import { VideocallreceiveComponent } from '../component/videocallreceive/videocallreceive.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatWindowPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ChatWindowPage,VideoNoticeComponent,VideocallreceiveComponent],
  entryComponents:[VideoNoticeComponent]
})
export class ChatWindowPageModule {}
