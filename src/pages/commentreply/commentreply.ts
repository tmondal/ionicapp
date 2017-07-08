import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-commentreply',
  templateUrl: 'commentreply.html',
})
export class Commentreply {

	length: any;
	postid: any;
	userid: any;
	username: any;
	profileimage: any;
	parentid: any;
	commentdata: any;
	comments: any[] = [];
	childcommentname: any[] = [];
	childcommentimage: any[] = [];
	replytime: any[] = [];
	ifliked: boolean[] = [false];
	commentservice: any;
	noofcomment: any;
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
		this.parentid = this.navParams.get("parentid");
	}

	ngOnInit(){
		this.doRefresh();
	}

	doRefresh(){
		this.postservice.getchildComments(this.postid,this.parentid).take(1)
			.subscribe(comments =>{
				this.comments = comments;
				this.length = this.comments.length;

				for (let i = 0; i < this.length; i++) {
					this.replytime[i] = moment(this.comments[i].created_at).fromNow();
				}

				// get child comment userimage
				for (let i = 0; i < this.length; i++) {
					this.authservice.getuserbyId(this.comments[i].userid).subscribe(user=>{
						if (user.profileimage) {
							this.childcommentimage.push(user.profileimage);
						}else{
							this.childcommentimage.push(0);
						}
						if (user.name) {
							this.childcommentname.push(user.name);
						}else{
							this.childcommentname.push(0);
						}
					})
				}

				for (let i = 0;i < this.length;i++) {
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
	}

	addchildComment(){
		let comment = {
			created_at: Date.now(),
			userid: this.userid,
			postid: this.postid,
			data: this.commentdata,
			likes: 0
		}
		this.noofcomment += 1;
		this.commentdata = '';
		this.postservice.addchildComment(this.postid,this.parentid,comment,this.noofcomment);
		setTimeout(()=>{
			this.doRefresh();
		},1000);	
	}
	
	commentreplyLike(i,commentid,likes){
		if (!this.ifliked[i]) {	
			this.ifliked[i] = true;		
			likes += 1;
			this.postservice.commentreplyLike(this.postid,this.parentid,commentid,likes);
			setTimeout(()=>{
				this.doRefresh();
			},1000);
		}else{
			alert("You already liked.");
		}
	}
}
