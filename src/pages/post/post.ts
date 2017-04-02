import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { PostService } from '../../providers/post-service';



@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

	rules: String[];
	postid: String;
	participating: any;
	participated: boolean;
	user: any;
	test: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController,
		private postservice: PostService
	) {
		this.rules = navParams.get("paramRules");
		console.log("here");
		this.participating = navParams.get("participating");
		console.log("participating:" + this.participating);
		this.postid = navParams.get("postid");
		console.log("postid: "+this.postid);
		this.postservice.getParticipated(this.postid).subscribe(user=>{
			this.participated = user.participated;
			console.log("participated: "+ this.participated);
		});
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PostPage');
	}
	onCancel(){
		this.viewCtrl.dismiss();
	}
	onAccept(){
		this.participated = true;
		this.participating += 1;
		this.postservice.updateParticipated(this.postid,this.participated);
		this.postservice.updateParticipating(this.postid,this.participating);
	}
	onDecline(){
		this.participating -= 1;
		this.participated = false;
		this.postservice.updateParticipated(this.postid,this.participated);
		this.postservice.updateParticipating(this.postid,this.participating);
	}

}
