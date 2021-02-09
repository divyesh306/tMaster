import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlocklistPageRoutingModule } from './blocklist-routing.module';

import { BlocklistPage } from './blocklist.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlocklistPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [BlocklistPage]
})
export class BlocklistPageModule {}
