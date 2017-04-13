import { Component ,OnInit } from '@angular/core';
import { NavController,ModalController ,PopoverController} from 'ionic-angular';

import { MypostPage } from '../mypost/mypost';
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

  authuid: any;
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

  liked: any[] = [];
  disliked: any[] = [];
  likes: any;
  dislikes: any;
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
      for (var i = 0; i <= this.posts.length - 1; i++) {
        if(this.posts[i].posttype == 'image' || this.posts[i].posttype == 'score') {
          this.postservice.getLikedDisliked(this.posts[i].$key).subscribe(user=>{
            if(user.liked == undefined) {
              this.liked[i] = false;
            }else{
              this.liked[i] = user.liked;
            }
            if(user.disliked == undefined) {
              this.disliked[i] = false;
            }
            else{
              this.disliked[i] = user.disliked;
            }
          });
        }
      }
    });
    this.currentusersubscription = this.authservice.getmyprofile().subscribe(user=>{
      this.authuid = user.$key;
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
    // let modal = this.modalCtrl.create(PostmodalPage);
    // modal.present();
    this.navCtrl.push(PostmodalPage);
  }
  onRulesClick(rules,participating,postid,userId){
    let modal = this.modalCtrl.create(PostPage,{
      rules: rules,
      participating: participating,
      postid: postid,
      userId: userId,
    });
    modal.present();
  }
  onCriteriaClick(criteria,participating,postid,userId){
    let modal = this.modalCtrl.create(PostPage,{
      criteria: criteria,
      participating: participating,
      postid: postid,
      userId: userId,
    });
    modal.present();
  }
  onUsernameClick(userId){
    this.navCtrl.push(UserprofilePage,{userId: userId}); // Whoever gets pushed should get poped 
  }
  calluserdetails(){
   this.navCtrl.push(UserprofilePage,{userId: this.authuid});
  }
  onMoreClick(myEvent){
    let popover = this.popoverCtrl.create(PostmoreoptPage);
    popover.present({
      ev: myEvent
    });
  }
  likePost(postid,i){
    
    // First see if previously liked or disliked .As every post does not have this
    // function we get explicitly by postid

    this.postservice.getLikedDisliked(postid).take(1).subscribe(user=>{
      if(user.liked === undefined) {
        this.liked[i] = false;
      }else{
        this.liked[i] = user.liked;
      }
      if(user.disliked === undefined) {
        this.disliked[i] = false;
      }else{
        this.disliked[i] = user.disliked;
      }

      this.postservice.countLikesDislikes(postid).take(1).subscribe(post =>{

        this.likes = post.likes;
        this.dislikes = post.dislikes;

        if((!this.liked[i]) && (!this.disliked[i])) {
          this.liked[i] = true;
          this.likes += 1; 
          this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
          this.postservice.updateLikesDislikes(postid,this.likes,this.dislikes);
        }else if(!this.liked[i] && this.disliked[i]){
          this.liked[i] = true;
          this.disliked[i] = false;
          this.likes += 1;
          this.dislikes -= 1;
          this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
          this.postservice.updateLikesDislikes(postid,this.likes,this.dislikes);
        }
        else if(this.liked[i]) {
          alert("One press enough to show your love :)");
        }
        else{
          alert("Bad engineer. Can't handle all cases :(");
        }
      });
    });
  }
  dislikePost(postid,i){

    this.postservice.getLikedDisliked(postid).take(1).subscribe(user=>{
      if(user.liked === undefined) {
        this.liked[i] = false;
      }else{        
        this.liked[i] = user.liked;
      }
      if(user.disliked === undefined) {
        this.disliked[i] = false;
      }else{        
        this.disliked[i] = user.disliked;
      }

      this.postservice.countLikesDislikes(postid).take(1).subscribe(post =>{

        this.likes = post.likes;
        this.dislikes = post.dislikes;
        
        if((!this.disliked[i]) && (!this.liked[i])) {
          this.disliked[i] = true;
          this.dislikes += 1;
          this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
          this.postservice.updateLikesDislikes(postid,this.likes,this.dislikes);
        }
        else if(!this.disliked[i] && this.liked[i] ) {
          this.liked[i] = false;
          this.disliked[i] = true;
          this.likes -=1;
          this.dislikes +=1;
          this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
          this.postservice.updateLikesDislikes(postid,this.likes,this.dislikes);
        }
        else if(this.disliked[i]) {
          alert("No matter how much you hate \n You can press only one time :)");
        }
        else{
          alert("You seeing this because \n The worst programmer designed it :)");
        }
      });
    });
  }

  seeParticipants(postid,participating){
    this.navCtrl.push(MypostPage,{
      postid: postid,
      userId: this.authuid,
      participating: participating
    });
  }
}


