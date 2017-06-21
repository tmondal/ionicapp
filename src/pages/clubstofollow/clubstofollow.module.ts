import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Clubstofollow } from './clubstofollow';

@NgModule({
  declarations: [
    Clubstofollow,
  ],
  imports: [
    IonicPageModule.forChild(Clubstofollow),
  ],
  exports: [
    Clubstofollow
  ]
})
export class ClubstofollowModule {}
