import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams, AlertController,ViewController } from 'ionic-angular';
import { PostService } from '../../providers/post-service';




@IonicPage()
@Component({
  selector: 'page-postoptions',
  templateUrl: 'postoptions.html',
})
export class Postoptions {

	postid: any;
	userid: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController,
		public postservice: PostService
	) {
		this.postid = this.navParams.get("postid");
		this.userid = this.navParams.get("userid");
	}

	onremoveClick(){
		if (this.postid && this.postid) {			
			this.postservice.removePostfromFeedbyId(this.userid,this.postid);
		}
	}
}
