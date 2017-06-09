import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Editleague } from './editleague';

@NgModule({
  declarations: [
    Editleague,
  ],
  imports: [
    IonicPageModule.forChild(Editleague),
  ],
  exports: [
    Editleague
  ]
})
export class EditleagueModule {}
