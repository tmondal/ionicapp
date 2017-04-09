import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController ,ToastController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
  providers: [FileChooser,FilePath]
})
export class EditProfilePage implements OnInit{

	authuid: any;
	user: any;
	authsubscription: any;
	name: any;
	contactno: any;
	currentclub: any;
	profilenativepath: any;
	covernativepath: any;
	coverselected: boolean = false;
	profileselected: boolean = false;
	nameselected: boolean = false;
	contactselected: boolean = false;
	clubselected: boolean = false;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public af: AngularFire,
		public authservice: AuthService,
		private fileChooser: FileChooser,
		private filePath: FilePath
	) {}

	ngOnInit(){		
		this.af.auth.subscribe(user=>{
			if(user) {
				this.authuid = user.auth.uid;				
			}
		});
		this.authsubscription = this.authservice.getuserbyId(this.authuid).subscribe((user)=>{
			this.user = user;
		});
	}
	chooseCoverFile(){
		this.fileChooser.open().then((uri) =>{
			this.filePath.resolveNativePath(uri).then( (filepath) =>{
				this.covernativepath = filepath;
				this.showToast('Success: File choosen :-)');
				this.coverselected = true;
			}).catch((err)=>{
				this.showToast('Failed: could not get native path');
			})
		}).catch((err)=>{
			this.showToast('Failed to choose file :-( ');
		})
	}
	chooseProfileFile(){
		this.fileChooser.open().then((uri) =>{
			this.filePath.resolveNativePath(uri).then( (filepath) =>{
				this.profilenativepath = filepath;
				this.showToast('Success: File choosen :-)');
				this.profileselected = true;
			}).catch((err)=>{
				this.showToast('Failed: could not get native path');
			})
		}).catch((err)=>{
			this.showToast('Failed to choose file :-( ');
		})
	}
	showToast(message){
	    let toast = this.toastCtrl.create({
	      message: message,
	      duration: 3000
	    });
	    toast.present();
	}

	oncoverSubmit(){
		this.coverselected = false;
		if(this.covernativepath) {			
			this.authservice.updateCoverphoto(this.covernativepath);
		}else{
			this.showToast("Please select a file (-_-)");
		}
	}
	oncoverCancel(){
		this.coverselected = false;
	}
	onprofileSubmit(){
		this.profileselected = false;
		if(this.profilenativepath) {
			this.authservice.updateProfilephoto(this.profilenativepath);
		}else{
			this.showToast("Please select a file (-_-)");
		}
	}
	onprofileCancel(){
		this.profileselected = false;
	}
	nameTouched(){
		this.nameselected = true;
	}
	onnameSubmit(){
		this.nameselected = true;
		if(this.name) {			
			this.authservice.updateName(this.name);
		}else{
			this.showToast("Please enter your name (-_-)");
		}
	}
	onnameCancel(){
		this.nameselected = false;
	}
	contactTouched(){
		this.contactselected = true;
	}
	oncontactSubmit(){
		this.contactselected = false;
		if(this.contactno) {			
			this.authservice.updateContactno(this.contactno);
		}else{
			this.showToast("Kindly enter contact no <'!'> ");
		}
	}
	oncontactCancel(){
		this.contactselected = false;
	}
	clubTouched(){
		this.clubselected = true;
	}
	onclubSubmit(){
		this.clubselected = false;
		if(this.currentclub) {			
			this.authservice.updateCurrentClub(this.currentclub);
		}else{
			this.showToast("Please give new club ('!')");
		}
	}
	onclubCancel(){
		this.clubselected = false;
	}
	ngOnDestroy(){
		this.authsubscription.unsubscribe();
	}
	onCancel(){
		this.viewCtrl.dismiss();
	}
  
}
