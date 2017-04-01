import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';



@Injectable()
export class PostService {

  posts: FirebaseListObservable<any[]>;
  post: FirebaseObjectObservable<any>;
  postnode: any;
  currentuser: any;

  constructor(public af: AngularFire) {
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
  updateParticipating(postid,participating){
    console.log(postid);
    const items = this.af.database.list('/posts');
    items.update(postid,{participating: participating});
  }

}
