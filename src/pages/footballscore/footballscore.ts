import { Component, OnInit } from '@angular/core';
import { IonicPage,NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-footballscore',
  templateUrl: 'footballscore.html',
})
export class Footballscore implements OnInit{

	currentuserId: any;
	username: any;
	userimage: any;
	authsubscription: any;

	posttype: any = 'score';
	sporttype: any = 'football';
	teamone: any = null;
	goalone: any = 0;
	yellowcardone: any = 0;
	redcardone: any = 0;
	goalscorerone: any = null;
	
	teamtwo: any = null;
	goaltwo: any = 0;
	yellowcardtwo: any = 0;
	redcardtwo: any = 0;
	goalscorertwo: any = null;

	likes: any = 0;
	dislikes: any = 0;
	comments: any = 0;

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public af: AngularFire,
		public postservice: PostService,
		public authservice: AuthService
	) {}
	ngOnInit(){
		this.authsubscription = this.authservice.getmyprofile().subscribe(user =>{
			this.currentuserId = user.$key;
			this.username = user.name;
			this.userimage = user.profileimage;
		});
	}

	ngOnDestroy(){
		this.authsubscription.unsubscribe();
	}

	footballScore(){

		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			username: this.username,
			userimage: this.userimage,
			posttype: this.posttype,
			sporttype: this.sporttype,
			teamone: this.teamone,
			goalone: this.goalone,
			yellocardone: this.yellowcardone,
			redcardone: this.redcardone,
			goalscorerone: this.goalscorerone,
			teamtwo: this.teamtwo,
			goaltwo: this.goaltwo,
			yellocardtwo: this.yellowcardtwo,
			redcardtwo: this.redcardtwo,
			goalscorertwo: this.goalscorertwo,
			likes: this.likes,
			dislikes: this.dislikes,
			comments: this.comments,
		}
		if (!this.teamone && !this.teamtwo) {
			alert("Teams name can't be empty..");
		}else if (!this.userimage) {
			alert('Please edit your profile image..');
		}else if (!this.username) {
			alert("Please edit your name..");
		}else{			
			this.viewCtrl.dismiss();
			this.postservice.simplePost(post);
		}
	}
	onDismiss(){
		this.viewCtrl.dismiss();
	}
}
