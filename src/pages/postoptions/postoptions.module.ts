import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Postoptions } from './postoptions';

@NgModule({
  declarations: [
    Postoptions,
  ],
  imports: [
    IonicPageModule.forChild(Postoptions),
  ],
  exports: [
    Postoptions
  ]
})
export class PostoptionsModule {}
