import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Organizing } from './organizing';

@NgModule({
  declarations: [
    Organizing,
  ],
  imports: [
    IonicPageModule.forChild(Organizing),
  ],
  exports: [
    Organizing
  ]
})
export class OrganizingModule {}
