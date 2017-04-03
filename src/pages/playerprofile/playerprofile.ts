import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClubprofilePage} from '../clubprofile/clubprofile';
import { LoginPage } from '../login/login';
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-playerprofile',
  templateUrl: 'playerprofile.html'
})
export class PlayerprofilePage implements OnInit{

	userservice: any;
	authuid: any;
	userId: any;
	useremail: any;
	playerprofile: String = "relatedposts";
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public af: AngularFire, 
		public authservice: AuthService
	) {
		this.af.auth.subscribe(user=>{
			if(user) {
				this.authuid = user.auth.uid;
				console.log("Current userid: " + user.auth.uid);				
			}
		});
		this.userId = this.navParams.get("userId");
		console.log("Pararmeter userId : " + this.userId);
	}
	ngOnInit(){
		this.userservice = this.authservice.getuserbyId(this.userId).subscribe(user =>{
			this.useremail = user.email;
			console.log(user);
		});
	}
	ngOnDestroy(){
		this.userservice.unsubscribe();
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad PlayerprofilePage');
	}
	compareUser(){
		if(this.authuid == this.userId) {
			return true;
		}else{
			return false;
		}
	}
	onClubClick(){
  		this.navCtrl.push(ClubprofilePage);
  	}
  	onLogout(){
    	this.authservice.logoutUser().then(()=>{
    		this.navCtrl.setRoot(LoginPage);
    	});
  	}
}
