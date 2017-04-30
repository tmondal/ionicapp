import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { File } from 'ionic-native';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ToastController} from 'ionic-angular';
import { AuthService } from './auth-service';
import * as firebase from 'firebase';

@Injectable()
export class PostService {

  // feed: FirebaseListObservable<any[]>;
  posts: any;
  post: FirebaseObjectObservable<any>;
  postnode: any;
  currentuser: any;
  fireauth: any;
  storageimageRef: any;
  storagevideoRef: any;
  imageRef: any;
  videoRef: any;
  loading: any;
  progress: any = 0;
  followers: any[] = [];
  constructor(
    public af: AngularFire,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public authservice: AuthService
  ) {
    af.auth.subscribe(user=>{
      if(user) {
        this.fireauth = user.auth;
      }
    });
    this.postnode = this.af.database.list('/posts');
    this.storageimageRef = firebase.storage().ref().child('images/');
    this.storagevideoRef = firebase.storage().ref().child('videos/');
  }


  cameraimagePost(post,userid,imagesrc){


    let updatedpostdata = {};
    let newpostkey = this.postnode.push().key;
    
    // First put image to Storage and get url of the image
    if(imagesrc) {
      alert("Image will be uploaded in background.\nOnce done we will show the status.");

      this.imageRef = this.storageimageRef.child(`/${newpostkey}/main.jpg`);
      this.showToast("Storage ref created..");

      let uploadTask = this.imageRef.putString(imagesrc,'base64');
      this.showToast("putString called..");
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
          updatedpostdata["posts/" + newpostkey] = post;
          updatedpostdata["userwise-feed/" + userid +"/"+ newpostkey] = post;
          this.authservice.getFollowers(userid).subscribe(followers =>{
            for (let i = followers.length - 1; i >= 0; i--) {
              updatedpostdata["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
            }
            this.af.database.object('/').update(updatedpostdata);
            alert("Post added to related feeds.\n Please refress again.");
          });
        }
      );
    }
    else{

      updatedpostdata["posts/" + newpostkey] = post;
      updatedpostdata["userwise-feed/" + userid +"/"+ newpostkey] = post;
      this.authservice.getFollowers(userid).subscribe(followers =>{
        for (let i = followers.length - 1; i >= 0; i--) {
          updatedpostdata["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
        }
        this.af.database.object('/').update(updatedpostdata);
        this.loading.dismiss().then(()=>{
          alert("Post added without image.\n But post with image looks good :)");
        });
      });
    }
  }

  galleryvideoPost(post,userid,nativepath){
    
    let updatedpostdata = {};
    let newpostkey = this.postnode.push().key;

    // See cordova File plugin documentation .
    // get the file and store to firebase storage 
    alert("Video path: " + nativepath);
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
              updatedpostdata["posts/" + newpostkey] = post;
              updatedpostdata["userwise-feed/" + userid +"/"+ newpostkey] = post;
              this.authservice.getFollowers(userid).subscribe(followers =>{
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

  simplePost(post,userid){ // No image. Simple post

    let updatedPostData = {};
    let newpostkey = this.postnode.push().key;

    updatedPostData["posts/" + newpostkey] = post;
    updatedPostData["userwise-feed/" + userid +"/"+ newpostkey] = post;
    this.authservice.getFollowers(userid).subscribe(followers =>{
      for (let i = followers.length - 1; i >= 0; i--) {
        updatedPostData["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
      }
      this.af.database.object('/').update(updatedPostData);
    });
  }
  
  showToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
  getPost(id){
    return this.af.database.object('/posts/' + id).take(1);
  }
 
  getFeed(){
    this.posts = this.af.database.list('/userwise-feed/' + this.fireauth.uid , {
      query: {
        orderByChild: 'created_at',
        endAt: Date.now()
      }
    });
    return this.posts;
  }

  // participation logics
  getParticipated(postid: any){
    return this.af.database.object('/postwise-participator/' + postid + "/" + this.fireauth.uid);
  }
  updateParticipated(postid: any,participated: boolean){
    console.log(postid);
    const item = this.af.database.object('/postwise-participator/' + postid + "/" + this.fireauth.uid);
    item.update({participated: participated});
  }
  removeParticipated(postid: any,participated: boolean){
    console.log(postid);
    const item = this.af.database.object('/postwise-participator/' + postid + "/" + this.fireauth.uid);
    item.remove();
  }
  getParticipating(postid: any){
    return this.af.database.object('/posts/' + postid); 
  }
  updateParticipating(postid: any,participating: number){
    let updatedata = {};
    updatedata['/posts/' + postid + '/participating'] = participating;
    updatedata['/userwise-feed/' + this.fireauth.uid + "/" + postid + '/participating'] = participating;
    this.af.database.object('/').update(updatedata);
  }
  getTotalparticipation(postid){
    return this.af.database.list('/postwise-participator/' + postid);
  }

  // Like Dislike logics
  getLikedDisliked(postid){
    return this.af.database.object('/postwise-likedDisliked/' + postid + "/" + this.fireauth.uid);
  }
  countLikesDislikes(postid){
    return this.af.database.object('/userwise-feed/' + this.fireauth.uid +"/"+ postid);
  }
  likeDislikePost(postid,liked,disliked){
    this.af.database.object('/postwise-likedDisliked/' + postid + "/" + this.fireauth.uid).update({
      liked : liked,
      disliked: disliked
    });
  }
  updateLikesDislikes(postid,likes,dislikes){

    let likedislikedata = {};

    likedislikedata["posts/" + postid + '/likes'] = likes;
    likedislikedata["posts/" + postid + '/dislikes'] = dislikes;
    likedislikedata["userwise-feed/" + this.fireauth.uid +"/"+ postid + '/likes'] = likes;
    likedislikedata["userwise-feed/" + this.fireauth.uid +"/"+ postid + '/dislikes'] = dislikes;
    this.authservice.getFollowers(this.fireauth.uid).subscribe(followers =>{
      for (let i = followers.length - 1; i >= 0; i--) {
        likedislikedata["userwise-feed/" + followers[i].$key +"/"+ postid + '/likes'] = likes;
        likedislikedata["userwise-feed/" + followers[i].$key +"/"+ postid + '/dislikes'] = dislikes;
      }
      this.af.database.object('/').update(likedislikedata);
    });
  }
}
