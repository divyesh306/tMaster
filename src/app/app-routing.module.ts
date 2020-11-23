import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'verify-number',
    loadChildren: () => import('./verify-number/verify-number.module').then( m => m.VerifyNumberPageModule)
  },
  {
    path: 'phone-verification',
    loadChildren: () => import('./phone-verification/phone-verification.module').then( m => m.PhoneVerificationPageModule)
  },
  {
    path: 'select-position',
    loadChildren: () => import('./select-position/select-position.module').then( m => m.SelectPositionPageModule)
  },
  {
    path: 'registration/:position',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'register-form',
    loadChildren: () => import('./register-form/register-form.module').then( m => m.RegisterFormPageModule)
  },
  {
    path: 'register-complete',
    loadChildren: () => import('./register-complete/register-complete.module').then( m => m.RegisterCompletePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
