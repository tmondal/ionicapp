import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Badmintonscore } from './badmintonscore';

@NgModule({
  declarations: [
    Badmintonscore,
  ],
  imports: [
    IonicPageModule.forChild(Badmintonscore),
  ],
  exports: [
    Badmintonscore
  ]
})
export class BadmintonscoreModule {}
