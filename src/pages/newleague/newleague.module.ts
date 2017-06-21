import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Newleague } from './newleague';

@NgModule({
  declarations: [
    Newleague,
  ],
  imports: [
    IonicPageModule.forChild(Newleague),
  ],
  exports: [
    Newleague
  ]
})
export class NewleagueModule {}
