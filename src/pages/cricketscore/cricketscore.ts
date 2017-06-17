import { Component,Input,OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import * as moment from 'moment';

@Component({
  selector: 'page-cricketscore',
  templateUrl: 'cricketscore.html'
})
export class CricketscorePage implements OnInit{

	@Input() crickettype: any;

	currentuserId: any;
	username: any = null;
	userimage: any = null;

	posttype: any = 'score';
	sporttype: any = 'cricket';
	teamone: any;
	teamtwo: any;
	runsscored: any = 0;
	wickets: any = 0;
	overs: any = 0;
	tosswon: any;
	elected: any;
	testno: any;
	battingteam: any;
	inningsno: any;
	likes: any = 0;
	dislikes: any = 0;
	comments: any = 0;
	authsubscription: any;

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
	
	odiScore(){
		
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			username: this.username,
			userimage: this.userimage,
			posttype: this.posttype,
			sporttype: this.sporttype,
			crickettype: this.crickettype,
			teamone: this.teamone,
			teamtwo: this.teamtwo,
			runsscored: this.runsscored,
			wickets: this.wickets,
			overs: this.overs,
			tosswon: this.tosswon,
			elected: this.elected,
			likes: this.likes,
			dislikes: this.dislikes,
			comments: this.comments,
		}
		
		if (!this.teamone && !this.teamtwo ) {
			alert("Teams name can't be empty..");
		}else if (!this.userimage) {
			alert('Please edit your profile image..');
		}else if (!this.username) {
			alert("Please edit your name..");
		}else if (this.runsscored == 0 && this.wickets == 0 && this.overs == 0) {
			alert("Let the game start ..\n Better select text/image post type..");
		}else{			
			this.viewCtrl.dismiss();
			this.postservice.simplePost(post);
		}
	}
	testScore(){

		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			username: this.username,
			userimage: this.userimage,
			posttype: this.posttype,
			sporttype: this.sporttype,
			crickettype: this.crickettype,
			testno: this.testno,
			inningsno: this.inningsno,
			teamone: this.teamone,
			teamtwo: this.teamtwo,
			battingteam: this.battingteam,
			runsscored: this.runsscored,
			wickets: this.wickets,
			likes: this.likes,
			dislikes: this.dislikes,
			comments: this.comments
		}

		if (!this.teamone && !this.teamtwo ) {
			alert("Teams name can't be empty..");
		}else if (!this.userimage) {
			alert('Please edit your profile image..');
		}else if (!this.username) {
			alert("Please edit your name..");
		}else if (this.runsscored == 0 && this.wickets == 0 && this.overs == 0) {
			alert("Let the game start ..\n Better select text/image post type..");
		}else{			
			this.viewCtrl.dismiss();
			this.postservice.simplePost(post);
		}
	
	}

	onDismiss(){
		this.viewCtrl.dismiss();
	}
}
