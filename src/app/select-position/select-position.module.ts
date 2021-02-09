import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPositionPageRoutingModule } from './select-position-routing.module';

import { SelectPositionPage } from './select-position.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPositionPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [SelectPositionPage]
})
export class SelectPositionPageModule {}
