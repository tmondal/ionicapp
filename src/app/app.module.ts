import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { ClubprofilePage } from '../pages/clubprofile/clubprofile';
import { AllpostsPage } from '../pages/allposts/allposts';
import { MomentsPage } from '../pages/moments/moments';
import { AchievePage } from '../pages/achieve/achieve';
import { PlayerprofilePage } from '../pages/playerprofile/playerprofile';
import { PostmodalPage } from '../pages/postmodal/postmodal';
import { PostmoreoptPage } from '../pages/postmoreopt/postmoreopt';

import { Authdata } from '../providers/authdata';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';


const firebaseConfig = {
  apiKey: "AIzaSyAX8lLyGEyz6mkV_Rcxp9oirH1kEkUgMK8",
  authDomain: "sportionic.firebaseapp.com",
  databaseURL: "https://sportionic.firebaseio.com",
  storageBucket: "sportionic.appspot.com",
  messagingSenderId: "602922970263"
};
const AuthConfig = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
}


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ResetpasswordPage,
    HomePage,
    PostPage,
    ClubprofilePage,
    AllpostsPage,
    MomentsPage,
    AchievePage,
    PlayerprofilePage,
    PostmodalPage,
    PostmoreoptPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig,AuthConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ResetpasswordPage,
    HomePage,
    PostPage,
    ClubprofilePage,
    AllpostsPage,
    MomentsPage,
    AchievePage,
    PlayerprofilePage,
    PostmodalPage,
    PostmoreoptPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Authdata]
})
export class AppModule {}
