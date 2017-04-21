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
  storageRef: any;
  imageRef: any;
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
    this.storageRef = firebase.storage().ref().child('images/');
  }
  tournamentAndHiringPost(post,userId,nativepath){ // image optional

    this.loading = this.loadingCtrl.create({
      content: "Sending to server..."
    });
    this.loading.present();

    let updatedPostData = {};
    let newpostkey = this.postnode.push().key;

    if(nativepath) {
      (<any>window).resolveLocalFileSystemURL(nativepath, (res) =>{
        res.file((resFile)=>{
          let reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) =>{
            let imgBlob = new Blob([evt.target.result],{type: 'image/jpeg'});
            this.imageRef = this.storageRef.child(`/${newpostkey}/main.jpg`);
            this.imageRef.put(imgBlob).then((res)=>{

              post.imageurl = res.downloadURL;
              this.showToast('Success: image uploaded :)');
              updatedPostData["posts/" + newpostkey] = post;
              updatedPostData["userwise-feed/" + userId +"/"+ newpostkey] = post;
              this.authservice.getFollowers(userId).subscribe(followers =>{
                for (let i = followers.length - 1; i >= 0; i--) {
                  updatedPostData["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
                }
                this.af.database.object('/').update(updatedPostData);
                this.loading.dismiss().then(()=>{
                  alert("Post added without image.\n But post with image looks good :)");
                });
              });
            }).catch((err)=>{
              this.loading.dismiss().then(()=>{
                this.showToast('Failed to upload image :(');
              });
            })
          }
        })
      })
    }else{
      updatedPostData["posts/" + newpostkey] = post;
      updatedPostData["userwise-feed/" + userId +"/"+ newpostkey] = post;
      this.authservice.getFollowers(userId).subscribe(followers =>{
        for (let i = followers.length - 1; i >= 0; i--) {
          updatedPostData["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
        }
        this.af.database.object('/').update(updatedPostData);
        this.loading.dismiss().then(()=>{
          alert("Post added without image.\n But post with image looks good :)");
        });
      });
    }

  }

  cameraimagePost(post,userId,imagesrc){

    this.loading = this.loadingCtrl.create({
      content: "Wait !! sending to server... "
    });
    this.loading.present();

    let updatedPostData = {};
    let newpostkey = this.postnode.push().key;
    
    // First put image to Storage and get url of the image 
    if(imagesrc) {

      this.imageRef = this.storageRef.child(`/${newpostkey}/main.jpg`);
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
          updatedPostData["posts/" + newpostkey] = post;
          updatedPostData["userwise-feed/" + userId +"/"+ newpostkey] = post;
          this.authservice.getFollowers(userId).subscribe(followers =>{
            for (let i = followers.length - 1; i >= 0; i--) {
              updatedPostData["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
            }
            this.af.database.object('/').update(updatedPostData);
            this.loading.dismiss().then(()=>{
              alert("Post added without image.\n But post with image looks good :)");
            });
          });
        }
      );
    }
    else{
      this.loading.dismiss().then(()=>{
        this.showToast("Please select an image..");
      });
    }
  }
  
  cameravideoPost(post,userId,videosrc){
    this.loading = this.loadingCtrl.create({
      content: "Wait !! sending to server... "
    });
    this.loading.present();

    let updatedPostData = {};
    let newpostkey = this.postnode.push().key;
    
    if(videosrc) {

      this.imageRef = this.storageRef.child(`/${newpostkey}/main.mp4`);
      this.showToast("Storage ref created..");

      let uploadTask = this.imageRef.putString(videosrc,'base64');
      this.showToast("putString called..");
      uploadTask.on('state_changed',

        (snapshot) => {
          this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          
        }, (error) => {
          this.loading.dismiss().then(()=>{
            this.showToast("Error occured during data send to server..");
          });
        },(success) =>{
          post.videourl = uploadTask.snapshot.downloadURL;
          this.showToast('Success: video sent to the server and got url:)');
          updatedPostData["posts/" + newpostkey] = post;
          updatedPostData["userwise-feed/" + userId +"/"+ newpostkey] = post;
          this.authservice.getFollowers(userId).subscribe(followers =>{
            for (let i = followers.length - 1; i >= 0; i--) {
              updatedPostData["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
            }
            this.af.database.object('/').update(updatedPostData);
            this.loading.dismiss().then(()=>{
              alert("Post added without image.\n But post with image looks good :)");
            });
          });
        }
      );
    }
    else{
      this.loading.dismiss().then(()=>{
        this.showToast("Please take a video..");
      });
    }
  }

  fileimagePost(post,userId,nativepath){
    
    this.loading = this.loadingCtrl.create({
      content: "Sending to server..."
    });
    this.loading.present();

    let updatedPostData = {};
    let newpostkey = this.postnode.push().key;

    // See cordova File plugin documentation .
    // get the file and store to firebase storage 
    if(nativepath) {      
      (<any>window).resolveLocalFileSystemURL(nativepath, (res) =>{
        res.file((resFile)=>{
          this.showToast("File selected with native path given");
          let reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) =>{
            let imgBlob = new Blob([evt.target.result],{type: 'image/jpeg'});
            this.showToast("blob created");
            // Now store the blob(i.e raw data. One kind of file)
            this.imageRef = this.storageRef.child(`/${newpostkey}/main.jpg`);
            this.showToast("image ref created");
            this.imageRef.put(imgBlob).then((res)=>{
              this.showToast("blob sent");
              post.imageurl = res.downloadURL;
              this.showToast('Success: image sent to the server and got url:)');
              updatedPostData["posts/" + newpostkey] = post;
              updatedPostData["userwise-feed/" + userId +"/"+ newpostkey] = post;
              this.authservice.getFollowers(userId).subscribe(followers =>{
                for (let i = followers.length - 1; i >= 0; i--) {
                  updatedPostData["userwise-feed/" + followers[i].$key +"/" + newpostkey] = post;
                }
                this.af.database.object('/').update(updatedPostData);
                this.loading.dismiss().then(()=>{
                  alert("Post added without image.\n But post with image looks good :)");
                });
              });
            }).catch((err)=>{
              this.loading.dismiss().then(()=>{
                this.showToast('Failed to upload image :(');
              });
            })
          }
        })
      })
    }else{
      this.showToast("Please select an image..");
    }
  }

  scoreAndMatchresultPost(post,userId){ // No image. Simple post

    let updatedPostData = {};
    let newpostkey = this.postnode.push().key;

    updatedPostData["posts/" + newpostkey] = post;
    updatedPostData["userwise-feed/" + userId +"/"+ newpostkey] = post;
    this.authservice.getFollowers(userId).subscribe(followers =>{
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
    }).take(1);
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
    return this.af.database.object('/posts/' + postid);
  }
  likeDislikePost(postid,liked,disliked){
    this.af.database.object('/postwise-likedDisliked/' + postid + "/" + this.fireauth.uid).update({
      liked : liked,
      disliked: disliked
    });
  }
  updateLikesDislikes(postid,likes,dislikes){
    this.af.database.object('/posts/' + postid).update({
      likes : likes,
      dislikes: dislikes
    });
  }
}
