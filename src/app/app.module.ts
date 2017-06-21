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
    MyApp,
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
