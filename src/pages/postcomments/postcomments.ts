import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommentrepliesPage } from '../commentreplies/commentreplies';

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
	lastcomment: any[] = [0];
	childcomments: any[] = [0];
	commentservice: any;
	lastchildservice: any;
	noofcomment: any;
	childcommentservice: any;
	noofcommentservice: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService
	) {
		this.postid = this.navParams.get("postid");
		this.userid = this.navParams.get("userid");
		this.username = this.navParams.get("username");
		this.profileimage = this.navParams.get("profileimage");
	}

	ngOnInit(){
		

		this.commentservice = this.postservice.getparentComments(this.postid).subscribe(comments =>{
			this.comments = comments;
			for (let i = 0;i <= comments.length - 1;i++) {
				this.lastchildservice = this.postservice.getlastchildComment(comments[i].$key)
					.subscribe(comment =>{
						if (comment[0]) {							
							this.lastcomment[i] = comment[0];
						}
					})
			}
			for (let i = 0; i <= comments.length - 1; i++) {
				this.childcommentservice = this.postservice.getchildComments(comments[i].$key)
					.map(comments => comments.length).subscribe(length =>{
						if (length > 0) {							
							this.childcomments[i] = length;
						}
					})
			}
			// count no of comments of this post
			this.noofcommentservice = this.postservice.getpostfromFeedbyid(this.postid).subscribe(noofcomment =>{
				this.noofcomment = noofcomment.comments;
				console.log("noofcomment: " + this.noofcomment);
			})

		})
	}
	ngOnDestroy(){
		this.childcommentservice.unsubscribe();
		this.noofcommentservice.unsubscribe();
		this.commentservice.unsubscribe();
		this.lastchildservice.unsubscribe();
	}
	addparentComment(){

		let comment = {
			created_at: Date.now(),
			userid: this.userid,
			username: this.username,
			profileimage: this.profileimage,
			postid: this.postid,
			data: this.commentdata
		}
		this.noofcomment += 1;
		this.postservice.addparentComment(this.postid,comment,this.noofcomment);
	}
	gotocommentReplies(parentid){
		this.navCtrl.push(CommentrepliesPage,{
			userid: this.userid,
			username: this.username,
			profileimage: this.profileimage,
			postid: this.postid,
			parentid: parentid
		})
	}

}
