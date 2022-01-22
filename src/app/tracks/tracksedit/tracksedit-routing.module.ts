import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackseditPage } from './tracksedit.page';

const routes: Routes = [
  {
    path: '',
    component: TrackseditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackseditPageRoutingModule {}
