import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav} from 'ionic-angular';
import { StatusBar,Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AngularFire } from 'angularfire2';
import { NewleaguePage } from '../pages/newleague/newleague';
import { TabsPage } from '../pages/tabs/tabs';

import { AuthService } from '../providers/auth-service';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	
	rootPage : any;
	@ViewChild(Nav) nav: Nav;

	pages: Array<{title: string, component: any}>;
	username: any;
	profileimage: any;

	constructor(platform: Platform, public af: AngularFire,public authservice: AuthService) {

		const authObserver = af.auth.subscribe(user =>{

			if(user) {
				this.rootPage = TabsPage;
				authObserver.unsubscribe();
			}else{
				this.rootPage = LoginPage;
				authObserver.unsubscribe();
			}
			this.authservice.getuserbyId(user.uid).subscribe(user =>{
				this.username = user.name;
				this.profileimage = user.profileimage;
			})
		});

		platform.ready().then(() => {
		  StatusBar.styleDefault();
		  Splashscreen.hide();
		});
		this.pages = [
	    	{ title: 'Create League', component: NewleaguePage },
	    	{ title: 'Feed', component: TabsPage },
	  	]
	}
	openPage(page){
		this.nav.setRoot(page.component);
	}
}
