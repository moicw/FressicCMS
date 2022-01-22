import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MytracksPageRoutingModule } from './mytracks-routing.module';

import { MytracksPage } from './mytracks.page';
import { HeaderComponent } from '../../component/header/header.component';
import { ImageCropperModule } from 'ngx-image-cropper';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    MytracksPageRoutingModule
  ],
  declarations: [MytracksPage,HeaderComponent]
})
export class MytracksPageModule {}
