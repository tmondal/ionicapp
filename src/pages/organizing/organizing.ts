import { Component ,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';



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
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public postservice: PostService,
		public authservice: AuthService,
		public af: AngularFire) {

		this.af.auth.subscribe(user =>{
			this.userid = user.uid;
		})
	}

	ngOnInit(){

		this.authservice.getmyprofile().subscribe(me =>{
			this.usertype = me.usertype;
		})

		this.postservice.getOrganizedLeagues(this.userid).subscribe(leagues =>{
			this.leagues = leagues;
		});

		this.postservice.getFeed().subscribe(posts =>{
			for (let i = 0; i <= posts.length - 1; i++) {
				if (posts[i].posttype == 'tournament' || posts[i].posttype == 'hiring') {
					if (posts[i].userId == this.userid) {
						this.organizing.push(posts[i]);
					}
				}
			}
		})
	}

	ngOnDestroy(){}
}
