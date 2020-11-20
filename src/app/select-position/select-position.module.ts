import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPositionPageRoutingModule } from './select-position-routing.module';

import { SelectPositionPage } from './select-position.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPositionPageRoutingModule
  ],
  declarations: [SelectPositionPage]
})
export class SelectPositionPageModule {}
