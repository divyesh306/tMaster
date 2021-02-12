import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'hangout',
        loadChildren: () => import('../hangout/hangout.module').then(m => m.HangoutPageModule)
      },
      {
        path: 'message',
        loadChildren: () => import('../message/message.module').then(m => m.MessagePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'videolist-category',
        loadChildren: () => import('../videolist-category/videolist-category.module').then( m => m.VideolistCategoryPageModule)
      },
      {
        path: 'video-detail/:userId',
        loadChildren: () => import('../video-detail/video-detail.module').then( m => m.VideoDetailPageModule)
      },
      {
        path: 'letstalknow/:userAssets',
        loadChildren: () => import('../letstalknow/letstalknow.module').then( m => m.LetstalknowPageModule)
      },
      {
        path: '',
        redirectTo: 'tabs/hangout',
        pathMatch: 'full'
      }
    ]
  },
  // {
  //   path: '',
  //   redirectTo: '/tabs/hangout',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
