import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackseditPageRoutingModule } from './tracksedit-routing.module';

import { TrackseditPage } from './tracksedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackseditPageRoutingModule
  ],
  declarations: [TrackseditPage]
})
export class TrackseditPageModule {}
