import { Component,OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { UserprofilePage } from '../../pages/userprofile/userprofile';


@Component({
  selector: 'page-allclubs',
  templateUrl: 'allclubs.html'
})
export class AllclubsPage implements OnInit{

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
		for (let i = 0,k=0; i <= this.clubs.length - 1;k++, i++) {
	        this.authservice.checkIffollowing(this.clubs[i].$key).subscribe(user =>{
	          this.following[i] = user.following;
	        });
      	}
	}
	onUsernameClick(userId){
    this.navCtrl.push(UserprofilePage,{userId: userId});
  }
}
