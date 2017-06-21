import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Mypost } from './mypost';

@NgModule({
  declarations: [
    Mypost,
  ],
  imports: [
    IonicPageModule.forChild(Mypost),
  ],
  exports: [
    Mypost
  ]
})
export class MypostModule {}
