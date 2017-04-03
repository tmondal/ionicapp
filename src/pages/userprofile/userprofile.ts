import { Component , OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login'; 


@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html'
})
export class UserprofilePage implements OnInit{

	userId: any;
	usertype: any;
	authuid: any;
	following: boolean;
	useremail: any;
	followingservice: any;
	userservice: any;
	clubprofile: String = "relatedposts";
	playerprofile: String = "relatedposts";
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
		this.userId = this.navParams.get("userId") || this.authuid;
		this.usertype = this.navParams.get("usertype");
		console.log("Pararmeter userId : " + this.userId);
	}
	ngOnInit(){
		this.userservice = this.authservice.getuserbyId(this.userId).subscribe(user =>{
			this.useremail = user.email;
			console.log(user);
		});
		this.followingservice = this.authservice.checkiffollowing(this.userId).subscribe(user=>{
			this.following = user.following;
		});
	}
	ngOnDestroy(){
		this.userservice.unsubscribe();
		this.followingservice.unsubscribe();
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad ClubprofilePage');
	}
	compareusertype(){
		if(this.usertype == "player") {
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
