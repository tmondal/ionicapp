import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../../pages/home/home';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {


	email: any = null;
	password: any = null;
	repassword: any = null;
	usertype: any = null;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public authservice: AuthService
	) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
	}
	oncreateUser(){
		if(this.email && this.password && this.usertype) {
			this.authservice.signupUser(this.email, this.password,this.usertype).then(() =>{
				this.navCtrl.setRoot(HomePage);
			},error =>{
				console.log(error);
			});
		}else{
			alert("Enter all field kindly :(");
		}
	}
	onCancel(){
		this.navCtrl.pop();
	}

}
