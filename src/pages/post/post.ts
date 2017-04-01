import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { PostService } from '../../providers/post-service';



@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

	rules: String[];
	participating: any;
	postid: String;
	participated: boolean = false;
	user: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController,
		private postservice: PostService
	) {
		this.rules = navParams.get("paramRules");
		this.participating = navParams.get("participating");
		this.postid = navParams.get("postid");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PostPage');
	}
	onCancel(){
		this.viewCtrl.dismiss();
	}
	onAccept(){
		this.participating += 1;
		this.participated = true;
		this.postservice.updateParticipating(this.postid,this.participating);
	}
	onDecline(){
		this.participating -= 1;
		this.participated = false;
		this.postservice.updateParticipating(this.postid,this.participating);
	}

}
