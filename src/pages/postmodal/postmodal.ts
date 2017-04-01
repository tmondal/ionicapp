import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';

import { Authdata } from '../../providers/authdata';



@Component({
  selector: 'page-postmodal',
  templateUrl: 'postmodal.html'
})
export class PostmodalPage {

	eventtype: any;
	sporttype: any;
	eventdate: any;
	eventtime: any;
	participating: Number = 0;
	rules: String[] = [];
	rule: String;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private authdata: Authdata
	) {}


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
			eventtype: this.eventtype,
			sporttype: this.sporttype,
			eventdate: this.eventdate,
			eventtime: this.eventtime,
			participating: this.participating,
			rules: this.rules
		}
		this.authdata.addPost(post);
		this.viewCtrl.dismiss();
	}
}
