import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { PostPage} from '../post/post';
import { ClubprofilePage } from	'../clubprofile/clubprofile';
import { PlayerprofilePage } from '../playerprofile/playerprofile';
import { PostmodalPage } from '../postmodal/postmodal';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
  	public navCtrl: NavController,
  	public modalCtrl: ModalController
  ) {}

  onCreatePostClick(){
  	let modal = this.modalCtrl.create(PostmodalPage);
  	modal.present();
  }

  onRulesClick(){
  	this.navCtrl.push(PostPage);
  }
  onClubClick(){
  	this.navCtrl.push(ClubprofilePage);
  }
  onPlayerClick(){
  	this.navCtrl.push(PlayerprofilePage);
  }
}
