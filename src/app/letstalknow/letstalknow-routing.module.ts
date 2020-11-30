import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LetstalknowPage } from './letstalknow.page';

const routes: Routes = [
  {
    path: '',
    component: LetstalknowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LetstalknowPageRoutingModule {}
