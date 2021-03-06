import { Component , OnInit} from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';


@IonicPage()
@Component({
  selector: 'page-mypost',
  templateUrl: 'mypost.html'
})
export class Mypost implements OnInit {

	postid: any;
	users: any[] = [];
	totalparticipators: any;
	totalservice: any;
	userId: any;
	username: any;
	coverimage: any;
	participating: any = 0;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public authservice: AuthService,
		public postservice: PostService
	) {
		this.postid = this.navParams.get('postid');
		this.userId = this.navParams.get('userId');
	}

	ngOnInit(){
		this.authservice.getmyprofile().subscribe((user)=>{
			this.coverimage = user.coverimage;
			this.username = user.name;
		});
		this.totalservice = this.postservice.getTotalparticipation(this.postid).subscribe((users)=>{
			this.participating = users.length;
			for (var i = 0; i <= users.length - 1; i++) {
				this.authservice.getuserbyId(users[i].$key).subscribe(user=>{
					this.users.push(user);
				});
			}
		});
	}
	ngOnDestroy(){
		this.totalservice.unsubscribe();
	}
	onUsernameClick(userId){
    	this.navCtrl.push("Userprofile",{userId: userId});
  	}
}

