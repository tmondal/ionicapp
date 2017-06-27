import { Component,ViewChild } from '@angular/core';
import { 
	Slides,
	IonicPage, 
	NavController, 
	NavParams
} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';


@IonicPage()
@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html',
})
export class Guide {

	@ViewChild(Slides) slides: Slides;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public authservice: AuthService
	) {}

	gotoHome(){
		this.authservice.updateguideSeen();
		this.navCtrl.setRoot('Home');
	}
}
