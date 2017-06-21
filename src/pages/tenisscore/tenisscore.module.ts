import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tenisscore } from './tenisscore';

@NgModule({
  declarations: [
    Tenisscore,
  ],
  imports: [
    IonicPageModule.forChild(Tenisscore),
  ],
  exports: [
    Tenisscore
  ]
})
export class TenisscoreModule {}
