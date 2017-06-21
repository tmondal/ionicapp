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

	ngOnInit(){
		if (this.clubs) {			
			for (let i = 0,k=0; i <= this.clubs.length - 1;k++, i++) {
		        this.authservice.checkIffollowing(this.clubs[i].$key).subscribe(user =>{
		          this.following[i] = user.following;
		        });
	      	}
		}
	}
	onUsernameClick(userId){
    this.navCtrl.push("Userprofile",{userId: userId});
  }
}
