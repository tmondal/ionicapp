import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ttscore } from './ttscore';

@NgModule({
  declarations: [
    Ttscore,
  ],
  imports: [
    IonicPageModule.forChild(Ttscore),
  ],
  exports: [
    Ttscore
  ]
})
export class TtscoreModule {}
