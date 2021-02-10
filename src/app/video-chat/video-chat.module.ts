import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoChatPageRoutingModule } from './video-chat-routing.module';

import { VideoChatPage } from './video-chat.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoChatPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [VideoChatPage]
})
export class VideoChatPageModule { }
