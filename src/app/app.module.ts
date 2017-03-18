import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { ClubprofilePage } from '../pages/clubprofile/clubprofile';
import { AllpostsPage } from '../pages/allposts/allposts';
import { MomentsPage } from '../pages/moments/moments';
import { AchievePage } from '../pages/achieve/achieve';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PostPage,
    ClubprofilePage,
    AllpostsPage,
    MomentsPage,
    AchievePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PostPage,
    ClubprofilePage,
    AllpostsPage,
    MomentsPage,
    AchievePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
