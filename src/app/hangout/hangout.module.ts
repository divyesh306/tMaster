import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HangoutPageRoutingModule } from './hangout-routing.module';

import { HangoutPage } from './hangout.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HangoutPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [HangoutPage]
})
export class HangoutPageModule {}
