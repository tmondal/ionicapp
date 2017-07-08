import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AngularFire } from 'angularfire2';



@IonicPage()
@Component({
  selector: 'page-editresult',
  templateUrl: 'editresult.html',
})
export class Editresult implements OnInit{

	league: any;
	userid: any;
	userservice: any;
	fixtures: any[] = [];
	teams: any[] = [];
	leaguename: any;
	sporttype: any;
	uppertype: any;
	teamonescore: any[] = [];
	teamtwoscore: any[] = [];
	scoresaved: boolean[] = [false];

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService,
		public af: AngularFire
	) {
		this.league = this.navParams.get("league");
		this.fixtures = this.league.fixtures;
		if (this.league.teams) {			
			this.teams = this.league.teams;
		}
		this.leaguename = this.league.leaguename;
		this.sporttype = this.league.sporttype;
		this.uppertype = this.sporttype.toUpperCase();
	}

	ngOnInit(){}
	ngOnDestroy(){}

	updatematchResult(i){
		this.scoresaved[i] = true;
		this.fixtures[i].teamonescore = this.teamonescore[i];
		this.fixtures[i].teamtwoscore = this.teamtwoscore[i];
		this.postservice.updateleaguematchScore(this.league.$key,this.fixtures);
	}

	cancel(i) {
		this.scoresaved[i] = false;
	}
}
