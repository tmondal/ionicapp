import { Component , OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';




@IonicPage()
@Component({
  selector: 'page-clubstofollow',
  templateUrl: 'clubstofollow.html',
})
export class Clubstofollow implements OnInit{

	clubs: any;
	following: any[] = [];
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public authservice: AuthService
	){
		this.clubs = this.navParams.get("clubs");
	}

	ngOnInit(){}
	
	onUsernameClick(userId){
    	this.navCtrl.push("Userprofile",{userId: userId});
  	}

  	follow(i){
	   this.authservice.followuser(this.clubs[i].$key);
	   this.clubs.splice(i,1);
	}
}
