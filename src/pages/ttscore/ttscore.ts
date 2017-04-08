import { Component } from '@angular/core';
import { NavController, NavParams , ViewController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';


@Component({
  selector: 'page-ttscore',
  templateUrl: 'ttscore.html'
})
export class TtscorePage {

	currentuserId: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public af: AngularFire
	) {}

	ngOnInit(){
		this.af.auth.subscribe(user =>{
			this.currentuserId = user.uid;
		});
	}
	onDismiss(){
		this.viewCtrl.dismiss();
	}
}
