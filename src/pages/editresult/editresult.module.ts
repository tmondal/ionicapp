import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Editresult } from './editresult';

@NgModule({
  declarations: [
    Editresult,
  ],
  imports: [
    IonicPageModule.forChild(Editresult),
  ],
  exports: [
    Editresult
  ]
})
export class EditresultModule {}
