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
import { Geolocation } from '@ionic-native/geolocation';

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
        color: '#2196F3',
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
  user: any;
  profileimage: any = null;
  currentuserId: any;
  userimage: any = null;
  username: any = null;
  usertype: any;
  lattitude: any = null;
  longitude: any = null;
  guideseen: boolean;

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
  distance: any[] = [];
  
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
      private af: AngularFire,
      public geolocation: Geolocation,
  ) {
    this.showheader = true;
    this.hideheader = false;
  }

  ngOnInit(){

    this.af.auth.subscribe(user=>{
        if(user) {
          this.authuid = user.auth.uid;
        }
    });
    this.geolocation.getCurrentPosition().then((pos)=>{
      this.af.database.object('/users/'+this.authuid).update({
        lattitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
    });

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

    this.doRefresh(1);

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
      
      // my profile
      this.authservice.getmyprofile().subscribe(user=>{
        this.authuid = user.$key;
        this.usertype = user.usertype;
        this.username = user.name;
        this.profileimage = user.profileimage;
        this.lattitude = user.lattitude;
        this.longitude = user.longitude;
        this.guideseen = user.guideseen;
      });
      
      feed.reverse();
      this.posts = feed;
      this.length = this.posts.length;

      if (this.length <= 0 && this.guideseen) {
        alert("Looks like you are new here\nNo problem. First follow some club\nThen create new post\n");
      }
      

      // Format created_at time 
      for (let i = 0; i < this.length; i++) {
        this.posttime[i] = moment(this.posts[i].created_at).fromNow();
      }

      // Get liked disliked by current user
      for (let i = 0; i < this.length; i++) {
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
      
      // get username and profileimage for each post
      for (let i = 0; i < this.posts.length; i++) {
        this.authservice.getuserbyId(this.posts[i].userId).subscribe(user=>{
          if (user) {            
            this.posts[i].username = user.name;
            this.posts[i].userimage = user.profileimage;
          }
        })
      }

      this.countlikedislikeComments();
      this.getclubstoFollow();
     
      // calculate distance 
      for (let i = 0; i < this.length; i++) {
        this.distance[i] = 0;
        if (this.posts[i].posttype == 'tournament' || this.posts[i].posttype == 'hiring') {
          this.authservice.getuserbyId(this.posts[i].userId).subscribe(user=>{
            let lat = user.lattitude;
            let lng = user.longitude;
            if (lat && lng && this.lattitude && this.longitude) {              
              let dist = this.calculateDistance(lat,lng);
              this.distance[i] = dist.toFixed(2);
            }
          })
        }
      }

    });

    if (refresher != 1) {
      
      setTimeout(() => {      
        refresher.complete();
      }, 500);
    }
  }

  countlikedislikeComments(){
    // count no of likes,dislikes and comments of corresponding posts
    for (let i = 0; i < this.length; i++) {

      this.postservice.countLikesDislikesComments(this.posts[i].$key)
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
  }

  getclubstoFollow(){
    this.clubs = [];
    this.authservice.getClubstoFollow().subscribe(clubs =>{
      for (let i = 0; i < clubs.length; i++) {
        let temp = clubs[i].$key;
        if (this.authuid != temp) {
          this.authservice.checkIffollowing(temp).subscribe(user =>{
            if (!user.following) {
              this.clubs.push(clubs[i]);
            }
          });
        }
      }
    });
  }

  calculateDistance(lat: any, lng: any){
    let radlat1 = Math.PI * this.lattitude/180;
    let radlat2 = Math.PI * lat/180;
    let theta = this.longitude-lng;
    let radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;

    // convert to km
    dist = dist * 1.609344; 
    return dist
  }

  follow(i){
   this.authservice.followuser(this.clubs[i].$key);
   this.clubs.splice(i,1);
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

  removepost(i,post){
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
          this.postservice.removePostfromFeedbyId(post);
          this.postmoreclicked[i] = false;
          setTimeout(()=>{            
            this.doRefresh(1);
          },2000)
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
    if (this.profileimage && this.username) {
      
      this.postservice.getLikedDisliked(postid).subscribe(user=>{
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

        this.postservice.countLikesDislikesComments(this.posts[i].$key).subscribe(post =>{
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
    else{
      alert("You must edit atleast name and image before liking\nSee top right corner and follow icons");
    }
  }

  dislikePost(postid,i){
    if (this.profileimage && this.username) {
      
      this.postservice.getLikedDisliked(postid).subscribe(user=>{
        
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
          
        this.postservice.countLikesDislikesComments(this.posts[i].$key).subscribe(post =>{
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
    else{
      alert("You must edit atleast name and image before disliking\nDon't worry post creator can't see you :)\nSee top right corner and follow icons");
    }
  }
  commentPost(postid){
    this.countlikedislikeComments();
    if (this.profileimage && this.username) {      
      this.navCtrl.push("Postcomments",{
        postid: postid,
        userid: this.authuid,
        username: this.username,
        profileimage: this.profileimage
      });
    }
    else{
      alert("You must edit atleast name and image before commenting\nWe show your name and image in the comment\nSee top right corner and follow icons");
    }
  }
  seeParticipants(postid){
    this.navCtrl.push("Mypost",{
      postid: postid,
      userId: this.authuid,
    });
  }
}
