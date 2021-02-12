import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BugreportPage } from './bugreport.page';

const routes: Routes = [
  {
    path: '',
    component: BugreportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BugreportPageRoutingModule {}
