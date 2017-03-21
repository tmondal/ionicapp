import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClubprofilePage} from '../clubprofile/clubprofile';



@Component({
  selector: 'page-playerprofile',
  templateUrl: 'playerprofile.html'
})
export class PlayerprofilePage {

	clubprofile: String = "allposts";
	constructor(public navCtrl: NavController, public navParams: NavParams) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PlayerprofilePage');
	}
	onClubClick(){
  		this.navCtrl.push(ClubprofilePage);
  	}

}
