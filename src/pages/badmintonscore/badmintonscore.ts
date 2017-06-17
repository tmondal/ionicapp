import { Component , OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';



@Component({
  selector: 'page-badmintonscore',
  templateUrl: 'badmintonscore.html'
})
export class BadmintonscorePage implements OnInit{


	currentuserId: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public af: AngularFire
	) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BadmintonscorePage');
	}
	ngOnInit(){		
		this.af.auth.subscribe(user =>{
			this.currentuserId = user.uid;
		});
	}
	onDismiss(){
		this.viewCtrl.dismiss();
	}

}
