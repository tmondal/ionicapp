import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Mapdistance } from './mapdistance';

@NgModule({
  declarations: [
    Mapdistance,
  ],
  imports: [
    IonicPageModule.forChild(Mapdistance),
  ],
  exports: [
    Mapdistance
  ]
})
export class MapdistanceModule {}
