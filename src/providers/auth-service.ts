import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFire } from 'angularfire2';
import firebase from 'firebase';


@Injectable()
export class AuthService {

    fireAuth: any;

    constructor(private af: AngularFire) {

      af.auth.subscribe(user=>{
        if(user) {
          this.fireAuth = user.auth;
          console.log(user);
        }
      });
    }

    // For Authentication
    signupUser(email: string, password: string, usertype: string) : firebase.Promise<any> {
      return this.af.auth.createUser({
        email: email,
        password: password
      }).then(newuser =>{
        console.log(newuser.uid);
        this.af.database.object('/users/' + newuser.uid)
          .set({email: email,usertype: usertype}); 
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
    getuserprofile(){
      return this.af.database.object('/users/' + this.fireAuth.uid);
    }
    getuserbyId(userId){
      return this.af.database.object('/users/' + userId); 
    }
}
