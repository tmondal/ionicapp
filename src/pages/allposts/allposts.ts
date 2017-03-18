import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostPage } from '../post/post'




@Component({
  selector: 'page-allposts',
  templateUrl: 'allposts.html'
})
export class AllpostsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllpostsPage');
  }

  onRulesClick(){
  	this.navCtrl.push(PostPage);
  }

}
