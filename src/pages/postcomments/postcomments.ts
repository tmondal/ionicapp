import { Component, OnInit } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-postcomments',
  templateUrl: 'postcomments.html'
})
export class Postcomments implements OnInit {

	postid: any;
	userid: any;
	username: any;
	profileimage: any;
	comments: any[];
	commenttime: any[]=[0];
	commentdata: any = null;
	lastcomment: any[] = [0];
	lastcommenttime: any[]=[0];
	childcomments: any[] = [0];
	ifliked: boolean[] = [false];
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
		this.doRefresh();
	}
	doRefresh(){
		this.commentservice = this.postservice.getparentComments(this.postid).subscribe(comments =>{
			this.comments = comments;

			for (let i = 0;i<= this.comments.length - 1; i++) {
				if (this.comments[i]) {					
					this.commenttime[i] = moment(this.comments[i].created_at).fromNow();
				}
			}

			for (let i = 0;i <= this.comments.length - 1; i++) {
				this.postservice.getparentcommentsLiked(this.postid,this.comments[i].$key)
					.subscribe(liked =>{
						if (liked.liked) {
							this.ifliked[i] = true;
						}else{
							this.ifliked[i] = false;
						}
					})
			}

			for (let i = 0;i <= this.comments.length - 1;i++) {
				this.postservice.getlastchildComment(this.postid,this.comments[i].$key)
					.subscribe(comment =>{
						if (comment[0]) {							
							this.lastcomment[i] = comment[0];
						}
					})
			}
			for (let i = 0; i <= this.comments.length - 1; i++) {
				this.postservice.getchildComments(this.postid,this.comments[i].$key).take(1)
					.map(comments => comments.length).subscribe(length =>{
						if (length > 0) {							
							this.childcomments[i] = length;
						}
					})
			}
			// count all comments
			this.postservice.countLikesDislikesComments(this.postid).take(1)
				.subscribe(post=>{
					if (post.comments != undefined) {						
						this.noofcomment = post.comments;
					}else{
						this.noofcomment = 0;
					}
				})			

		})
	}
	ngOnDestroy(){
		this.commentservice.unsubscribe();
	}
	addparentComment(){

		let comment = {
			created_at: Date.now(),
			userid: this.userid,
			username: this.username,
			profileimage: this.profileimage,
			postid: this.postid,
			data: this.commentdata,
			likes: 0
		}
		this.noofcomment += 1;
		this.commentdata = '';
		this.postservice.addparentComment(this.postid,comment,this.noofcomment);
	}
	gotocommentReplies(parentid){
		this.doRefresh();
		this.navCtrl.push("Commentreply",{
			userid: this.userid,
			username: this.username,
			profileimage: this.profileimage,
			postid: this.postid,
			parentid: parentid
		})
	}

	oncommentLike(i,commentid,likes){
		if (!this.ifliked[i]) {	
			this.ifliked[i] = true;		
			likes += 1;
			this.postservice.parentcommentLike(this.postid,commentid,likes);
		}else{
			alert("You already liked.");
		}
	}

}


