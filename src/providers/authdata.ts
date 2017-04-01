import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
//import { AuthProviders, AuthMethods} from 'angularfire2';
import firebase from 'firebase';


@Injectable()
export class Authdata {

  	posts: FirebaseListObservable<any[]>;
    post: FirebaseObjectObservable<any>;
    allposts: any;
    fireAuth: any;

    constructor(private af: AngularFire) {

      af.auth.subscribe(user=>{
        if(user) {
          this.fireAuth = user.auth;
          console.log(user);
        }
      });
    }
    
    addPost(post){
      this.posts.push(post);
    }
    getPost(id){
      return this.af.database.object('/posts/' + id);
    }
    getPosts(){     
      this.posts = this.af.database.list('/posts');
      return this.posts;
    }
    updateParticipating(id,participating){
      console.log(id);
      const items = this.af.database.list('/posts');
      items.update(id,{participating: participating});
    }

    // For Authentication
    signupUser(email: string, password: string) : firebase.Promise<any> {
      return this.af.auth.createUser({
        email: email,
        password: password
      });
    }
    loginUser(email: string ,password: string) : firebase.Promise<any> {
      return this.af.auth.login({
        email: email,
        password: password
      });
    }
    logoutUser(): firebase.Promise<any> {
      return this.af.auth.logout();
    }
}
