import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Createleague } from './createleague';

@NgModule({
  declarations: [
    Createleague,
  ],
  imports: [
    IonicPageModule.forChild(Createleague),
  ],
  exports: [
    Createleague
  ]
})
export class CreateleagueModule {}
