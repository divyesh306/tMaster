import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPositionPage } from './select-position.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPositionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPositionPageRoutingModule {}
