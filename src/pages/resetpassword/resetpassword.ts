import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams,ToastController } from 'ionic-angular';
import * as firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html'
})
export class Resetpassword {

	email: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController
	) {}

	
	onReset(){
		firebase.auth().sendPasswordResetEmail(this.email).then(()=>{
			alert("Reset email sent.Follow the link there");
			this.navCtrl.pop();
		},(err)=>{
			// show error message
			let errorcode = err.name;
			let errmessage = err.message;
			if(errorcode == 'auth/invalid-email' ) {
				this.showToast("Invalid email :(")
			}
			else if(errorcode == 'auth/user-not-found') {
				this.showToast("User not found :(")
			}else{
				this.showToast(errmessage);
			}
		});
	}
	showToast(message){
	    let toast = this.toastCtrl.create({
	      message: message,
	      duration: 3000
	    });
	    toast.present();
	}
	onCancel(){
		this.navCtrl.pop();
	}
}
