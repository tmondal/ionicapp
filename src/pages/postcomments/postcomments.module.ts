import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Postcomments } from './postcomments';

@NgModule({
  declarations: [
    Postcomments,
  ],
  imports: [
    IonicPageModule.forChild(Postcomments),
  ],
  exports: [
    Postcomments
  ]
})
export class PostcommentsModule {}
