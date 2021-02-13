import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideolistCategoryPage } from './videolist-category.page';

const routes: Routes = [
  {
    path: '',
    component: VideolistCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideolistCategoryPageRoutingModule {}
