import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-clubprofile',
  templateUrl: 'clubprofile.html'
})
export class ClubprofilePage {

	clubprofile: String = "allposts";
	userId: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams
	) { 
		this.userId = this.navParams.get("userId");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ClubprofilePage');
	}
}
