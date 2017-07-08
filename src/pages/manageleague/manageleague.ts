import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AngularFire } from 'angularfire2';



@IonicPage()
@Component({
  selector: 'page-manageleague',
  templateUrl: 'manageleague.html',
})
export class Manageleague implements OnInit{

	leagues: any;
	userid: any;
	userservice: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService,
		public af: AngularFire
	) {
		this.userservice = this.af.auth.subscribe(user =>{
			this.userid = user.uid;
		});
	}

	ngOnInit(){
		this.postservice.getOrganizedLeagues(this.userid).subscribe(leagues =>{
			this.leagues = leagues;
		})
	}
	ngOnDestroy(){
		this.userservice.unsubscribe();
	}

	editLeague(i){
		this.navCtrl.push("Editleague",{league: this.leagues[i]});
	}
	editResults(i){
		this.navCtrl.push("Editresult",{league: this.leagues[i]});
	}
}
