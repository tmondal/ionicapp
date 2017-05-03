import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';


@Component({
  selector: 'page-commentreplies',
  templateUrl: 'commentreplies.html'
})
export class CommentrepliesPage implements OnInit{

	postid: any;
	userid: any;
	username: any;
	profileimage: any;
	parentid: any;
	commentdata: any;
	comments: any[] = [];
	commentservice: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService
	) {

		this.postid = this.navParams.get("postid");
		this.userid = this.navParams.get("userid");
		this.username = this.navParams.get("username");
		this.profileimage = this.navParams.get("profileimage");
		this.parentid = this.navParams.get("parentid");
	}

	ngOnInit(){
		this.commentservice = this.postservice.getchildComments(this.parentid)
			.subscribe(comments =>{
				this.comments = comments;
			})
	}

	ngOnDestroy(){
		this.commentservice.unsubscribe();
	}

	addchildComment(){
		let comment = {
			created_at: Date.now(),
			userid: this.userid,
			username: this.username,
			postid: this.postid,
			profileimage: this.profileimage,
			data: this.commentdata
		}
		this.postservice.addchildComment(this.postid,this.parentid,comment);	
	}

}
