import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home } from './home';

import { Youtube } from '../../pipes/youtube';

@NgModule({
  declarations: [
    Home,
    Youtube,
  ],
  imports: [
    IonicPageModule.forChild(Home),
  ],
  exports: [
    Home
  ]
})
export class HomeModule {}
