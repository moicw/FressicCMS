import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtistRequestPageRoutingModule } from './artist-request-routing.module';

import { ArtistRequestPage } from './artist-request.page';
import { HeaderComponent } from '../../component/header/header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtistRequestPageRoutingModule
  ],
  declarations: [ArtistRequestPage,HeaderComponent]
})
export class ArtistRequestPageModule {}
