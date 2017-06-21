import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav} from 'ionic-angular';
import { StatusBar,Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
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

		this.af.auth.subscribe(user =>{
			if(user) {
				this.rootPage = "Home";

				this.authservice.getmyprofile().subscribe(user =>{
					this.username = user.name;
					this.profileimage = user.profileimage;
				});
			}else{
				this.rootPage = "Login";
			}
		});

		platform.ready().then(() => {
		  StatusBar.styleDefault();
		  Splashscreen.hide();
		});
		this.pages = [
	    	{ title: 'Home', icon: "home", component: "Home" },
	    	{ title: 'Organizing', icon: "bulb",component: "Organizing" },
	    	{ title: 'Participating', icon: "walk",component: "Participating" },
	    	{ title: 'Create League', icon: "create", component: "Newleague" },
	    	{ title: 'Manage League', icon: "options",component: 'Manageleague'},
	  	]
	}
	openPage(page){
		if (page.component == "Home") {
			
			this.nav.setRoot(page.component);
		}else {
			this.nav.push(page.component);
		}
	}
}
