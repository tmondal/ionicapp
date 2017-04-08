import { Component ,OnInit} from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';


@Component({
  selector: 'page-footballscore',
  templateUrl: 'footballscore.html'
})
export class FootballscorePage implements OnInit{

	currentuserId: any;

	teamone: any;
	goalone: any;
	yellowcardone: any;
	redcardone: any;
	goalscorerone: any;
	
	teamtwo: any;
	goaltwo: any;
	yellowcardtwo: any;
	redcardtwo: any;
	goalscorertwo: any;

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public af: AngularFire
	) {}
	ngOnInit(){
		this.af.auth.subscribe(user =>{
			this.currentuserId = user.uid;
		});
	}
	ionViewDidLoad() {
	console.log('ionViewDidLoad FootballscorePage');
	}
	onDismiss(){
		this.viewCtrl.dismiss();
	}
}
