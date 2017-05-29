import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-newleague',
  templateUrl: 'newleague.html'
})
export class NewleaguePage {

	matches: any[] = [];
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams
	) {}
	
}
