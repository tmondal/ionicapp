import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { PostService } from '../../providers/post-service';



@Component({
  selector: 'page-newleague',
  templateUrl: 'newleague.html'
})
export class NewleaguePage {

	leaguename: any;
	fixtures: any[] = [];
	teams: any[] = [];
	users: any[] = [];
	teamone: any;
	teamtwo: any;
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
		}
	}
	onCancel(ev: any){
		ev.target.value = '';
	}
	addUsertoTeam(user,i){
		let u = {
			name: user.name,
			email: user.email,
			id: user.$key
		}
		this.teams.push(u);
		this.users.splice(i,1);
	}
	addFixture(){
		if (this.teamone && this.teamtwo && this.eventdate && this.venue) {
			
			let fixture = {
				teamone: this.teamone,
				teamtwo: this.teamtwo,
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
		else if (!this.fixtures[0]) {
			alert("Please create fixtures.");
		}
		else{
			this.postservice.createLeague(this.fixtures,this.leaguename,this.teams);
			this.leaguename = '';
			this.teamone = ''
			this.teamtwo = ''
			this.eventdate = '';
			this.venue = '';
		}
		
	}
}
