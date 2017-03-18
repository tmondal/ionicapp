import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PostPage} from '../post/post';
import { ClubprofilePage } from	'../clubprofile/clubprofile';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {}
  
  onRulesClick(){
  	this.navCtrl.push(PostPage);
  }
  onclick(){
  	this.navCtrl.push(ClubprofilePage);
  }
}
