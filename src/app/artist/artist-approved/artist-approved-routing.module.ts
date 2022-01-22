import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistApprovedPage } from './artist-approved.page';

const routes: Routes = [
  {
    path: '',
    component: ArtistApprovedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtistApprovedPageRoutingModule {}
