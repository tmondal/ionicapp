import { Component ,OnInit} from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { PostService } from '../../providers/post-service';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-createleague',
  templateUrl: 'createleague.html',
})
export class Createleague implements OnInit{

	username: any;
	userimage: any;

	leaguename: any;
	sporttype: any;
	fixtures: any[] = [];
	teams: any[] = [];
	users: any[] = [];
	datasearched: boolean = false;
	found: boolean = false;
	teamoneid: any;
	teamtwoid: any;
	eventdate: any;
	venue: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public authservice: AuthService,
		public postservice: PostService,
	) {}
	
	ngOnInit(){
		this.authservice.getmyprofile().subscribe(user=>{
	      this.username = user.name;
	      this.userimage = user.profileimage;
	      if (!this.username && !this.userimage) {
			alert("Please update profile before doing anything.\nSo that others can recognize you");
	      }
	    });
	}

	removeTeam(i,email){
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
		if (this.teams[this.teamoneid].name && this.teams[this.teamtwoid].name && this.eventdate && this.venue) {
			
			let evtdate = moment(this.eventdate).format("Do MMM YY");			
			let fixture = {
				teamone: this.teams[this.teamoneid].name,
				teamoneid: this.teams[this.teamoneid].id,
				teamtwo: this.teams[this.teamtwoid].name,
				teamtwoid: this.teams[this.teamtwoid].id,
				eventdate: evtdate,
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

	publishLeague(){
		if (this.userimage && this.username) {			
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
		else{
			alert("Please update profile before doing anything.\nSo that others can recognize you");
		}
	}
}
