import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlocklistPageRoutingModule } from './blocklist-routing.module';

import { BlocklistPage } from './blocklist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlocklistPageRoutingModule
  ],
  declarations: [BlocklistPage]
})
export class BlocklistPageModule {}
