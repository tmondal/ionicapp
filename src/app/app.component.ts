import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav} from 'ionic-angular';
import { StatusBar,Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AngularFire } from 'angularfire2';
import { NewleaguePage } from '../pages/newleague/newleague';
import { TabsPage } from '../pages/tabs/tabs';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	
	rootPage : any;
	@ViewChild(Nav) nav: Nav;

	pages: Array<{title: string, component: any}>;


	constructor(platform: Platform, public af: AngularFire) {

		const authObserver = af.auth.subscribe(user =>{
			if(user) {
				this.rootPage = TabsPage;
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
	    	{ title: 'Create League', component: NewleaguePage },
	    	{ title: 'Feed', component: TabsPage },
	  	]
	}
	openPage(page){
		this.nav.setRoot(page.component);
	}
}
