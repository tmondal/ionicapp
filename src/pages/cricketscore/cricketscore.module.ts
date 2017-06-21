import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Cricketscore } from './cricketscore';

@NgModule({
  declarations: [
    Cricketscore,
  ],
  imports: [
    IonicPageModule.forChild(Cricketscore),
  ],
  exports: [
    Cricketscore
  ]
})
export class CricketscoreModule {}
