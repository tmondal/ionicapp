import { Component , OnInit} from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { UserprofilePage } from '../../pages/userprofile/userprofile';


@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage implements OnInit {

	rules: any;
	criteria: any;
	userservice: any;
	coverimage: any;
	postid: any;
	participating: any;
	participated: boolean;
	participateservice: any;
	userId: any;
	totalservice: any;
	totalparticipators: any;
	users: any;
	username: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController,
		private postservice: PostService,
		public authservice : AuthService
	) {
		this.rules = navParams.get("rules");
		this.criteria = navParams.get("criteria");
		this.participating = navParams.get("participating");
		this.postid = navParams.get("postid");
		this.userId = navParams.get("userId");
	}
	ngOnInit(){		
		this.participateservice = this.postservice.getParticipated(this.postid).subscribe(user=>{
			this.participated = user.participated;
		});
		this.userservice = this.authservice.getuserbyId(this.userId).subscribe((user)=>{
			this.coverimage = user.coverimage;
			this.username = user.name;
		});
	}
	ngOnDestroy(){
		this.participateservice.unsubscribe();
		this.userservice.unsubscribe();
	}
	onCancel(){
		this.viewCtrl.dismiss();
	}
	onAccept(){
		this.participated = true;
		this.participating += 1;
		this.postservice.updateParticipated(this.postid,this.participated);
		this.postservice.updateParticipating(this.postid,this.participating);
		this.viewCtrl.dismiss();
	}
	onDecline(){
		this.participating -= 1;
		this.participated = false;
		this.postservice.removeParticipated(this.postid,this.participated);
		this.postservice.updateParticipating(this.postid,this.participating);
	}

	onUsernameClick(userId){
    	this.navCtrl.push(UserprofilePage,{userId: userId});
  	}
}
