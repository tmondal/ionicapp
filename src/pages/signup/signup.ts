import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Authdata } from '../../providers/authdata';
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
		public authdata: Authdata
	) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
	}
	oncreateUser(){
		this.authdata.signupUser(this.email, this.password).then(userdata =>{
			this.navCtrl.setRoot(HomePage);
		},error =>{
			console.log(error);
		});
	}

}
