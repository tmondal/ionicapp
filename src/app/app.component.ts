import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav} from 'ionic-angular';
import { StatusBar,Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { NewleaguePage } from '../pages/newleague/newleague';


import { AuthService } from '../providers/auth-service';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	
	@ViewChild(Nav) nav: Nav;
	rootPage : any;

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
	    	{ title: 'Feed', component: TabsPage },
	    	{ title: 'League Create', component: NewleaguePage },
	    	{ title: 'Manage League',component: 'Manageleague'}
	  	]
	}
	openPage(page){
		this.nav.setRoot(page.component);
	}
}
