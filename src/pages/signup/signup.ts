import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../../pages/home/home';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {


	email: any;
	password: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public authservice: AuthService
	) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
	}
	oncreateUser(){
		this.authservice.signupUser(this.email, this.password).then(() =>{
			this.navCtrl.setRoot(HomePage);
		},error =>{
			console.log(error);
		});
	}

}
