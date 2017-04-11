import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { AngularFire } from 'angularfire2';
import { ToastController} from 'ionic-angular';
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

    constructor(private af: AngularFire,public toastCtrl: ToastController) {

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
    getmyprofile(){
      this.profile =  this.af.database.object('/users/' + this.auth.uid);
      return this.profile.take(1);
    }

    updateCoverphoto(covernativepath){
      // See cordova File plugin documentation.Get the file and store to firebase storage 

      (<any>window).resolveLocalFileSystemURL(covernativepath, (res) =>{
        res.file((resFile)=>{
          this.showToast("File selected with native path given");
          let reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) =>{
            let imgBlob = new Blob([evt.target.result],{type: 'image/jpeg'});
            this.showToast("blob created");
            // Now store the blob(i.e raw data. One kind of file)
            this.imageRef = this.storageRef.child(`/${this.auth.uid}/cover.jpg`);
            this.showToast("image ref created");
            this.imageRef.put(imgBlob).then((res)=>{
              this.showToast("blob sent");
              this.coverimageurl = res.downloadURL;
              this.showToast('Success: coverphoto updated :)');              
              // update database accordingly
              this.af.database.object('/users/' + this.auth.uid).update({coverimage: this.coverimageurl});   
            }).catch((err)=>{
              this.showToast('Failed to update cover photo :(');
            })
          }
        })
      })
    }
    updateProfilephoto(profilenativepath){

      (<any>window).resolveLocalFileSystemURL(profilenativepath, (res) =>{
        res.file((resFile)=>{
          let reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) =>{
            let imgBlob = new Blob([evt.target.result],{type: 'image/jpeg'});
            // Now store the blob(i.e raw data. One kind of file)
            this.imageRef = this.storageRef.child(`/${this.auth.uid}/profile.jpg`);
            this.imageRef.put(imgBlob).then((res)=>{
              this.profileimageurl = res.downloadURL;
              this.showToast('Success: profilephoto updated :)');
              // update database accordingly
              this.af.database.object('/users/' + this.auth.uid).update({profileimage: this.profileimageurl}); 
            }).catch((err)=>{
              this.showToast('Failed to update profile photo :(');
            })
          }
        })
      }) 
    }
    showToast(message){
      let toast = this.toastCtrl.create({
        message: message,
        duration: 10000
      });
      toast.present();
    }
    updateName(name){
      this.af.database.object('/users/' + this.auth.uid).update({name: name});
    }
    updateContactno(contactno){
      this.af.database.object('/users/' + this.auth.uid).update({contactno: contactno});
    }
    updateCurrentClub(club){
      this.af.database.object('/users/' + this.auth.uid).update({currentclub: club}); 
    }
    
    followuser(targetuserId: any){
      let followuserdata = {};

      followuserdata["users-followers/" + targetuserId + "/" + this.auth.uid] = {following: true};
      followuserdata["users-following/" + this.auth.uid + "/" + targetuserId] = {following: true};
      this.af.database.object('/').update(followuserdata);
    }
    unfollowuser(targetuserId: any){
      const follower = this.af.database.object("/users-followers/" + targetuserId + "/" + this.auth.uid);
      follower.remove();
      const following = this.af.database.object("/users-following/" + this.auth.uid + "/" + targetuserId);
      following.remove();
    }
    checkiffollowing(targetuserId: any){
      this.following = this.af.database.object("/users-following/" + this.auth.uid + "/" + targetuserId);
      return this.following.take(1); // take function does unsubscribe at the end which is good
    }
}
