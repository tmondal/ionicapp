import { Component, OnInit } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-postcomments',
  templateUrl: 'postcomments.html'
})
export class Postcomments implements OnInit {

	length: any;
	postid: any;
	userid: any;
	username: any;
	profileimage: any;
	comments: any[] = [];
	parentcommentimage: any[] = [];
	parentcommentname: any[] = [];
	commenttime: any[]=[0];
	commentdata: any = null;
	lastcomment: any[] = [0];
	lastcommenttime: any[]=[0];
	childcomments: any[] = [0];
	ifliked: boolean[] = [false];
	lastuserimage: any[] = [];
	lastusername: any[] = [];
	commentservice: any;
	lastchildservice: any;
	noofcomment: any;
	childcommentservice: any;
	noofcommentservice: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService,
		public authservice: AuthService
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
		this.postservice.getparentComments(this.postid).take(1).subscribe(comments =>{
			this.comments = comments;

			this.length = this.comments.length;
			for (let i = 0; i < this.length; i++) {
				if (this.comments[i]) {					
					this.commenttime[i] = moment(this.comments[i].created_at).fromNow();
				}
			}

			// get user profileimage of all parent comments
			for (let i = 0; i < this.length; i++) {
				this.authservice.getuserbyId(this.comments[i].userid).subscribe(user=>{
					if (user.profileimage) {
						this.parentcommentimage.push(user.profileimage);
					}else{
						this.parentcommentimage.push(0);
					}
					if (user.name) {
						this.parentcommentname.push(user.name);
					}else{
						this.parentcommentname.push(0);
					}
				})
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
							this.authservice.getuserbyId(comment[0].userid).subscribe(user=>{
								if (user.profileimage) {									
									this.lastuserimage.push(user.profileimage);
								}else{
									this.lastuserimage.push(0);
								}
								if (user.name) {									
									this.lastusername.push(user.name);
								}else{
									this.lastusername.push(0);
								}
							});
						}
					});
			}
			for (let i = 0; i <= this.comments.length - 1; i++) {
				this.postservice.getchildComments(this.postid,this.comments[i].$key).take(1)
					.map(comments => comments.length).subscribe(length =>{
						if (length > 0) {							
							this.childcomments[i] = length;
						}
					});
			}
			// count all comments
			this.postservice.countLikesDislikesComments(this.postid)
				.subscribe(post=>{
					if (post.comments >= 0) {						
						this.noofcomment = post.comments;
					}else{
						this.noofcomment = 0;
					}
				});			

		})
	}
	ngOnDestroy(){
		// this.commentservice.unsubscribe();
	}
	addparentComment(){

		let comment = {
			created_at: Date.now(),
			userid: this.userid,
			postid: this.postid,
			data: this.commentdata,
			likes: 0
		}
		this.noofcomment += 1;
		this.commentdata = '';
		this.postservice.addparentComment(this.postid,comment,this.noofcomment);
		setTimeout(()=>{
			this.doRefresh();
		},1000);
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
			setTimeout(()=>{
				this.doRefresh();
			},500);
		}else{
			alert("You already liked.");
		}
	}

}


