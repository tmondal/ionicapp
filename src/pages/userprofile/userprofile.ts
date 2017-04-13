import { Component , OnInit} from '@angular/core';
import { NavController, NavParams ,PopoverController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { EditProfilePage } from '../edit-profile/edit-profile'; 
// import { AchievePage } from '../achieve/achieve';
// import { ClubplayersPage } from '../clubplayers/clubplayers';
// import { FollowersPage } from '../followers/followers';
// import { FollowingsPage } from '../followings/followings';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html'
})
export class UserprofilePage implements OnInit{

	userId: any;

	usertype: any = null;
	name: any = null;
	contactno: any = null;
	currentclub: any = null;
	useremail: any = null;
	coverimage: any = null;
	profileimage: any = null;

	authuid: any;
	following: boolean;
	followingservice: any;
	userservice: any;
	getfollowers: any;
	getfollowings: any;
	countfollowers: any;
	countfollowings: any;

	clubprofile: String = "moments";
	playerprofile: String = "moments";

	
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public af: AngularFire,
		public authservice: AuthService
	) {}
	
	ngOnInit(){
		this.af.auth.subscribe(user=>{
			if(user) {
				this.authuid = user.auth.uid;				
			}
		});
		this.userId = this.navParams.get("userId");

		this.getfollowers = this.authservice.getFollowers(this.userId).subscribe(users=>{
			console.log("Followers: ");
			console.log(users);
			this.countfollowers = users.length;
		});
		this.getfollowings = this.authservice.getFollowings(this.userId).subscribe(users=>{
			console.log("Followings: ");
			console.log(users);
			this.countfollowings = users.length;
		});

		this.authservice.checkIffollowing(this.userId).subscribe(user=>{
			this.following = user.following;
		});
		this.authservice.getuserbyId(this.userId).subscribe(user =>{
			this.usertype = user.usertype;
			this.name = user.name;
			this.contactno = user.contactno;
			this.currentclub = user.currentclub;
			this.useremail = user.email;
			this.coverimage = user.coverimage;
			this.profileimage = user.profileimage;
		});
	}
	
	ngOnDestroy(){
		this.getfollowers.unsubscribe();
		this.getfollowings.unsubscribe();
	}
	
	compareusertype(){
		if(this.usertype == "player") {
			return true;
		}else{
			return false;
		}
	}
	
  	sameuser(){
  		if(this.userId == this.authuid) {
  			return true;
  		}else{
  			return false;
  		}
  	}
  	follow(){
  		this.following = true;
  		this.authservice.followuser(this.userId);
  	}
  	unfollow(){
  		this.following = false;
  		this.authservice.unfollowuser(this.userId);
  	}
  	onEditProfile(){
		this.navCtrl.push(EditProfilePage);
	}
  	onLogout(){
  		this.navCtrl.pop();
		this.authservice.logoutUser().then(()=>{
			this.navCtrl.setRoot(LoginPage);
		});
	}
}
