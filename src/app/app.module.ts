import { NgModule ,ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { SuperTabsModule,SuperTabsController } from 'ionic2-super-tabs';


// It's for reactive forms . For template driven form use 'FormsModule' 
import { ReactiveFormsModule } from '@angular/forms';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera} from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { Feedpipe } from '../pipes/feedpipe';
import { Youtube } from '../pipes/youtube';
import { Parallaxprofile } from '../components/parallaxprofile/parallaxprofile';
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
import { MypostPage } from '../pages/mypost/mypost';
import { PostPage } from '../pages/post/post';
import { MomentsPage } from '../pages/moments/moments';
import { AchievePage } from '../pages/achieve/achieve';
import { UserprofilePage } from '../pages/userprofile/userprofile';
import { UsereditoptsPage } from '../pages/usereditopts/usereditopts';
import { EditPostPage } from '../pages/edit-post/edit-post';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { PostmoreoptPage } from '../pages/postmoreopt/postmoreopt';
import { ClubplayersPage } from '../pages/clubplayers/clubplayers';
import { FollowersPage } from '../pages/followers/followers';
import { FollowingsPage } from '../pages/followings/followings';
import { GooglemapPage } from '../pages/googlemap/googlemap';
import { GooglemapdistancePage } from '../pages/googlemapdistance/googlemapdistance';
import { PostcommentsPage } from '../pages/postcomments/postcomments';
import { CommentrepliesPage } from '../pages/commentreplies/commentreplies';
import { NewleaguePage } from '../pages/newleague/newleague';
import { ParticipatingPage } from '../pages/participating/participating';
import { OrganizingPage } from '../pages/organizing/organizing';
import { AllclubsPage } from '../pages/allclubs/allclubs';

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
    Feedpipe,
    Youtube,
    Parallaxprofile,
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
    MypostPage,
    PostPage,
    MomentsPage,
    AchievePage,
    UserprofilePage,
    UsereditoptsPage,
    EditPostPage,
    EditProfilePage,
    PostmoreoptPage,
    ClubplayersPage,
    FollowersPage,
    FollowingsPage,
    GooglemapPage,
    GooglemapdistancePage,
    PostcommentsPage,
    CommentrepliesPage,
    NewleaguePage,
    ParticipatingPage,
    OrganizingPage,
    AllclubsPage
  ],
  imports: [
    //FormsModule, for template driven form
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig,AuthConfig),
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot()
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
    MypostPage,
    PostPage,
    MomentsPage,
    AchievePage,
    UserprofilePage,
    UsereditoptsPage,
    EditPostPage,
    EditProfilePage,
    PostmoreoptPage,
    ClubplayersPage,
    FollowersPage,
    FollowingsPage,
    GooglemapPage,
    GooglemapdistancePage,
    PostcommentsPage,
    CommentrepliesPage,
    NewleaguePage,
    ParticipatingPage,
    OrganizingPage,
    AllclubsPage
  ],
  providers: [
    Camera,
    MediaCapture,
    DatePicker,
    GoogleMaps,
    Geolocation,
    AuthService,
    PostService,
    StorageService,
    SuperTabsController,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
