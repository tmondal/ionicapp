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
	loggedIn: boolean = false;
	clubpages: Array<{title: string,icon: string, component: any}>;
	playerpages: Array<{title: string,icon: string, component: any}>;
	username: any;
	profileimage: any;
	usertype: any;

	constructor(platform: Platform, public af: AngularFire,public authservice: AuthService) {

		this.af.auth.subscribe(user =>{
			this.loggedIn = true;
			if(user) {

				this.rootPage = 'Home';
				this.authservice.getmyprofile().subscribe(user =>{
					this.usertype = user.usertype;
					this.username = user.name;
					this.profileimage = user.profileimage;
				});
			}else{
				this.loggedIn = false;
				this.rootPage = 'Login';
			}
		});

		platform.ready().then(() => {
		  StatusBar.styleDefault();
		  Splashscreen.hide();
		});
		this.clubpages = [
	    	{ title: 'Home', icon: "home", component: 'Home' },
	    	{ title: 'Organizing', icon: "bulb",component: 'Organizing' },
	    	{ title: 'Participating', icon: "walk",component: 'Participating' },
	    	{ title: 'Create League', icon: "create", component: 'Createleague' },
	    	{ title: 'Manage League', icon: "options",component: 'Manageleague'},
	    	{ title: 'How to use the app?', icon: "book", component: 'Guide' },
	  	]
	  	this.playerpages = [
	  		{ title: 'Home', icon: "home", component: 'Home' },
	    	{ title: 'Organizing', icon: "bulb",component: 'Organizing' },
	    	{ title: 'Participating', icon: "walk",component: 'Participating' },
	    	{ title: 'How to use the app?', icon: "book", component: 'Guide' },	    	
	  	]
	}
	openPage(page){
		if (page.component == 'Home') {
			this.nav.setRoot(page.component);
		}else {
			this.nav.push(page.component);
		}
	}
}
