import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ViewController } from 'ionic-angular';
import { PostService } from '../../providers/post-service';


@Component({
  selector: 'page-postmoreopt',
  templateUrl: 'postmoreopt.html'
})
export class PostmoreoptPage {

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
		
	}

}
