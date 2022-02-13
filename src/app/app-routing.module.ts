import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'tracks',
    loadChildren: () => import('./tracks/tracks/tracks.module').then( m => m.TracksPageModule)
  },
  {
    path: 'tracksadd',
    loadChildren: () => import('./tracks/tracksadd/tracksadd.module').then( m => m.TracksaddPageModule)
  },
  {
    path: 'tracksedit',
    loadChildren: () => import('./tracks/tracksedit/tracksedit.module').then( m => m.TrackseditPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'artist-request',
    loadChildren: () => import('./artist/artist-request/artist-request.module').then( m => m.ArtistRequestPageModule)
  },
  {
    path: 'artist-approved',
    loadChildren: () => import('./artist/artist-approved/artist-approved.module').then( m => m.ArtistApprovedPageModule)
  },
  {
    path: 'mytracks',
    loadChildren: () => import('./tracks/mytracks/mytracks.module').then( m => m.MytracksPageModule)
  },
  {
    path: 'emailtemplate',
    loadChildren: () => import('./settings/emailtemplate/emailtemplate.module').then( m => m.EmailtemplatePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
