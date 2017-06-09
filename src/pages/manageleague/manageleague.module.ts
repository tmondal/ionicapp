import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Manageleague } from './manageleague';

@NgModule({
  declarations: [
    Manageleague,
  ],
  imports: [
    IonicPageModule.forChild(Manageleague),
  ],
  exports: [
    Manageleague
  ]
})
export class ManageleagueModule {}
