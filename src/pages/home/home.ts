import { Component ,OnInit, ViewChild} from '@angular/core';
import { ElementRef} from '@angular/core';
import { 
    IonicPage,
    NavController,
    ModalController ,
    AlertController,
    NavParams,
    Content
} from 'ionic-angular';

import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import * as moment from 'moment';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations:[
    trigger('like',[
      state('lfalse',style({
        color: 'gray',
        transform: 'scale(1)'
      })),
      state('ltrue',style({
        color: '#e040fb',
        transform: 'scale(1)'
      })),
      transition('lfalse <=> ltrue',animate('1000ms ease-in',keyframes([
        style({transform: 'scale(1)',offset: 0}),
        style({transform: 'scale(1.5)',offset: .2}),
        style({transform: 'scale(1.1)',offset: .4}),
        style({transform: 'scale(1.3)',offset: .6}),
        style({transform: 'scale(1)',offset: .8}),
        style({transform: 'scale(1.1)',offset: 1}),
      ]))),
    ]),
    trigger('dislike',[
      state('dfalse',style({
        color: 'gray',
        transform: 'scale(1)'
      })),
      state('dtrue',style({
        color: '#F44336',
        transform: 'scale(1)'
      })),
      transition('dfalse <=> dtrue',animate('1000ms ease-in',keyframes([
        style({transform: 'scale(1)',offset: 0}),
        style({transform: 'scale(1.5)',offset: .2}),
        style({transform: 'scale(1.1)',offset: .4}),
        style({transform: 'scale(1.3)',offset: .6}),
        style({transform: 'scale(1)',offset: .8}),
        style({transform: 'scale(1.1)',offset: 1}),
      ]))),
    ]),
  ]
})
export class Home implements OnInit{
  @ViewChild(Content) content: Content;

  shownav: boolean = true;
  authuid: any;
  authid: any;
  user: any;
  profileimage: any = null;
  currentuserId: any;
  userimage: any = null;
  username: any = null;
  usertype: any;
  lattitude: any = null;
  longitude: any = null;

  posts: any[] = [];
  posttime: any[] = [];
  liked: any[] = [];
  disliked: any[] = [];
  length: any;
  clubs: any[] = [];
  players: any;
  iffollowing: any[] = [];
  noofcomments: any[] = [];
  nooflikes: any[] = [];
  noofdislikes: any[] = [];
  postmoreclicked: boolean[] = [false];
  likedislikeservice: any;
  feedsubscription: any;
  noofcommentservice:any;
  
  start = 0;
  threshold = 100;
  slideHeaderPrevious = 0;
  scrollcontent: any;
  tabbar: any;
  showheader:boolean;
  hideheader:boolean;
  headercontent:any;

  constructor(
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
    public navParams: NavParams,
    public myElement: ElementRef,
    private postservice: PostService,
    public authservice: AuthService,
    private af: AngularFire
  ) {
    af.auth.subscribe(user=>{
        if(user) {
          this.authid = user.auth.uid;
        }
    });
    this.showheader = true;
    this.hideheader = false;
  }

