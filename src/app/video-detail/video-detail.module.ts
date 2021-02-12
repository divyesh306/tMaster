import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoDetailPageRoutingModule } from './video-detail-routing.module';

import { VideoDetailPage } from './video-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { SwipeModule } from '../swipe/swipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoDetailPageRoutingModule,
    TranslateModule.forChild(),
    SwipeModule
  ],
  declarations: [VideoDetailPage]
})
export class VideoDetailPageModule {}
