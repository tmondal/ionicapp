import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Updatelocation } from './updatelocation';

@NgModule({
  declarations: [
    Updatelocation,
  ],
  imports: [
    IonicPageModule.forChild(Updatelocation),
  ],
  exports: [
    Updatelocation
  ]
})
export class UpdatelocationModule {}
