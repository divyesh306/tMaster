import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
    path: 'register-complete',
    loadChildren: () => import('./register-complete/register-complete.module').then( m => m.RegisterCompletePageModule)
  },
  {
    path: 'buycoins',
    loadChildren: () => import('./buycoins/buycoins.module').then( m => m.BuycoinsPageModule)
  },
  {
    path: 'exchangecoins',
    loadChildren: () => import('./exchangecoins/exchangecoins.module').then( m => m.ExchangecoinsPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'blocklist',
    loadChildren: () => import('./blocklist/blocklist.module').then( m => m.BlocklistPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'bugreport',
    loadChildren: () => import('./bugreport/bugreport.module').then( m => m.BugreportPageModule)
  },
  {
    path: 'delete-account',
    loadChildren: () => import('./delete-account/delete-account.module').then( m => m.DeleteAccountPageModule)
  },
  {
    path: 'chat-window',
    loadChildren: () => import('./chat-window/chat-window.module').then( m => m.ChatWindowPageModule)
  },   {
    path: 'video-chat',
    loadChildren: () => import('./video-chat/video-chat.module').then( m => m.VideoChatPageModule)
  },
     
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
