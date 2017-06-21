import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Footballscore } from './footballscore';

@NgModule({
  declarations: [
    Footballscore,
  ],
  imports: [
    IonicPageModule.forChild(Footballscore),
  ],
  exports: [
    Footballscore
  ]
})
export class FootballscoreModule {}
