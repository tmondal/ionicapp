import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/count';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { ToastController} from 'ionic-angular';
import { AuthService } from './auth-service';
import * as firebase from 'firebase';

@Injectable()
export class PostService {

  posts: any;
  feed: any;
  post: FirebaseObjectObservable<any>;
  feednode: any;
  commentnode: any;
  childcomment: any;
  currentuser: any;
  authuid: any;
  storageimageRef: any;
  storagevideoRef: any;
  imageRef: any;
  videoRef: any;
  loading: any;
  progress: any = 0;
  followers: any[] = [];
  noofchild: any = 0;
  leaguenode: any;
  myfollowers: any;
  constructor(
    public af: AngularFire,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public authservice: AuthService
  ) {
    af.auth.subscribe(user=>{
      if(user) {
        this.authuid = user.auth.uid;
      }
    });
    this.feednode = this.af.database.list('/userwise-feed/' + this.authuid);
    
    this.childcomment = this.af.database.list('/post-comment-structure/');
    this.storageimageRef = firebase.storage().ref().child('images/');
    this.storagevideoRef = firebase.storage().ref().child('videos/');
  }


  cameraimagePost(post,imagesrc){


    let updatedpostdata = {};
    let newpostkey = this.feednode.push().key;
    
    // First put image to Storage and get url of the image
    if(imagesrc) {
      alert("Image will be uploaded in background.\nOnce done we will show the status.");

      this.imageRef = this.storageimageRef.child(`/${newpostkey}/main.jpg`);
      this.showToast("Storage ref created..");

      let uploadTask = this.imageRef.putString(imagesrc,'base64');
      this.showToast("Putstring called..");
      uploadTask.on('state_changed',

        (snapshot) => {
          this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          
        }, (error) => {
          this.loading.dismiss().then(()=>{
            this.showToast("Error occured during data send to server..");
          });
        },(success) =>{
          post.imageurl = uploadTask.snapshot.downloadURL;
          this.showToast('Success: image sent to the server and got url:)');

          updatedpostdata["/userwise-feed/" + this.authuid +"/"+ newpostkey] = post;
          this.authservice.getFollowers(this.authuid).subscribe(followers =>{
            if (followers.length > 0) {              
              for (let i = 0; i <= followers.length - 1; i++) {
                updatedpostdata["/userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
              }
            }
            this.af.database.object('/').update(updatedpostdata);
            alert("Post added to related feeds.\n Please refress again.");
          });
        }
      );
    }
    else{

      updatedpostdata["/userwise-feed/" + this.authuid +"/"+ newpostkey] = post;
      this.authservice.getFollowers(this.authuid).subscribe(followers =>{
        if (followers.length > 0) {          
          for (let i = followers.length - 1; i >= 0; i--) {
            updatedpostdata["/userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
          }
        }
        this.af.database.object('/').update(updatedpostdata);
        alert("Post added without image.\n But post with image looks good :)");
      });
    }
  }

  galleryvideoPost(post,nativepath){
    
    let updatedpostdata = {};
    let newpostkey = this.feednode.push().key;

    // See cordova File plugin documentation .
    // get the file and store to firebase storage 
    if(nativepath) { 

      alert("Video will be uploaded in background.\nOnce done we will let you know.");

      (<any>window).resolveLocalFileSystemURL(nativepath, (res) =>{
        res.file((resFile)=>{
          this.showToast("File selected with native path given");
          let reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) =>{
            let imgBlob = new Blob([evt.target.result],{type:  "video/mp4"});
            this.showToast("Blob created");
            // Now store the blob(i.e raw data. One kind of file)
            this.videoRef = this.storagevideoRef.child(`/${newpostkey}/main.mp4`);
            this.showToast("Video ref created");
            this.videoRef.put(imgBlob).then((res)=>{
              this.showToast("Blob sent");
              post.videourl = res.downloadURL;
              this.showToast('Success: video sent to the server and got url:)');
              updatedpostdata["userwise-feed/" + this.authuid +"/"+ newpostkey] = post;
              this.authservice.getFollowers(this.authuid).subscribe(followers =>{
                for (let i = followers.length - 1; i >= 0; i--) {
                  updatedpostdata["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
                }
                this.af.database.object('/').update(updatedpostdata);
                alert("Video added to related feeds.\n Now refress again.");
              });
            }).catch((err)=>{
              alert(err);
            })
          }
        },err=>{
          alert(err);
        })
      },(error)=>{
        alert(error);
      })
    }else{
      this.showToast("Please select a video..");
    }
  }

  simplePost(post){ // No image. Simple post

    let updatedPostData = {};
    let newpostkey = this.feednode.push().key;

    updatedPostData["/userwise-feed/" + this.authuid +"/"+ newpostkey] = post;
    this.authservice.getFollowers(this.authuid).subscribe(followers =>{
      if (followers.length > 0) {        
        for (let i = followers.length - 1; i >= 0; i--) {
          updatedPostData["/userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
        }
      }
      this.af.database.object('/').update(updatedPostData);
    });
  }

  showToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

  getFeed(){
    return this.af.database.list('/userwise-feed/' + this.authuid , {
      query: {
        orderByChild: 'created_at',
        endAt: Date.now()
      }
    }).take(1);
  }
  getFeedbyId(userid){
    return this.af.database.list('/userwise-feed/' + userid , {
      query: {
        orderByChild: 'created_at',
        endAt: Date.now()
      }
    }).take(1);
  }

  getpostfromFeedbyid(postid){
    return this.af.database.object('/userwise-feed/' + this.authuid +"/"+ postid).take(1);
  }

  // See again if all related data is deleted. I will come back later :)
  removePostfromFeedbyId(post){
    if (post.userId != this.authuid) {      
      this.af.database.object("/userwise-feed/"+this.authuid+"/"+post.$key).remove().then(
        (success) => alert("The post is parmanently removed from your feed"),
        (error) => alert("Could not remove. Try again!")
      )
    }else {
     
      if (post.posttype == 'tournament' || post.posttype == 'hiring') {
        this.af.database.object('/postwise-participator/' + post.$key).remove();
        this.af.database.object('/userwise-participatedpost/'+this.authuid+"/"+post.$key).remove();
      }

      // delete from followers feed
      this.authservice.getFollowers(post.userId).subscribe(followers =>{
        for (let i = followers.length - 1; i >= 0; i--) {
          this.af.database.object("/userwise-feed/"+ followers[i].$key +"/"+post.$key).remove();          
        }
      });
      // delete from own feed
      this.af.database.object("/userwise-feed/"+post.userId+"/"+post.$key).remove().then(
        (success) => {
          alert("Post is parmanently removed from related feeds.");
          if (post.imageurl) {            
            this.storageimageRef.child(`/${post.$key}/main.jpg`).delete();
          }
          if (post.videourl) {            
            this.storagevideoRef.child(`/${post.$key}/main.mp4`).delete();
          }
        },
        (error) => alert("Something wrong. Try again!")
      );
    }
  }

  // participation logics

  // called from 'post'
  checkifParticipated(postid: any){
    return this.af.database.object('/postwise-participator/' + postid + "/" + this.authuid).take(1);
  }

  // called from 'post'
  updateParticipated(postid: any,participated: boolean){
    let updatedata = {};
    updatedata['/postwise-participator/'+postid+"/"+this.authuid+"/participated"] = participated 
    updatedata['/userwise-participatedpost/'+this.authuid+"/"+postid+"/participated"] = participated;
    this.af.database.object('/').update(updatedata);
  }
  // called from 'post'
  removeParticipated(postid: any){
    this.af.database.object('/postwise-participator/' + postid + "/" + this.authuid).remove();
    this.af.database.object('/userwise-participatedpost/'+this.authuid+"/"+postid).remove();
  }
  getparticipatedPost(){
    return this.af.database.list('/userwise-participatedpost/'+this.authuid).take(1);
  }

  // called from 'post'
  updateParticipating(postid: any,userid: any, participating: number){
    let updatedata = {};
    updatedata['/userwise-feed/' + userid + "/" + postid + '/participating'] = participating;
    this.authservice.getFollowers(userid).subscribe(followers =>{
      for (let i = 0;i <= followers.length - 1; i++) {
        this.af.database.object('/userwise-feed/' + followers[i].$key + "/" + postid)
          .update({participating: participating});
      }
    });
    this.af.database.object('/').update(updatedata);
  }
  
  getTotalparticipation(postid){
    return this.af.database.list('/postwise-participator/' + postid).take(1);
  }

  // Like Dislike logics
  getLikedDisliked(postid){
    return this.af.database.object('/postwise-liked-disliked/' + postid + "/" + this.authuid).take(1);
  }

  likeDislikePost(postid,liked,disliked){
    this.af.database.object('/postwise-liked-disliked/' + postid + "/" + this.authuid).update({
      liked : liked,
      disliked: disliked
    });
  }
  updateLikesDislikes(postid,likes,dislikes){

    let likedislikedata = {};

    likedislikedata["/postwise-ldc-count/" + postid + "/likes"] = likes;
    likedislikedata["/postwise-ldc-count/" + postid + "/dislikes"] = dislikes;

    this.af.database.object('/').update(likedislikedata);
  }

  // Comment Logics

  addparentComment(postid,data,noofcomment){
    this.commentnode = this.af.database.list('/postwise-parentcomments/'+ postid);
    let parentcommentid = this.commentnode.push().key;
    let updatedata = {};
    updatedata["/postwise-ldc-count/" + postid+ "/comments"] = noofcomment;
    updatedata["/postwise-parentcomments/"+postid+"/"+ parentcommentid] = data;
    this.af.database.object('/').update(updatedata);
  }


  getparentComments(postid){
    return this.af.database.list('/postwise-parentcomments/'+postid);
  }

  getlastparentComment(postid){
    return this.af.database.list('/postwise-parentcomments/'+postid,{
      query: {
        orderByChild: 'created_at',
        endAt: Date.now(),
        limitToFirst: 1
      }
    }).take(1);
  }

  addchildComment(postid,parentid,data,noofcomment){
    this.commentnode = this.af.database.list('/post-comment-structure/'+postid+"/"+parentid);
    let childcommentid = this.commentnode.push().key;

    let updatedata = {};
    updatedata['/postwise-ldc-count/' + postid + "/comments"] = noofcomment;
    updatedata['/post-comment-structure/'+postid+"/"+parentid+'/'+childcommentid] = data;
    this.af.database.object('/').update(updatedata);
  }
  getchildComments(postid,parentid){
    return this.af.database.list('/post-comment-structure/'+postid+"/"+parentid);
  }
  getlastchildComment(postid,parentid){
    return this.af.database.list('/post-comment-structure/'+postid+"/"+parentid,{
      query: {
        orderByChild: 'created_at',
        endAt: Date.now(),
        limitToLast:1
      }
    }).take(1);
  }

  countLikesDislikesComments(postid){
    return this.af.database.object('/postwise-ldc-count/'+postid).take(1);
  }

  parentcommentLike(postid,commentid,likes){
    this.af.database
      .object("/postwise-parentcomments/"+postid+"/"+ commentid)
        .update({likes:likes});
    this.af.database
      .object('/parentcomments-liked/'+postid+"/"+commentid+"/"+this.authuid)
        .update({liked: true})
  }
  getparentcommentsLiked(postid,commentid){
    return this.af.database
      .object('/parentcomments-liked/'+postid+"/"+commentid+"/"+this.authuid)
        .take(1);
  }

  commentreplyLike(postid,parentid,commentid,likes){
    this.af.database
      .object('/post-comment-structure/'+postid+"/"+parentid+'/'+commentid)
        .update({likes:likes});
    this.af.database
      .object('/childcomments-liked/'+postid+"/"+parentid+"/"+commentid+"/"+this.authuid)
        .update({liked: true});
  }
  getchildcommentsLiked(postid,parentid,commentid){
    return this.af.database
      .object('/childcomments-liked/'+postid+"/"+parentid+"/"+commentid+"/"+this.authuid)
         .take(1);
  }


  // League logics

  createLeague(fixtures,leaguename,sporttype,teams){
    this.leaguenode = this.af.database.list(`/league-organized/${this.authuid}/`);
    let leagueid = this.leaguenode.push().key;
    let updatedata = {};

    updatedata[`/league-organized/${this.authuid}/` + leagueid + '/sporttype'] = sporttype;
    updatedata[`/league-organized/${this.authuid}/` + leagueid +'/leaguename'] = leaguename;
    updatedata[`/league-organized/${this.authuid}/` + leagueid + '/teams'] = teams;
    updatedata[`/league-organized/${this.authuid}/` + leagueid + '/fixtures'] = fixtures;


    for (var i = teams.length - 1; i >= 0; i--) {
      updatedata[`/league-participated/${teams[i].id}/` + leagueid +'/leaguename'] = leaguename;
      updatedata[`/league-participated/${teams[i].id}/` + leagueid +'/leagueadminid'] = this.authuid;
      
    }
    this.af.database.object('/').update(updatedata).then(
      (success) => alert("League successfully created."),
      (error) => alert("Error while creating ! try again !!")
    );
  }

  // update a league
  updateLeague(leagueid,leaguename,sporttype,teams,fixtures,removedids){
    
    for (var i = removedids.length - 1; i >= 0; i--) {
      this.af.database.object("/league-participated/" + removedids[i] +"/" + leagueid).remove();
    }

    let updatedata = {};

    updatedata[`/league-organized/${this.authuid}/` + leagueid + '/sporttype'] = sporttype;
    updatedata[`/league-organized/${this.authuid}/` + leagueid +'/leaguename'] =  leaguename;
    updatedata[`/league-organized/${this.authuid}/` + leagueid + '/teams'] = teams;
    updatedata[`/league-organized/${this.authuid}/` + leagueid + '/fixtures'] = fixtures;

    for (var i = teams.length - 1; i >= 0; i--) {
      updatedata[`/league-participated/${teams[i].id}/` + leagueid +'/leaguename'] = leaguename;
    }
    this.af.database.object('/').update(updatedata).then(
      (success) => alert("League successfully updated."),
      (error) => alert("Error while updating ! try again !!")
    );
  }

  // League that you organized
  getOrganizedLeagues(userid){
    return this.af.database.list("/league-organized/" + userid).take(1);
  }

  // League that you are a member
  getParticipatingLeagues(userid){
    return this.af.database.list("/league-participated/" + userid).take(1);
  }
  
  // get your fixtures for a particular league
  getmyFixtures(leagueid,leagueadminid){
    return this.af.database
      .list("/league-organized/" + leagueadminid +"/"+ leagueid +"/fixtures").take(1);
  }

  // update league result
  updateleaguematchScore(leagueid,fixtures){
    this.af.database
      .object(`/league-organized/${this.authuid}/` + leagueid)
        .update({fixtures: fixtures})
          .then(
            (success)=> alert("Scores updated"),
            (error) => alert("Error!Try again")
          );
  }
}
