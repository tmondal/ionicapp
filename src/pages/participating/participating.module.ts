import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Participating } from './participating';

@NgModule({
  declarations: [
    Participating,
  ],
  imports: [
    IonicPageModule.forChild(Participating),
  ],
  exports: [
    Participating
  ]
})
export class ParticipatingModule {}
