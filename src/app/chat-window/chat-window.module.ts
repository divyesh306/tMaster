import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatWindowPageRoutingModule } from './chat-window-routing.module';

import { ChatWindowPage } from './chat-window.page';
import { VideoNoticeComponent } from '../component/video-notice/video-notice.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatWindowPageRoutingModule
  ],
  declarations: [ChatWindowPage,VideoNoticeComponent],
  entryComponents:[VideoNoticeComponent]
})
export class ChatWindowPageModule {}
