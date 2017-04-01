import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClubprofilePage} from '../clubprofile/clubprofile';
import { LoginPage } from '../login/login';

import { Authdata } from '../../providers/authdata';

@Component({
  selector: 'page-playerprofile',
  templateUrl: 'playerprofile.html'
})
export class PlayerprofilePage {

	clubprofile: String = "allposts";
	constructor(public navCtrl: NavController, 
		public navParams: NavParams, 
		public authdata: Authdata
	) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PlayerprofilePage');
	}
	onClubClick(){
  		this.navCtrl.push(ClubprofilePage);
  	}
  	onLogout(){
    	this.authdata.logoutUser().then(()=>{
    		this.navCtrl.setRoot(LoginPage);
    	});
  	}
}
