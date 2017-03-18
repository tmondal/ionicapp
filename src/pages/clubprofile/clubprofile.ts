import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllpostsPage } from '../allposts/allposts';
import { MomentsPage } from '../moments/moments';
import { AchievePage } from '../achieve/achieve';


@Component({
  selector: 'page-clubprofile',
  templateUrl: 'clubprofile.html'
})
export class ClubprofilePage {


	constructor(public navCtrl: NavController, public navParams: NavParams) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ClubprofilePage');
	}
}
