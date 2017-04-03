import { Component , OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login'; 


@Component({
  selector: 'page-clubprofile',
  templateUrl: 'clubprofile.html'
})
export class ClubprofilePage implements OnInit{

	userId: any;
	authuid: any;
	following: boolean;
	followingservice: any;
	clubprofile: String = "relatedposts";
	constructor(
		public navCtrl: NavController, 
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
		this.followingservice = this.authservice.checkiffollowing(this.userId).subscribe(user=>{
			this.following = user.following;
		});
	}
	ngOnInit(){}
	ngOnDestroy(){
		this.followingservice.unsubscribe();
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad ClubprofilePage');
	}
	compareUser(){
		if(this.authuid == this.userId) {
			return true;
		}else{
			return false;
		}
	}
	onLogout(){
    	this.authservice.logoutUser().then(()=>{
    		this.navCtrl.setRoot(LoginPage);
    	});
  	}
  	sameuser(){
  		if(this.userId == this.authuid) {
  			return true;
  		}else{
  			return false;
  		}
  	}
  	follow(){
  		this.authservice.followuser(this.userId);
  	}
  	unfollow(){
  		this.authservice.unfollowuser(this.userId);
  	}
}
