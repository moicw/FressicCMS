import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TracksaddPage } from './tracksadd.page';

const routes: Routes = [
  {
    path: '',
    component: TracksaddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TracksaddPageRoutingModule {}
