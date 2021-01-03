import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyNumberPageRoutingModule } from './verify-number-routing.module';

import { VerifyNumberPage } from './verify-number.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyNumberPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [VerifyNumberPage]
})
export class VerifyNumberPageModule {}
