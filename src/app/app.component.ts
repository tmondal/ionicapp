import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav} from 'ionic-angular';
import { StatusBar,Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ParticipatingPage } from '../pages/participating/participating';
import { OrganizingPage } from '../pages/organizing/organizing';
import { NewleaguePage } from '../pages/newleague/newleague';


import { AuthService } from '../providers/auth-service';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	
	@ViewChild(Nav) nav: Nav;
	rootPage : any;

	pages: Array<{title: string,icon: string, component: any}>;
	username: any;
	profileimage: any;

	constructor(platform: Platform, public af: AngularFire,public authservice: AuthService) {

		const authObserver = af.auth.subscribe(user =>{
			if(user) {
				this.rootPage = HomePage;

				this.authservice.getuserbyId(user.uid).subscribe(user =>{
					this.username = user.name;
					this.profileimage = user.profileimage;
				});
				authObserver.unsubscribe();
			}else{
				this.rootPage = LoginPage;
				authObserver.unsubscribe();
			}
		});

		platform.ready().then(() => {
		  StatusBar.styleDefault();
		  Splashscreen.hide();
		});
		this.pages = [
	    	{ title: 'Home', icon: "home", component: HomePage },
	    	{ title: 'Organizing', icon: "bulb",component: OrganizingPage },
	    	{ title: 'Participating', icon: "walk",component: ParticipatingPage },
	    	{ title: 'Create League', icon: "create", component: NewleaguePage },
	    	{ title: 'Manage League', icon: "options",component: 'Manageleague'},
	    	{ title: 'Update Result', icon: "medal",component: 'Matchresult'},

	  	]
	}
	openPage(page){
		this.nav.setRoot(page.component);
	}
}
