import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { File } from 'ionic-native';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ToastController} from 'ionic-angular';
import * as firebase from 'firebase';


@Injectable()
export class PostService {

  posts: FirebaseListObservable<any[]>;
  post: FirebaseObjectObservable<any>;
  postnode: any;
  currentuser: any;
  fireAuth: any;
  storageRef: any;
  imageRef: any;

  constructor(public af: AngularFire,public toastCtrl: ToastController) {
    af.auth.subscribe(user=>{
        if(user) {
          this.fireAuth = user.auth;
          console.log(user);
        }
    });
    this.postnode = this.af.database.list('/posts');
    this.storageRef = firebase.storage().ref().child('images/');
  }
  addPost(post,userId){

    var updatedPostData = {};
    let newPostkey = this.postnode.push().key;

    updatedPostData["posts/" + newPostkey] = post;
    updatedPostData["userwise-post/" + userId +"/" + newPostkey] = post;
    this.af.database.object('/').update(updatedPostData);
  }
  addImagePost(post,userId,imagesrc){
    var updatedPostData = {};
    let newPostkey = this.postnode.push().key;
    
    // First put image to Storage and get url of the image 
    if(imagesrc) {
      let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child('images/').child(newPostkey).child('mainimage.jpg');
        imageRef.putString(imagesrc,'base64').then((savedimage)=>{
          post.imageurl = savedimage.downloadURL;
          let toast = this.toastCtrl.create({
            message: 'Success: image sent to the server :)',
            duration: 3000
          });
          toast.present();
        });
    }

    updatedPostData["posts/" + newPostkey] = post;
    updatedPostData["userwise-post/" + userId +"/" + newPostkey] = post;
    this.af.database.object('/').update(updatedPostData); 
  }

  uploadFile(post,userId,nativepath){
    this.showToast(nativepath);
    var updatedPostData = {};
    let newPostkey = this.postnode.push().key;

    // See cordova File plugin documentation .
    // get the file and store to firebase storage 
    (<any>window).resolveLocalFileSystemURL(nativepath, (res) =>{
      res.file((resFile)=>{
        this.showToast("File selected with native path given");
        let reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) =>{
          let imgBlob = new Blob([evt.target.result],{type: 'image/jpeg'});
          this.showToast("blob created");
          // Now store the blob(i.e raw data. One kind of file)
          this.imageRef = this.storageRef.child(`/${newPostkey}/main.jpg`);
          this.showToast("image ref created");
          this.imageRef.put(imgBlob).then((res)=>{
            this.showToast("blob sent");
            post.imageurl = res.downloadURL;
            this.showToast('Success: image sent to the server and got url:)');
            updatedPostData["posts/" + newPostkey] = post;
            updatedPostData["userwise-post/" + userId +"/" + newPostkey] = post;
            this.af.database.object('/').update(updatedPostData);
          }).catch((err)=>{
            this.showToast('Failed to upload image :(');
          })
        }
      })
    })
  }

  showToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  getPost(id){
    return this.af.database.object('/posts/' + id);
  }
  getPosts(){     
    this.posts = this.af.database.list('/posts');
    return this.posts;
  }
  getParticipated(postid: any){
    return this.af.database.object('/posts-participator/' + postid + "/" + this.fireAuth.uid);
  }
  updateParticipated(postid: any,participated: boolean){
    console.log(postid);
    const item = this.af.database.object('/posts-participator/' + postid + "/" + this.fireAuth.uid);
    item.update({participated: participated});
  }
  removeParticipated(postid: any,participated: boolean){
    console.log(postid);
    const item = this.af.database.object('/posts-participator/' + postid + "/" + this.fireAuth.uid);
    item.remove();
  }
  updateParticipating(postid: any,participating: number){
    const item = this.af.database.object('/posts/' + postid);
    item.update({participating: participating});
  }
}
