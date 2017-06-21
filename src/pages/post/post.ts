import { Component , OnInit} from '@angular/core';
import { IonicPage,NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';



@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class Post implements OnInit {

	rules: any;
	criteria: any;
	userservice: any;
	coverimage: any;
	postid: any;
	participating: any;
	participated: boolean;
	participateservice: any;
	userId: any;
	totalservice: any;
	totalparticipators: any;
	users: any;
	username: any;
	currentusername:any;
	mylat: any;
	mylng: any;
	postlat: any;
	postlng: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController,
		public modalCtrl: ModalController,
		private postservice: PostService,
		public authservice : AuthService
	) {
		this.rules = navParams.get("rules");
		this.criteria = navParams.get("criteria");
		this.participating = navParams.get("participating");
		this.postid = navParams.get("postid");
		this.userId = navParams.get("userId");
		this.currentusername = navParams.get("username");
		this.mylat = navParams.get("lat");
		this.mylng = navParams.get("lng");
	}
	ngOnInit(){

		if (!this.currentusername) {
			alert("Please update profile before accepting challenge so that challenger can contact you :)");
		}
		this.participateservice = this.postservice.getParticipated(this.postid).subscribe(user=>{
			this.participated = user.participated;
		});
		this.userservice = this.authservice.getuserbyId(this.userId).subscribe((user)=>{
			this.coverimage = user.coverimage;
			this.username = user.name;
			this.postlat = user.longitude;
			this.postlng = user.longitude;
		});
	}
	ngOnDestroy(){
		this.participateservice.unsubscribe();
		this.userservice.unsubscribe();
	}
	// onmapClick(){
	// 	let modal = this.modalCtrl.create(GooglemapdistancePage,
	// 		{
	// 			mylat: this.mylat,
	// 			mylng: this.mylng,
	// 			postlat: this.postlat,
	// 			postlng: this.postlng
	// 		});
	// 	modal.present();
	// }
	onCancel(){
		this.viewCtrl.dismiss();
	}
	onAccept(){
		this.participated = true;
		this.participating += 1;
		if (this.participating > 0) {			
			this.postservice.updateParticipated(this.postid,this.participated);
			this.postservice.updateParticipating(this.postid,this.participating);
		}
		this.viewCtrl.dismiss();
	}
	onDecline(){
		this.participating -= 1;
		this.participated = false;
		if (this.participating >= 0) {			
			this.postservice.removeParticipated(this.postid,this.participated);
			this.postservice.updateParticipating(this.postid,this.participating);
		}
	}
}

