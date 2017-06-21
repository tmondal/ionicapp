import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Commentreply } from './commentreply';

@NgModule({
  declarations: [
    Commentreply,
  ],
  imports: [
    IonicPageModule.forChild(Commentreply),
  ],
  exports: [
    Commentreply
  ]
})
export class CommentreplyModule {}
