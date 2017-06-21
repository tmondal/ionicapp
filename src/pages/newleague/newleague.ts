import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { PostService } from '../../providers/post-service';


@IonicPage()
@Component({
  selector: 'page-newleague',
  templateUrl: 'newleague.html'
})
export class Newleague {

	leaguename: any;
	sporttype: any;
	fixtures: any[] = [];
	teams: any[] = [];
	users: any[] = [];
	teamoneid: any;
	teamtwoid: any;
	eventdate: any;
	venue: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public authservice: AuthService,
		public postservice: PostService
	) {}
	
	removeTeam(i){
		this.teams.splice(i,1);
	}
	onInput(ev:any){
		let data = ev.target.value;
		if (data && data.trim() != '') {
			this.authservice.getuserbyName(data).subscribe(users =>{
				if (users) {					
					this.users = users;
				}else{
					console.log("No record found");
				}
			})
		}else{
			this.users = [];
		}
	}

	addUsertoTeam(user,i){
		let found = false;
		for (let i = 0; i < this.teams.length; i++) {
			if (this.teams[i].id == user.$key) {
				found = true;
			}
		}
		if (!found) {			
			let u = {
				name: user.name,
				email: user.email,
				id: user.$key
			}
			this.teams.push(u);
			this.users.splice(i,1);
		}else{
			this.users.splice(i,1);
			alert("Already a member.");
		}
	}

	addFixture(){
		if (this.teams[this.teamoneid].name && this.teams[this.teamtwoid].name && this.eventdate && this.venue) {
			
			let fixture = {
				teamone: this.teams[this.teamoneid].name,
				teamoneid: this.teams[this.teamoneid].id,
				teamtwo: this.teams[this.teamtwoid].name,
				teamtwoid: this.teams[this.teamtwoid].id,
				eventdate: this.eventdate,
				venue: this.venue
			}
			this.fixtures.push(fixture);
		}else{
			alert('Don\'t be lazy :) \n Please enter all field.');
		}
	}
	removeFixture(i){
		this.fixtures.splice(i,1);
	}

	publishLeague(){
		if (!this.leaguename) {
			alert("Please enter league name.");
		}
		else if (!this.sporttype) {
			alert("Please mention sporttype.");
		}
		else if (!this.fixtures[0]) {
			alert("Please create fixtures.");
		}
		else{
			this.postservice.createLeague(this.fixtures,this.leaguename,this.sporttype,this.teams);
			this.leaguename = '';
			this.sporttype = '';
			this.eventdate = '';
			this.venue = '';
			this.teams = [];
			this.fixtures = [];
		}
		
	}
}

