import { Component ,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController ,PopoverController} from 'ionic-angular';

import { PostPage } from '../post/post';
import { ClubprofilePage } from	'../clubprofile/clubprofile';
import { PlayerprofilePage } from '../playerprofile/playerprofile';
//import { UserprofilePage } from '../userprofile/userprofile';
import { PostmodalPage } from '../postmodal/postmodal';
import { PostmoreoptPage } from '../postmoreopt/postmoreopt';

import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{

  posts: any;
  user: any;
  currentuserId: any;
  postsubscription: any;
  usersubscription: any;
  currentusersubscription: any;
  usertype: any;

  constructor(
  	public navCtrl: NavController,
  	public modalCtrl: ModalController,
  	public popoverCtrl: PopoverController,
    private postservice: PostService,
    public authservice: AuthService,
    private af: AngularFire
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  ngOnInit(){
    this.postsubscription = this.postservice.getPosts().subscribe(posts =>{
      this.posts = posts;
    });
  }
  ngOnDestroy(){
    /*Took a day to figure it out . when i logout firebase showing permission denied at '/post'
    because even after loggout subscription to /post in firebase was there,so firebase 
    authentiaction rule showing permission-denied . So i had to unsubscribe the /post link
    when home component destroys.
    */
    this.postsubscription.unsubscribe();

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

  onUsernameClick(userId){
    this.usersubscription = this.authservice.getuserbyId(userId).subscribe(user=>{
        this.usertype = user.usertype;
        console.log("here");
        console.log(this.usertype);
        if(this.usertype === "player") {
          this.navCtrl.push(PlayerprofilePage,{userId: userId});
          this.usersubscription.unsubscribe();
        }else if(this.usertype == "club"){
          this.navCtrl.push(ClubprofilePage,{userId: userId});
          this.usersubscription.unsubscribe();      
        }
    });
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

  calluserdetails(){
    this.currentusersubscription = this.authservice.getuserprofile().subscribe(user=>{
      this.usertype = user.usertype;
      if(this.usertype === "player") {
          this.navCtrl.push(PlayerprofilePage);
          this.currentusersubscription.unsubscribe();
        }else if(this.usertype == "club"){
          this.navCtrl.push(ClubprofilePage);
          this.currentusersubscription.unsubscribe();      
        }
    });
  }
}

