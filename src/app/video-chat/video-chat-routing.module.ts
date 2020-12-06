import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoChatPage } from './video-chat.page';

const routes: Routes = [
  {
    path: '',
    component: VideoChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoChatPageRoutingModule {}
