import { Component ,OnInit } from '@angular/core';
import { NavController,ModalController ,PopoverController} from 'ionic-angular';

import { PostPage } from '../post/post';
import { UserprofilePage } from '../userprofile/userprofile';
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
  profileimage: any = null;
  currentuserId: any;
  postsubscription: any;
  usersubscription: any;
  currentusersubscription: any;
  imagesubscription: any;
  userimage: any = null;
  usertype: any;

  constructor(
  	public navCtrl: NavController,
  	public modalCtrl: ModalController,
  	public popoverCtrl: PopoverController,
    private postservice: PostService,
    public authservice: AuthService,
    private af: AngularFire
  ) {}

  ngOnInit(){
    this.postsubscription = this.postservice.getPosts().subscribe(posts =>{
      this.posts = posts;
      console.log(posts);
    });
    this.currentusersubscription = this.authservice.getmyprofile().subscribe(user=>{
      this.usertype = user.usertype;
      this.profileimage = user.profileimage;
    });
  }
  ngOnDestroy(){
    /*Took a day to figure it out . when i logout firebase showing permission denied at '/post'
    because even after loggout subscription to /post in firebase was there,so firebase 
    authentiaction rule showing permission-denied . So i had to unsubscribe the /post link
    when home component destroys.
    */
    this.postsubscription.unsubscribe();
    this.currentusersubscription.unsubscribe();
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
  onCriteriaClick(criteria,posttype,participating,postid){
    let modal = this.modalCtrl.create(PostPage,{
      paramRules: criteria,
      posttype: posttype,
      participating: participating,
      postid: postid
    });
    modal.present();
  }
  onUsernameClick(userId){
    this.usersubscription = this.authservice.getuserbyId(userId).subscribe(user=>{
        this.usertype = user.usertype;
        this.navCtrl.push(UserprofilePage,{userId: userId, usertype: this.usertype});
    });
  }

  onMoreClick(myEvent){
    let popover = this.popoverCtrl.create(PostmoreoptPage);
    popover.present({
      ev: myEvent
    });
  }

  calluserdetails(){
    this.navCtrl.push(UserprofilePage,{usertype: this.usertype});
  }
  getuserImage(id){
    this.imagesubscription = this.authservice.getuserbyId(id).subscribe((user)=>{
      this.userimage = user.profileimage;
      return this.userimage;
    });
  }

}

