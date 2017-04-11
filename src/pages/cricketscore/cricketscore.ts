import { Component,Input,OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-cricketscore',
  templateUrl: 'cricketscore.html'
})
export class CricketscorePage implements OnInit{

	@Input() cricketarray: any;

	currentuserId: any;

	teamone: any;
	teamtwo: any;
	runsscored: any;
	wickets: any;
	overs: any;
	tosswon: any;
	elected: any;
	testno: any;
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
		});
	}
	ngOnDestroy(){
		this.authsubscription.unsubscribe();
	}
	
	odiScore(){
		let post = {
			userId: this.currentuserId,
			posttype: this.cricketarray[0],
			sporttype: this.cricketarray[1],
			crickettype: this.cricketarray[2],
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
		this.postservice.scoreAndMatchPost(post,this.currentuserId);
		this.viewCtrl.dismiss();
	}
	onDismiss(){
		this.viewCtrl.dismiss();
	}
}
