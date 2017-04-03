import { Component , OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';



@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html'
})
export class UserprofilePage implements OnInit{

	useremail: any;
	userservice: any;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public authservice: AuthService
	) {}

	ngOnInit(){
		this.userservice = this.authservice.getmyprofile().subscribe(user =>{
			this.useremail = user.email;
			console.log(user);
		});
	}
	ngOnDestroy(){
		this.userservice.unsubscribe();
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad UserprofilePage');
	}
}
