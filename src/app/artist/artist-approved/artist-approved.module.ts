import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtistApprovedPageRoutingModule } from './artist-approved-routing.module';

import { ArtistApprovedPage } from './artist-approved.page';
import { HeaderComponent } from '../../component/header/header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtistApprovedPageRoutingModule
  ],
  declarations: [ArtistApprovedPage,HeaderComponent]
})
export class ArtistApprovedPageModule {}
