import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	email: any;
	password: any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public authservice: AuthService
	) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	onloginClick(){
		this.authservice.loginUser(this.email,this.password).then(userdata => {
			this.navCtrl.setRoot(HomePage);
		},error =>{
			console.log(error);
		});
	}
	onsignupClick(){
		this.navCtrl.push(SignupPage);
	}

}
