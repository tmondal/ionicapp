import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-clubprofile',
  templateUrl: 'clubprofile.html'
})
export class ClubprofilePage {

	clubprofile: String = "allposts";
	constructor(public navCtrl: NavController, public navParams: NavParams) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ClubprofilePage');
	}
}
