import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-usereditopts',
  templateUrl: 'usereditopts.html'
})
export class UsereditoptsPage {

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public authservice: AuthService
	) {}

	onEditProfile(){
		this.viewCtrl.dismiss();
		this.navCtrl.push(EditProfilePage);
	}

	onLogout(){
		this.viewCtrl.dismiss();
		this.authservice.logoutUser().then(()=>{
			this.navCtrl.setRoot(LoginPage);
		});
	}

}
