import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideolistCategoryPageRoutingModule } from './videolist-category-routing.module';

import { VideolistCategoryPage } from './videolist-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideolistCategoryPageRoutingModule
  ],
  declarations: [VideolistCategoryPage]
})
export class VideolistCategoryPageModule {}
