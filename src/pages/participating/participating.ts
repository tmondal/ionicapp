import { Component, OnInit } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AngularFire } from 'angularfire2';
import { Calendar } from '@ionic-native/calendar';



@IonicPage()
@Component({
  selector: 'page-participating',
  templateUrl: 'participating.html',
  providers: [Calendar]
})
export class Participating implements OnInit{


	leagues: any;
	userid: any;
	tempfixture: any[] = [];
	fixtures: any[] = [];
	clicked: boolean[] = [false];
	userservice: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService,
		public af: AngularFire,
		public calendar: Calendar
	) {
		this.userservice = this.af.auth.subscribe(user =>{
			this.userid = user.uid;
		});
	}

	ngOnInit(){
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
