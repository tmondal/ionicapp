import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';



@Injectable()
export class PostService {

  posts: FirebaseListObservable<any[]>;
  post: FirebaseObjectObservable<any>;
  postnode: any;
  currentuser: any;
  fireAuth: any;

  constructor(public af: AngularFire) {
    af.auth.subscribe(user=>{
        if(user) {
          this.fireAuth = user.auth;
          console.log(user);
        }
    });
    this.postnode = this.af.database.list('/posts');
  }
  addPost(post,userId){

    var updatedPostData = {};

    let newPostkey = this.postnode.push().key;

    updatedPostData["posts/" + newPostkey] = post;
    updatedPostData["userwise-post/" + userId +"/" + newPostkey] = post;
    this.af.database.object('/').update(updatedPostData);
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
