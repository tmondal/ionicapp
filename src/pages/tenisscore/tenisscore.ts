import { Component } from '@angular/core';
import { NavController, NavParams ,ViewController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';



@Component({
  selector: 'page-tenisscore',
  templateUrl: 'tenisscore.html'
})
export class TenisscorePage {

	currentuserId: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public af: AngularFire,
	) {}

	ionViewDidLoad() {
	console.log('ionViewDidLoad TenisscorePage');
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
