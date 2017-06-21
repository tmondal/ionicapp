import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Userprofile } from './userprofile';
import { Parallaxprofile } from '../../components/parallaxprofile/parallaxprofile';


@NgModule({
  declarations: [
    Userprofile,
    Parallaxprofile,
  ],
  imports: [
    IonicPageModule.forChild(Userprofile),
  ],
  exports: [
    Userprofile
  ]
})
export class UserprofileModule {}
