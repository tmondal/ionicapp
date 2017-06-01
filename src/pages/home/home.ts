import { Component ,OnInit } from '@angular/core';
import { NavController,ModalController ,PopoverController} from 'ionic-angular';

import { MypostPage } from '../mypost/mypost';
import { PostPage } from '../post/post';
import { UserprofilePage } from '../userprofile/userprofile';
import { PostmodalPage } from '../postmodal/postmodal';
import { PostmoreoptPage } from '../postmoreopt/postmoreopt';
import { PostcommentsPage } from '../postcomments/postcomments';

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

export class HomePage implements OnInit{

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
  likedislikeservice: any;
  feedsubscription: any;
  noofcommentservice:any;
  

  constructor(
  	public navCtrl: NavController,
  	public modalCtrl: ModalController,
  	public popoverCtrl: PopoverController,
    private postservice: PostService,
    public authservice: AuthService,
    private af: AngularFire
  ) {
    af.auth.subscribe(user=>{
        if(user) {
          this.authid = user.auth.uid;
        }
      });
  }

  ngOnInit(){

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
      console.log(this.liked);
      console.log(this.disliked);

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
      console.log(this.nooflikes);
      console.log(this.noofdislikes);
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
    this.authservice.getPlayerstofollow().subscribe(players =>{
      this.players = players;
    });
   
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

    setTimeout(() => {      
      refresher.complete();
    }, 2000);
  }

  follow(i){
    this.iffollowing[i] = true;
    this.authservice.followuser(this.clubs[i].$key);
  }
  unfollow(i){
    this.iffollowing[i] = false;
    this.authservice.unfollowuser(this.clubs[i].$key);
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
      username: this.username,
      lat: this.lattitude,
      lng: this.longitude
    });
    modal.present();
  }
  onCriteriaClick(criteria,participating,postid,userId){
    let modal = this.modalCtrl.create(PostPage,{
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
    console.log("Like called");
    // First see if previously liked or disliked .As every post does not have this
    // function we get explicitly by postid
    console.log("Postid" + i +":"+ postid);

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
            console.log("likes : " + post.likes);
          }else{
            this.nooflikes[i] = 0;
          }
          if (post.dislikes != undefined) {
            this.noofdislikes[i] = post.dislikes;
            console.log("dislikes : " + post.dislikes);
          }else{
            this.noofdislikes[i] = 0;
          }

          if(!this.liked[i] && !this.disliked[i]) {
            this.liked[i] = true;
            this.nooflikes[i] += 1;
            console.log("here");
            console.log(this.nooflikes[i]); 
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
          }else if(!this.liked[i] && this.disliked[i]){
            this.liked[i] = true;
            this.disliked[i] = false;
            this.nooflikes[i] += 1;
            this.noofdislikes[i] -= 1;
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
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
    console.log("Dislike called");
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
            console.log("d likes: " + post.likes);
          }else{
            this.nooflikes[i] = 0;
          }
          if (post.dislikes != undefined) {
            this.noofdislikes[i] = post.dislikes;
            console.log("d dislikes: " + post.dislikes);
          }else{
            this.noofdislikes[i] = 0;
          }

          if(!this.disliked[i] && !this.liked[i]) {
            this.liked[i] = false;
            this.disliked[i] = true;
            this.noofdislikes[i] += 1;
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
          }
          else if(!this.disliked[i] && this.liked[i] ) {
            this.liked[i] = false;
            this.disliked[i] = true;
            this.nooflikes[i] -=1;
            this.noofdislikes[i] +=1;
            this.postservice.likeDislikePost(postid,this.liked[i],this.disliked[i]);
            this.postservice.updateLikesDislikes(postid,this.nooflikes[i],this.noofdislikes[i]);
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
    this.navCtrl.push(PostcommentsPage,{
      postid: postid,
      userid: this.authuid,
      username: this.username,
      profileimage: this.profileimage
    });
  }
  seeParticipants(postid){
    this.navCtrl.push(MypostPage,{
      postid: postid,
      userId: this.authuid,
    });
  }
}
