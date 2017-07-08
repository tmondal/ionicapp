import { Component ,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-organizing',
  templateUrl: 'organizing.html',
})
export class Organizing implements OnInit{

	userid: any;
	usertype: any;
	organizing: any[] = [];
	leagues: any[] = [];
	userservice: any;
	posttime: any[] = [];

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService,
		public authservice: AuthService,
		public af: AngularFire) {

	}

	ngOnInit(){
		this.userservice = this.af.auth.subscribe(user =>{
			this.userid = user.uid;
		})

		this.authservice.getmyprofile().subscribe(me =>{
			this.usertype = me.usertype;
		})

		this.postservice.getOrganizedLeagues(this.userid).subscribe(leagues =>{
			this.leagues = leagues;
		});

		this.postservice.getFeed().subscribe(posts =>{
			posts.reverse();
			for (let i = 0; i <= posts.length - 1; i++) {
				if (posts[i].posttype == 'tournament' || posts[i].posttype == 'hiring') {
					if (posts[i].userId == this.userid) {
						posts[i].created_at = moment(posts[i].created_at).fromNow();

						this.authservice.getuserbyId(posts[i].userId).subscribe(user=>{
							if (user) {
								posts[i].username = user.name;
								posts[i].userimage = user.profileimage;
							}
							this.organizing.push(posts[i]);
						});
					}
				}
			}
		})
	}

	ngOnDestroy(){
		this.userservice.unsubscribe();
	}
}
