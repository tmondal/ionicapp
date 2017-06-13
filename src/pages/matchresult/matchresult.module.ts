import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Matchresult } from './matchresult';

@NgModule({
  declarations: [
    Matchresult,
  ],
  imports: [
    IonicPageModule.forChild(Matchresult),
  ],
  exports: [
    Matchresult
  ]
})
export class MatchresultModule {}
