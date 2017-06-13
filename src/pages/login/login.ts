import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { ResetpasswordPage } from '../resetpassword/resetpassword';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	loading: any;
	loginform: FormGroup;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public formbuilder: FormBuilder,
		public authservice: AuthService
	) {
		// Initialize with null 
		this.loginform = this.formbuilder.group({
			email: ["", [Validators.required, EmailValidator.isValid]],
			password: ["",[Validators.required , Validators.minLength(6)]]
		});
	}
	
	onloginClick(){

		this.loading = this.loadingCtrl.create({content: "Requesting server..."});
		this.loading.present();

		if(this.loginform.invalid) {
			this.loading.dismiss().then(()=>{
				this.showOkAlert("Please enter valid data..");
			});

		}else{			
			this.authservice.loginUser(this.loginform.value.email ,this.loginform.value.password).then(userdata => {
				this.loading.dismiss().then(()=>{
					this.navCtrl.setRoot(HomePage);
				});
			},(error) =>{
				this.loading.dismiss().then(()=>{
					this.showOkAlert(error);
				});
			});
		}
	}
	showOkAlert(message){
		let alert = this.alertCtrl.create({
			message: message,
			buttons: [
				{
					text: "Ok",
					role: 'cancel'
				}
			]
		});
		alert.present();
	}
	onsignupClick(){
		this.navCtrl.push(SignupPage);
	}
	forgotPassword(){
		this.navCtrl.push(ResetpasswordPage);
	}
}