  ngOnInit(){

    // Ionic scroll element
    this.scrollcontent = this.myElement.nativeElement.getElementsByClassName('scroll-content')[0];
    
    this.scrollcontent.addEventListener("scroll", () => {
      if(this.scrollcontent.scrollTop > this.threshold) {
        this.showheader =false;
        this.hideheader = true;
      } else {
        this.showheader =true;
        this.hideheader = false;

      }
      if (this.slideHeaderPrevious >= this.scrollcontent.scrollTop) {
        this.showheader =true;
        this.hideheader = false;
      }
      this.slideHeaderPrevious = this.scrollcontent.scrollTop;
    });


    this.feedsubscription = this.postservice.getFeed().subscribe(feed =>{
      this.length = feed.length - 1;
      feed.reverse();
      this.posts = feed;

      // Format created_at time 

      for (let i = 0; i <= this.length; i++) {
        this.posttime[i] = moment(this.posts[i].created_at).fromNow();
      }

      // Get liked disliked by current user

      for (let i = 0; i <= this.length; i++) {
        
        this.postservice.getLikedDisliked(this.posts[i].$key).take(1).subscribe(user=>{
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

      // count no of likes,dislikes and comments of corresponding posts
      for (let i = 0; i <= this.length; i++) {

        this.postservice.countLikesDislikesComments(this.posts[i].$key).take(1)
          .subscribe(post =>{
            if (post.likes != undefined) {            
              this.nooflikes[i] = post.likes; 
            }else{
              this.nooflikes[i] = 0;
            }
            if (post.dislikes != undefined) {
              this.noofdislikes[i] = post.dislikes;
            }else{
              this.noofdislikes[i] = 0;
            }
            if (post.comments != undefined) {
              this.noofcomments[i] = post.comments;
            }else{
              this.noofcomments[i] = 0;
            }
        });
      }
    });

    this.authservice.getClubstofollow().subscribe(clubs =>{
      this.clubs = clubs;
      for (let i = 0; i <= clubs.length - 1; i++) {
        let temp = clubs[i].$key;
        this.authservice.checkIffollowing(temp).subscribe(user =>{
          if (user.following) {
            this.clubs.splice(i,1);
          }
          if (this.authid == temp) {
            this.clubs.splice(i,1);
          }
          this.iffollowing[i] = user.following;
        });
      }
    });
    // this.authservice.getPlayerstofollow().subscribe(players =>{
    //   this.players = players;
    // });
   
    this.authservice.getmyprofile().subscribe(user=>{
      this.authuid = user.$key;
      this.usertype = user.usertype;
      this.username = user.name;
      this.profileimage = user.profileimage;
      this.lattitude = user.lattitude;
      this.longitude = user.longitude;

    });

  }
  ngOnDestroy(){
    /*Took a day to figure it out . when i logout firebase showing permission denied at '/post'
    because even after loggout subscription to /post in firebase was there,so firebase 
    authentiaction rule showing permission-denied . So i had to unsubscribe the /post link
    when home component destroys.
    */
    this.feedsubscription.unsubscribe();
    // this.likedislikeservice.unsubscribe();
    // this.countlikedislike.unsubscribe();
  }
  
  doRefresh(refresher) {
    this.feedsubscription = this.postservice.getFeed().subscribe(feed =>{
      this.length = feed.length - 1;
      feed.reverse();
      this.posts = feed;

      // Format created_at time 

      for (let i = 0; i <= this.length; i++) {
        this.posttime[i] = moment(this.posts[i].created_at).fromNow();
      }

      // Get liked disliked by current user

      for (let i = 0; i <= this.length; i++) {
        this.postservice.getLikedDisliked(this.posts[i].$key).take(1).subscribe(user=>{
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

      // count no of likes,dislikes and comments of corresponding posts
      for (let i = 0; i <= this.length; i++) {

        this.postservice.countLikesDislikesComments(this.posts[i].$key).take(1)
          .subscribe(post =>{
            if (post.likes != undefined) {            
              this.nooflikes[i] = post.likes; 
            }else{
              this.nooflikes[i] = 0;
            }
            if (post.dislikes != undefined) {
              this.noofdislikes[i] = post.dislikes;
            }else{
              this.noofdislikes[i] = 0;
            }
            if (post.comments != undefined) {
              this.noofcomments[i] = post.comments;
            }else{
              this.noofcomments[i] = 0;
            }
        });
      }
    });


    this.authservice.getClubstofollow().subscribe(clubs =>{
      this.clubs = clubs;
      for (let i = 0; i <= clubs.length - 1; i++) {
        let temp = clubs[i].$key;
        this.authservice.checkIffollowing(temp).subscribe(user =>{
          if (user.following) {
            this.clubs.splice(i,1);
          }
          if (this.authid == temp) {
            this.clubs.splice(i,1);
          }
          this.iffollowing[i] = user.following;
        });
      }
    });

    if (refresher != 1) {
      
      setTimeout(() => {      
        refresher.complete();
      }, 500);
    }
  }

  follow(i){
    this.iffollowing[i] = true;
    this.authservice.followuser(this.clubs[i].$key);
  }
  clubstoFollow(){
    this.navCtrl.push("Clubstofollow",{clubs: this.clubs});
  }

  onCreatePostClick(){
    this.navCtrl.push("Createpost");
  }
  onRulesClick(rules,participating,postid,userId){
    let modal = this.modalCtrl.create("Post",{
      rules: rules,
      participating: participating,
      postid: postid,
      userId: userId,
      username: this.username,
      lat: this.lattitude,
      lng: this.longitude
    });
    modal.present();
  }
  onCriteriaClick(criteria,participating,postid,userId){
    let modal = this.modalCtrl.create("Post",{
      criteria: criteria,
      participating: participating,
      postid: postid,
      userId: userId,
      username: this.username,
      lat: this.lattitude,
      lng: this.longitude
    });
    modal.present();
  }
  onUsernameClick(userId){
    this.navCtrl.push("Userprofile",{userId: userId});
  }
  calluserdetails(){
   this.navCtrl.push("Userprofile",{userId: this.authuid});
  }

  // More options for a post
  onmoreClick(i){
    this.postmoreclicked[i] = !this.postmoreclicked[i];
  }

  removepost(userid,postid,i){
    let confirm = this.alertCtrl.create({
    title: 'Confirming',
    message: 'The post will be parmanently removed. Are you sure ?',
    buttons: [
      {
        text: 'No',
        handler: () => { this.postmoreclicked[i] = false; }
      },
      {
        text: 'Sure',
        handler: () => {
          this.postservice.removePostfromFeedbyId(userid,postid);
          this.postmoreclicked[i] = false;
          setTimeout(()=>{            
            this.doRefresh(1);
          },3000)
        }
      }
    ]
    });
    confirm.present();
  }

  // Like logic 
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

      this.postservice.countLikesDislikesComments(this.posts[i].$key).take(1).subscribe(post =>{
          if (post.likes != undefined) {
            this.nooflikes[i] = post.likes;
          }else{
            this.nooflikes[i] = 0;
          }
          if (post.dislikes != undefined) {
            this.noofdislikes[i] = post.dislikes;
          }else{
            this.noofdislikes[i] = 0;
          }

          if(!this.liked[i] && !this.disliked[i]) {
            this.liked[i] = true;
            this.nooflikes[i] += 1;
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
            this.doRefresh(1);
          }else if(!this.liked[i] && this.disliked[i]){
            this.liked[i] = true;
            this.disliked[i] = false;
            this.nooflikes[i] += 1;
            this.noofdislikes[i] -= 1;
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
            this.doRefresh(1);
          }else if (this.liked[i]) {
            alert("Don't press multiple times it hurts server :)");
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
        
      this.postservice.countLikesDislikesComments(this.posts[i].$key).take(1).subscribe(post =>{
          if (post.likes != undefined) {
            this.nooflikes[i] = post.likes;
          }else{
            this.nooflikes[i] = 0;
          }
          if (post.dislikes != undefined) {
            this.noofdislikes[i] = post.dislikes;
          }else{
            this.noofdislikes[i] = 0;
          }

          if(!this.disliked[i] && !this.liked[i]) {
            this.liked[i] = false;
            this.disliked[i] = true;
            this.noofdislikes[i] += 1;
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
            this.doRefresh(1);
          }
          else if(!this.disliked[i] && this.liked[i] ) {
            this.liked[i] = false;
            this.disliked[i] = true;
            this.nooflikes[i] -=1;
            this.noofdislikes[i] +=1;
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
            this.doRefresh(1);
          }else if (this.disliked[i]) {
            alert("No matter how much you hate \n You can press only one time :)");
          }        
          else{
            alert("You seeing this because \n The worst programmer designed it :)");
          }
      });
      
    });
  }
  commentPost(postid){
    this.navCtrl.push("Postcomments",{
      postid: postid,
      userid: this.authuid,
      username: this.username,
      profileimage: this.profileimage
    });
  }
  seeParticipants(postid){
    this.navCtrl.push("Mypost",{
      postid: postid,
      userId: this.authuid,
    });
  }
}
