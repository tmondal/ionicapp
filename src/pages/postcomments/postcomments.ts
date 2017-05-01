import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PostService } from '../../providers/post-service';


@Component({
  selector: 'page-postcomments',
  templateUrl: 'postcomments.html'
})
export class PostcommentsPage implements OnInit {

	postid: any;
	userid: any;
	username: any;
	profileimage: any;
	comments: any;
	commentdata: any = null;
	lastcomment: any[] = [];
	commentservice: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService
	) {
		console.log("here");
		this.postid = this.navParams.get("postid");
		console.log(this.postid);
		this.userid = this.navParams.get("userid");
		console.log(this.userid);
		this.username = this.navParams.get("username");
		console.log(this.username);
		this.profileimage = this.navParams.get("profileimage");
		console.log(this.profileimage);
	}

	ngOnInit(){
		

		this.commentservice = this.postservice.getparentComments(this.postid).subscribe(comments =>{
			this.comments = comments;
			for (var i = 0;i <= comments.length - 1;i++) {
				this.postservice.getlastchildComment(comments[i].postid,comments[i].$key)
					.subscribe(comment =>{
						if (comment.length) {
							this.lastcomment[i] = comment;
						}
					})
			}
		})
	}
	ngOnDestroy(){
		this.commentservice.unsubscribe();
	}
	addparentComment(){
		console.log("Call");
		console.log(this.profileimage);
		console.log(this.username);
		let comment = {
			created_at: Date.now(),
			userid: this.userid,
			username: this.username,
			profileimage: this.profileimage,
			postid: this.postid,
			data: this.commentdata
		}
		// this.postservice.addparentComment(this.postid,comment);
		this.navCtrl.pop();
	}
	addchildComment(parentid){
		let comment = {
			created_at: Date.now(),
			userid: this.userid,
			username: this.username,
			profileimage: this.profileimage,
			postid: this.postid,
			data: this.commentdata
		}
		this.navCtrl.pop();
		this.postservice.addchildComment(this.postid,parentid,comment);	
	}

}
