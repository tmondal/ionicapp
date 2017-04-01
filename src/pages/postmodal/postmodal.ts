import { Component , OnInit} from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

import { PostService } from '../../providers/post-service';
import { AngularFire } from 'angularfire2';



@Component({
  selector: 'page-postmodal',
  templateUrl: 'postmodal.html'
})
export class PostmodalPage implements OnInit{

	eventtype: any;
	sporttype: any;
	eventdate: any;
	eventtime: any;
	participating: Number = 0;
	rules: String[] = [];
	rule: String;
	currentuserId: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public af: AngularFire,
		private postservice: PostService
	) {}
	ngOnInit(){
		/* Initially i was trying to get current user inside constructor and 
		it got f***ed up when i logout
		*/
		this.af.auth.subscribe(user =>{
			this.currentuserId = user.uid;
		});
	}

	onDismiss(){
		this.viewCtrl.dismiss();
	}
	onAddClick(){
		this.rules.push(this.rule);
		this.rule = '';
	}
	onDelClick(i){
		this.rules.splice(i,1); // splice modifies the array
	}
	onPostSubmit(){
		let post = { 
			userId: this.currentuserId,
			eventtype: this.eventtype,
			sporttype: this.sporttype,
			eventdate: this.eventdate,
			eventtime: this.eventtime,
			participating: this.participating,
			rules: this.rules
		}
		this.postservice.addPost(post,this.currentuserId);
		this.viewCtrl.dismiss();
	}
}
