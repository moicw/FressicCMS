import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TracksaddPageRoutingModule } from './tracksadd-routing.module';

import { TracksaddPage } from './tracksadd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TracksaddPageRoutingModule
  ],
  declarations: [TracksaddPage]
})
export class TracksaddPageModule {}
