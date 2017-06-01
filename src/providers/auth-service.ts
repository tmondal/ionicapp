import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ToastController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { AngularFire } from 'angularfire2';
import { File } from 'ionic-native';
import * as firebase from 'firebase';


@Injectable()
export class AuthService {

    auth: any;
    storageRef: any;
    imageRef: any;
    coverimageurl: any;
    profileimageurl: any;
    profile: any;
    following: any;
    loading: any;
    progress: any;
    constructor(
      public af: AngularFire,
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController,
    ) {

      af.auth.subscribe(user=>{
        if(user) {
          this.auth = user.auth;
          console.log(user);
        }
      });
      this.storageRef = firebase.storage().ref().child('images/');
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
    getuserbyId(userId){
      this.profile =  this.af.database.object('/users/' + userId); 
      return this.profile.take(1);
    }
    getuserbyName(name){
      return this.af.database.list('/users/',{
        query: {
          orderByChild: 'name',
          startAt: name,
          endAt: name + "\uf8ff"
        }
      })
    }
    getmyprofile(){
      this.profile =  this.af.database.object('/users/' + this.auth.uid);
      return this.profile.take(1);
    }
    getClubstofollow(){
      return this.af.database.list('/users/',{
        query: {
          orderByChild: 'usertype',
          equalTo: 'club'
        }
      }).take(1);
    }
    getPlayerstofollow(){
      return this.af.database.list('/users/',{
        query: {
          orderByChild: 'usertype',
          equalTo: 'player'
        }
      }).take(1);
    }

    updateProfilephoto(imagesrc){

      // First put image to Storage and get url of the image
      if(imagesrc) {
        this.loading = this.loadingCtrl.create({content: "Wait image uploading.."});
        this.loading.present();

        this.imageRef = this.storageRef.child(`/${this.auth.uid}/profile.jpg`);
        this.showToast("Storage ref created..");

        let uploadTask = this.imageRef.putString(imagesrc,'base64');
        this.showToast("putstring called..");
        uploadTask.on('state_changed',

          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            
          }, (error) => {
            this.loading.dismiss().then(()=>{
              this.showToast("Error occured during data send to server..");
            });
          },(success) =>{
            this.profileimageurl = uploadTask.snapshot.downloadURL;
            this.af.database.object('/users/' + this.auth.uid).update({profileimage: this.profileimageurl});
            this.loading.dismiss().then(()=>{
              this.showToast('Success: profile photo updated :)');              
            });
          }
        );
      }else{
        alert("You should not see this message. If you see then Bad designer.");
      }
    }

    updateCoverphoto(imagesrc){

      // First put image to Storage and get url of the image
      if(imagesrc) {
        this.loading = this.loadingCtrl.create({content: "Wait image uploading.."});
        this.loading.present();

        this.imageRef = this.storageRef.child(`/${this.auth.uid}/cover.jpg`);
        this.showToast("Storage ref created..");

        let uploadTask = this.imageRef.putString(imagesrc,'base64');
        this.showToast("putstring called..");
        uploadTask.on('state_changed',

          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            
          }, (error) => {
            this.loading.dismiss().then(()=>{
              this.showToast("Error occured during data send to server..");
            });
          },(success) =>{
            this.coverimageurl = uploadTask.snapshot.downloadURL;
            this.af.database.object('/users/' + this.auth.uid).update({coverimage: this.coverimageurl});
            this.loading.dismiss().then(()=>{
              this.showToast('Success: cover photo updated :)');              
            });
          }
        );
      }else{
        alert("You should not see this message. If you see then Bad designer.");
      }
    }

    showToast(message){
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
    }
    updateLocation(lat,lng){
      this.af.database.object('/users/' + this.auth.uid).update({lattitude: lat,longitude: lng})
        .then(
          success => this.showToast("Success: Location updated."),
          error => this.showToast("Failed to update location.")
         );
    }
    updateName(name){
      this.af.database.object('/users/' + this.auth.uid).update({name: name})
        .then(
          success => this.showToast("Success: Name updated"),
          error => this.showToast("Faild to update name. Try again!")
        );
    }
    updateContactno(contactno){
      this.af.database.object('/users/' + this.auth.uid).update({contactno: contactno})
        .then(
          success => this.showToast("Success: contact no updated"),       
          error => this.showToast("Failed: contact no failed to update")
        );
    }
    updateCurrentClub(club){
      this.af.database.object('/users/' + this.auth.uid).update({currentclub: club}).then((success)=>{
        this.showToast("Success: updated current club name");
      },(error)=>{
        this.showToast("Failed: current club name not updated");
      }); 
    }
    
    followuser(targetuserId: any){
      let followuserdata = {};

      followuserdata["userwise-followers/" + targetuserId + "/" + this.auth.uid] = {following: true};
      followuserdata["userwise-following/" + this.auth.uid + "/" + targetuserId] = {following: true};
      this.af.database.object('/').update(followuserdata);
    }
    unfollowuser(targetuserId: any){
      const follower = this.af.database.object("/userwise-followers/" + targetuserId + "/" + this.auth.uid);
      follower.remove();
      const following = this.af.database.object("/userwise-following/" + this.auth.uid + "/" + targetuserId);
      following.remove();
    }
    checkIffollowing(targetuserId: any){
      this.following = this.af.database.object("/userwise-following/" + this.auth.uid + "/" + targetuserId);
      return this.following.take(1); // take function does unsubscribe at the end which is good
    }
    getFollowers(userid){
      return this.af.database.list('/userwise-followers/' + userid).take(1);
    }
    getFollowings(userid){
      return this.af.database.list('/userwise-following/' + userid).take(1);
    }
}
