import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangecoinsPage } from './exchangecoins.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangecoinsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangecoinsPageRoutingModule {}
