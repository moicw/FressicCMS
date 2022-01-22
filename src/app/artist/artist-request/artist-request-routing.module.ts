import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistRequestPage } from './artist-request.page';

const routes: Routes = [
  {
    path: '',
    component: ArtistRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtistRequestPageRoutingModule {}
