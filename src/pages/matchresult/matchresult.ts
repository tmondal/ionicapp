import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AngularFire } from 'angularfire2';



@IonicPage()
@Component({
  selector: 'page-matchresult',
  templateUrl: 'matchresult.html',
})
export class Matchresult implements OnInit{

	league: any;
	userid: any;
	userservice: any;
	fixtures: any[] = [];
	teams: any[] = [];
	leaguename: any;
	sporttype: any;
	uppertype: any;
	teamonescore: any = 0;
	teamtwoscore: any = 0;

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


}
