import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ViewController } from 'ionic-angular';



@Component({
  selector: 'page-postmodal',
  templateUrl: 'postmodal.html'
})
export class PostmodalPage {

	rules: String[] = [];
	addrule: String;
	rule: String;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController
	) {}


	onDismiss(){
		this.viewCtrl.dismiss();
	}
	onAddClick(){
		this.rules.push(this.addrule);
		this.addrule = '';
	}
	onDelClick(i){
		this.rules.splice(i,1); // splice modifies the array
	}

}
