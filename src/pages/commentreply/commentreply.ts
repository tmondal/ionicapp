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
	ifliked: boolean[] = [false];
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
				for (let i = 0;i <= this.comments.length - 1;i++) {
					this.postservice.getchildcommentsLiked(this.postid,this.parentid,this.comments[i].$key)
						.subscribe(liked =>{
							if (liked.liked) {
								this.ifliked[i] = true;
							}else{
								this.ifliked[i] = false;
							}
						})

				}
			});


		this.postservice.countLikesDislikesComments(this.postid).subscribe(post =>{
			if (post.comments >= 0) {				
				this.noofcomment = post.comments;
			}else{
				this.noofcomment = 0;
			}
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
			data: this.commentdata,
			likes: 0
		}
		this.noofcomment += 1;
		this.commentdata = '';
		this.postservice.addchildComment(this.postid,this.parentid,comment,this.noofcomment);	
	}
	
	commentreplyLike(i,commentid,likes){
		if (!this.ifliked[i]) {	
			this.ifliked[i] = true;		
			likes += 1;
			this.postservice.commentreplyLike(this.postid,this.parentid,commentid,likes);
		}else{
			alert("You already liked.");
		}
	}
}
