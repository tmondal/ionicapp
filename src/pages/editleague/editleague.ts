import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { PostService } from '../../providers/post-service';


@IonicPage()
@Component({
  selector: 'page-editleague',
  templateUrl: 'editleague.html',
})
export class Editleague {

	league: any;
	leagueid: any;
	leaguename: any;
	sporttype: any;
	teams: any[] = [];
	removedteams: any[] = [];
	users: any[] = [];
	datasearched: boolean = false;
	found: boolean = false;
	fixtures: any[] = [];
	removeindices: any[] = [];
	teamone: any;
	teamtwo: any;
	venue: any;
	eventdate: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public authservice: AuthService,
		public postservice: PostService
	) {	
		this.league = this.navParams.get("league");
		this.fixtures = this.league.fixtures;
		if (this.league.teams) {			
			this.teams = this.league.teams;
		}
		this.leaguename = this.league.leaguename;
		this.sporttype = this.league.sporttype;
	}

	removeTeam(i){
		this.removedteams.push(this.teams[i].id);
		this.removeFixturebyname(this.teams[i].name); 
		this.teams.splice(i,1);
	}
	onInput(ev:any){
		let data = ev.target.value;
		if (data && data.trim() != '') {
			this.datasearched = true;
			this.authservice.getuserbyName(data).subscribe(users =>{
				if (users.length) {
					this.found = true;					
					this.users = users;
				}else{
					this.found = false;
				}
			})
		}else{
			this.datasearched = false;
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
		if (this.teamone && this.teamtwo && this.eventdate && this.venue) {
			
			let fixture = {
				teamone: this.teamone,
				teamtwo: this.teamtwo,
				eventdate: this.eventdate,
				venue: this.venue
			}
			this.fixtures.push(fixture);
		}else{
			alert('Don\'t be lazy :) \n Please enter all fields.');
		}
	}
	removeFixture(i){
		this.fixtures.splice(i,1);
	}
	removeFixturebyname(name: any){
		let length = this.fixtures.length;
		for (let i = 0; i < length; i++) {
			if (this.fixtures[i].teamone == name || this.fixtures[i].teamtwo == name) {
				this.fixtures[i] = 0;
			}
		}
		for (let i = 0; i < length; i++) {
			if (this.fixtures[i] == 0) {				
				this.fixtures.splice(i,1);
			}
		}
	}
	updateLeague(){
		if (!this.leaguename) {
			alert("League name can't be emppty.");
		}
		else if (!this.sporttype) {
			alert("Please change sporttype or keep as before.");
		}
		else if (!this.fixtures[0]) {
			alert("Please create fixtures.");
		}
		else{
			this.postservice.updateLeague(
				this.league.$key,
				this.leaguename,
				this.sporttype,
				this.teams,
				this.fixtures,
				this.removedteams
			);
		}
	}
}
