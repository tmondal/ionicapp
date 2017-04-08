import { Component , OnInit} from '@angular/core';
import { NavController, NavParams ,PopoverController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { UsereditoptsPage } from '../usereditopts/usereditopts'; 


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
		public popoverCtrl: PopoverController,
		public af: AngularFire,
		public authservice: AuthService
	) { 
		this.af.auth.subscribe(user=>{
			if(user) {
				this.authuid = user.auth.uid;				
			}
		});
		this.userId = this.navParams.get("userId") || this.authuid; // Default current user
		this.usertype = this.navParams.get("usertype");
	}
	ngOnInit(){
		this.followingservice = this.authservice.checkiffollowing(this.userId).subscribe(user=>{
			this.following = user.following;
		});
		this.userservice = this.authservice.getuserbyId(this.userId).subscribe(user =>{
			this.useremail = user.email;
		});
	}
	ngOnDestroy(){
		this.userservice.unsubscribe();
		this.followingservice.unsubscribe();
	}
	onusereditopts(myEvent){
	    let popover = this.popoverCtrl.create(UsereditoptsPage);
	    popover.present({
	      ev: myEvent
	    });
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
