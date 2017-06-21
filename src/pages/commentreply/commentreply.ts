import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-commentreply',
  templateUrl: 'commentreply.html',
})
export class Commentreply {

	postid: any;
	userid: any;
	username: any;
	profileimage: any;
	parentid: any;
	commentdata: any;
	comments: any[] = [];
	replytime: any[] = [];
	commentservice: any;
	noofcomment: any;
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
		this.parentid = this.navParams.get("parentid");
	}

	ngOnInit(){
		this.commentservice = this.postservice.getchildComments(this.postid,this.parentid)
			.subscribe(comments =>{
				this.comments = comments;
				for (let i = 0; i <= comments.length - 1; i++) {
					this.replytime[i] = moment(this.comments[i].created_at).fromNow();
				}
			})

		this.postservice.countLikesDislikesComments(this.postid).subscribe(post =>{
			if (post.comments != undefined) {				
				this.noofcomment = post.comments;
			}else{
				this.noofcomment = 0;
			}
		})
	}

	ngOnDestroy(){
		// this.noofcommentservice.unsubscribe();
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
		this.noofcomment += 1;
		this.commentdata = '';
		this.postservice.addchildComment(this.postid,this.parentid,comment,this.noofcomment);	
	}
}
