import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Createpost } from './createpost';
import { Footballscore } from '../footballscore/footballscore';
import { Cricketscore } from '../cricketscore/cricketscore';
import { Hokeyscore } from '../hokeyscore/hokeyscore';
import { Badmintonscore } from '../badmintonscore/badmintonscore';
import { Tenisscore } from '../tenisscore/tenisscore';
import { Ttscore } from '../ttscore/ttscore';

@NgModule({
  declarations: [
    Createpost,
    Footballscore,
    Cricketscore,
    Hokeyscore,
    Badmintonscore,
    Tenisscore,
    Ttscore
  ],
  imports: [
    IonicPageModule.forChild(Createpost),
  ],
  exports: [
    Createpost
  ]
})
export class CreatepostModule {}
