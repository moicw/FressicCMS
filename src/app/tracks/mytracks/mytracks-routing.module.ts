import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MytracksPage } from './mytracks.page';

const routes: Routes = [
  {
    path: '',
    component: MytracksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MytracksPageRoutingModule {}
