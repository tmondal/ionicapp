import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import { EmailValidator } from '../../validators/email';



@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class Signup {

	signupform: FormGroup;

	email: any = null;
	password: any = null;
	repassword: any = null;
	usertype: any = null;
	loading: any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public formbuilder: FormBuilder,
		public authservice: AuthService
	) {
		this.signupform = this.formbuilder.group({
			email: ["", [Validators.required, EmailValidator.isValid]],
			password: ["",[Validators.required , Validators.minLength(6)]],
			repassword: ["",Validators.required]
		});
	}

	matchPassword(){
		if(this.signupform.value.password == this.signupform.value.repassword) {
			return true;
		}else{
			return false;
		}
	}
	oncreateUser(){
		this.loading = this.loadingCtrl.create({content: "Requesting server..."});
		this.loading.present();

		if(this.signupform.invalid) {
			this.loading.dismiss().then(()=>{
				this.showOkAlert("Please enter valid data..");
			});
		}else{
			this.authservice.signupUser(this.signupform.value.email, this.signupform.value.password,this.usertype).then(() =>{
				this.loading.dismiss().then(()=>{
					this.authservice.getmyprofile().subscribe(me =>{
						if (!me.guideseen) {							
							this.navCtrl.setRoot('Guide');
						}else{
							this.navCtrl.setRoot('Home');
						}
					})
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

	onCancel(){
		this.navCtrl.pop();
	}

}

