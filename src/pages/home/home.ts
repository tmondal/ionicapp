import { Component ,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController ,PopoverController} from 'ionic-angular';

import { PostPage} from '../post/post';
import { ClubprofilePage } from	'../clubprofile/clubprofile';
import { PlayerprofilePage } from '../playerprofile/playerprofile';
import { PostmodalPage } from '../postmodal/postmodal';
import { PostmoreoptPage } from '../postmoreopt/postmoreopt';

import { Authdata } from '../../providers/authdata';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{

  posts: any;
  user: any;
  subscription: any;
  constructor(
  	public navCtrl: NavController,
  	public modalCtrl: ModalController,
  	public popoverCtrl: PopoverController,
    private authdata: Authdata
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.subscription = this.authdata.getPosts().subscribe(posts =>{
      this.posts = posts;
    });
  }
  ngOnInit(){}
  ngOnDestroy(){
    /*Took a day to figure it out . when i logout firebase showing permission denied at '/post'
    because even after loggout subscription to /post in firebase was there,so firebase 
    authentiaction rule showing permission-denied . So i had to unsubscribe the /post link
    when home component destroys.
    */
    this.subscription.unsubscribe(); 
  }

  onCreatePostClick(){
    let modal = this.modalCtrl.create(PostmodalPage);
    modal.present();
  }
  onRulesClick(rules,participating,postid){
    let modal = this.modalCtrl.create(PostPage,{
      paramRules: rules,
      participating: participating,
      postid: postid
    });
    modal.present();
  }

  onClubClick(){
    this.navCtrl.push(ClubprofilePage);
  }
  onPlayerClick(){
    this.navCtrl.push(PlayerprofilePage);
  }
  onMoreClick(myEvent){
    let popover = this.popoverCtrl.create(PostmoreoptPage);
    popover.present({
      ev: myEvent
    });
  }
  
}
