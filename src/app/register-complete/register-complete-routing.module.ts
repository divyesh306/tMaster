import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterCompletePage } from './register-complete.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterCompletePageRoutingModule {}
