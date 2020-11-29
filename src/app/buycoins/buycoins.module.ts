import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuycoinsPageRoutingModule } from './buycoins-routing.module';

import { BuycoinsPage } from './buycoins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuycoinsPageRoutingModule
  ],
  declarations: [BuycoinsPage]
})
export class BuycoinsPageModule {}
