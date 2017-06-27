import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Guide } from './guide';

@NgModule({
  declarations: [
    Guide,
  ],
  imports: [
    IonicPageModule.forChild(Guide),
  ],
  exports: [
    Guide
  ]
})
export class GuideModule {}
