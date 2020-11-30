import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuycoinsPage } from './buycoins.page';

const routes: Routes = [
  {
    path: '',
    component: BuycoinsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuycoinsPageRoutingModule {}
