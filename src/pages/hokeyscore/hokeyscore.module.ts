import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Hokeyscore } from './hokeyscore';

@NgModule({
  declarations: [
    Hokeyscore,
  ],
  imports: [
    IonicPageModule.forChild(Hokeyscore),
  ],
  exports: [
    Hokeyscore
  ]
})
export class HokeyscoreModule {}
