import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Resetpassword } from './resetpassword';

@NgModule({
  declarations: [
    Resetpassword,
  ],
  imports: [
    IonicPageModule.forChild(Resetpassword),
  ],
  exports: [
    Resetpassword
  ]
})
export class ResetpasswordModule {}
