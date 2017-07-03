import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Newuserguide } from './newuserguide';

@NgModule({
  declarations: [
    Newuserguide,
  ],
  imports: [
    IonicPageModule.forChild(Newuserguide),
  ],
  exports: [
    Newuserguide
  ]
})
export class NewuserguideModule {}
