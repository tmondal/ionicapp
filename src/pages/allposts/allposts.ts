import { Component,Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostPage } from '../post/post';
import { ClubprofilePage } from '../clubprofile/clubprofile';




@Component({
  selector: 'page-allposts',
  templateUrl: 'allposts.html'
})
export class AllpostsPage {

  @Input() userId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllpostsPage');
  }
}
