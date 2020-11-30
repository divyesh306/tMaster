import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BugreportPageRoutingModule } from './bugreport-routing.module';

import { BugreportPage } from './bugreport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BugreportPageRoutingModule
  ],
  declarations: [BugreportPage]
})
export class BugreportPageModule {}
