import { Component , OnInit} from '@angular/core';
import { ElementRef,Renderer } from '@angular/core';
import { IonicPage,NavController, NavParams ,PopoverController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { PostService } from '../../providers/post-service';



@IonicPage()
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html'
})
export class Userprofile implements OnInit{

	userId: any;

	usertype: any;
	name: any;
	contactno: any;
	currentclub: any;
	useremail: any;
	coverimage: any;
	profileimage: any;
	sportname: any;

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

	scrollcontent: any;
	parallaxheader: any;
	parallaxcontent: any;

	myposts: any;
	myleagues: any;
	participate: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public popoverCtrl: PopoverController,
		public af: AngularFire,
		public authservice: AuthService,
		public postservice: PostService,
		public elementRef: ElementRef,
		public renderer: Renderer
	) {}
	
	ngOnInit(){
		this.af.auth.subscribe(user=>{
			if(user) {
				this.authuid = user.auth.uid;				
			}
		});
		this.userId = this.navParams.get("userId");

		this.getfollowers = this.authservice.getFollowers(this.userId).subscribe(users=>{
			this.countfollowers = users.length;
		});
		this.getfollowings = this.authservice.getFollowings(this.userId).subscribe(users=>{
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
			this.sportname = user.sportname;
			this.useremail = user.email;
			this.coverimage = user.coverimage;
			this.profileimage = user.profileimage;
		});
		this.postservice.getOrganizedLeagues(this.userId).subscribe(leagues =>{
			this.myleagues = leagues;
		});
		this.postservice.getParticipatingLeagues(this.userId).subscribe(leagues =>{
			this.participate = leagues;
		});
		this.postservice.getFeedbyId(this.userId).subscribe(posts =>{
			this.myposts = posts;
		})
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
		this.navCtrl.push("Editprofile");
	}
  	onLogout(){
  		this.navCtrl.pop();
		this.authservice.logoutUser().then(()=>{
			this.navCtrl.setRoot("Login");
		});
	}
}
