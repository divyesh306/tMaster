import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangecoinsPageRoutingModule } from './exchangecoins-routing.module';

import { ExchangecoinsPage } from './exchangecoins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExchangecoinsPageRoutingModule
  ],
  declarations: [ExchangecoinsPage]
})
export class ExchangecoinsPageModule {}
