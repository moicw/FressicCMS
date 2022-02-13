import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailtemplatePageRoutingModule } from './emailtemplate-routing.module';

import { EmailtemplatePage } from './emailtemplate.page';
import { HeaderComponent } from '../../component/header/header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailtemplatePageRoutingModule
  ],
  declarations: [EmailtemplatePage,HeaderComponent]
})
export class EmailtemplatePageModule {}
