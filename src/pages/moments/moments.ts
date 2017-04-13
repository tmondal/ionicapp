import { Component, Input} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-moments',
  templateUrl: 'moments.html'
})
export class MomentsPage {

	 @Input() userId: any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {}

	ionViewDidLoad() {
	console.log('ionViewDidLoad MomentsPage');
	}

}
