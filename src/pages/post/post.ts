import { Component , OnInit} from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { PostService } from '../../providers/post-service';



@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage implements OnInit{

	rules: String[];
	posttype: any;
	postid: any;
	participating: any;
	participated: boolean;
	participateservice: any;
	user: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController,
		private postservice: PostService
	) {
		this.rules = navParams.get("paramRules");
		this.posttype = navParams.get("posttype");
		this.participating = navParams.get("participating");
		this.postid = navParams.get("postid");
		this.participateservice = this.postservice.getParticipated(this.postid).subscribe(user=>{
			this.participated = user.participated;
		});
		
	}
	ngOnInit(){}
	ngOnDestroy(){
		this.participateservice.unsubscribe();
	}
	onCancel(){
		this.viewCtrl.dismiss();
	}
	onAccept(){
		this.participated = true;
		this.participating += 1;
		this.postservice.updateParticipated(this.postid,this.participated);
		this.postservice.updateParticipating(this.postid,this.participating);
		this.viewCtrl.dismiss();
	}
	onDecline(){
		this.participating -= 1;
		this.participated = false;
		this.postservice.removeParticipated(this.postid,this.participated);
		this.postservice.updateParticipating(this.postid,this.participating);
	}

}
