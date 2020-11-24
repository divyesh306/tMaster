import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HangoutPage } from './hangout.page';

const routes: Routes = [
  {
    path: '',
    component: HangoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HangoutPageRoutingModule {}
