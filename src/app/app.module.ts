import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera} from '@ionic-native/camera';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { HomePage } from '../pages/home/home';
import { PostmodalPage } from '../pages/postmodal/postmodal';
import { CricketscorePage } from '../pages/cricketscore/cricketscore';
import { FootballscorePage} from '../pages/footballscore/footballscore';
import { HokeyscorePage } from '../pages/hokeyscore/hokeyscore';
import { BadmintonscorePage } from '../pages/badmintonscore/badmintonscore';
import { TenisscorePage } from '../pages/tenisscore/tenisscore';
import { TtscorePage } from '../pages/ttscore/ttscore';
import { PostPage } from '../pages/post/post';
import { AllpostsPage } from '../pages/allposts/allposts';
import { MomentsPage } from '../pages/moments/moments';
import { AchievePage } from '../pages/achieve/achieve';
import { UserprofilePage } from '../pages/userprofile/userprofile';
import { UsereditoptsPage } from '../pages/usereditopts/usereditopts';
import { PostmoreoptPage } from '../pages/postmoreopt/postmoreopt';

import { AuthService } from '../providers/auth-service';
import { PostService } from '../providers/post-service';
import { StorageService } from '../providers/storage-service';

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
    PostmodalPage,
    CricketscorePage,
    FootballscorePage,
    HokeyscorePage,
    BadmintonscorePage,
    TenisscorePage,
    TtscorePage,
    PostPage,
    AllpostsPage,
    MomentsPage,
    AchievePage,
    UserprofilePage,
    UsereditoptsPage,
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
    PostmodalPage,
    CricketscorePage,
    FootballscorePage,
    HokeyscorePage,
    BadmintonscorePage,
    TenisscorePage,
    TtscorePage,
    PostPage,
    AllpostsPage,
    MomentsPage,
    AchievePage,
    UserprofilePage,
    UsereditoptsPage,
    PostmoreoptPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
              Camera, AuthService,PostService,StorageService ,DatePicker]
})
export class AppModule {}
