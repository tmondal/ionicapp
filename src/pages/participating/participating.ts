import { Component, OnInit } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import { Calendar } from '@ionic-native/calendar';
import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-participating',
  templateUrl: 'participating.html',
  providers: [Calendar]
})
export class Participating implements OnInit{


	leagues: any;
	userid: any;
	usertype: any;
	tempfixture: any[] = [];
	fixtures: any[] = [];
	clicked: boolean[] = [false];
	userservice: any;
	participating: any[] = [];
	posttime: any[] = [];
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService,
		public authservice: AuthService,
		public af: AngularFire,
		public calendar: Calendar
	) {
		this.userservice = this.af.auth.subscribe(user =>{
			this.userid = user.uid;
		});
	}

	ngOnInit(){
		this.authservice.getmyprofile().subscribe(me =>{
			this.usertype = me.usertype;
		});

		this.postservice.getParticipatingLeagues(this.userid).subscribe(leagues =>{
			this.leagues = leagues;
			for (let i = 0; i < leagues.length; i++) {
				this.postservice.getmyFixtures(this.leagues[i].$key,this.leagues[i].leagueadminid)
					.subscribe(fixtures =>{
						for (let j = 0; j < fixtures.length; j++) {
							if (fixtures[j].teamoneid == this.userid || fixtures[j].teamtwoid == this.userid) {
								this.tempfixture.push(fixtures[j]);
							}
						}
						this.fixtures.push(this.tempfixture);
						this.tempfixture = [];
					}
				);
			}
		});

		this.postservice.getparticipatedPost().subscribe(posts=>{
			posts.reverse();
			for (let i = 0;i <= posts.length - 1; i++) {
				this.postservice.getpostfromFeedbyid(posts[i].$key).subscribe(post=>{

					this.authservice.getuserbyId(post.userId).subscribe(user=>{
						if (user) {
							post.userimage = user.profileimage;
							post.username = user.name;
						}
						this.participating.push(post);
						this.posttime[i] = moment(post.created_at).fromNow();
					})
				})
			}
		})
	}

	ngOnDestroy(){
		this.userservice.unsubscribe();
	}

	remindMe(date){
		this.calendar.createCalendar('MyCalendar').then(
		  (msg) => { console.log(msg); },
		  (err) => { console.log(err); }
		);
	}
}
