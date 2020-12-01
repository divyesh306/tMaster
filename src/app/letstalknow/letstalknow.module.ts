import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LetstalknowPageRoutingModule } from './letstalknow-routing.module';

import { LetstalknowPage } from './letstalknow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LetstalknowPageRoutingModule
  ],
  declarations: [LetstalknowPage]
})
export class LetstalknowPageModule {}
