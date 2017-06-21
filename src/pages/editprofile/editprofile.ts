import { Component, OnInit } from '@angular/core';
import { IonicPage,NavController, NavParams, ViewController ,ToastController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Camera ,CameraOptions} from '@ionic-native/camera';

import { AuthService } from '../../providers/auth-service';


@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class Editprofile implements OnInit{

	authuid: any;
	usertype: any = null;
	name: any = null;
	contactno: any = null;
	currentclub: any = null;
	sportname: any;
	authsubscription: any;
	coverselected: boolean = false;
	profileselected: boolean = false;
	nameselected: boolean = false;
	contactselected: boolean = false;
	clubselected: boolean = false;
	sportnameselected: boolean = false;
	selectimagedata: any;
	cameraimagedata: any;
	imagetaken: boolean = false;
	galleryimage: boolean = false;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public af: AngularFire,
		public authservice: AuthService,
		public camera: Camera,
	) {}

	ngOnInit(){		
		this.af.auth.subscribe(user=>{
			if(user) {
				this.authuid = user.auth.uid;				
			}
		});
		this.authsubscription = this.authservice.getuserbyId(this.authuid).subscribe((user)=>{
			this.usertype = user.usertype;
			this.name = user.name;
			this.contactno = user.contactno;
			this.currentclub = user.currentclub;
			this.sportname = user.sportname;
		});
	}
	// chooseCoverFile(){
	// 	this.fileChooser.open().then((uri) =>{
	// 		this.filePath.resolveNativePath(uri).then( (filepath) =>{
	// 			this.covernativepath = filepath;
	// 			this.showToast('Success: File choosen :-)');
	// 			this.coverselected = true;
	// 		}).catch((err)=>{
	// 			this.showToast('Failed: could not get native path');
	// 		})
	// 	}).catch((err)=>{
	// 		this.showToast('Failed to choose file :-( ');
	// 	})
	// }
	// chooseProfileFile(){
	// 	this.fileChooser.open().then((uri) =>{
	// 		this.filePath.resolveNativePath(uri).then( (filepath) =>{
	// 			this.profilenativepath = filepath;
	// 			this.showToast('Success: File choosen :-)');
	// 			this.profileselected = true;
	// 		}).catch((err)=>{
	// 			this.showToast('Failed: could not get native path');
	// 		})
	// 	}).catch((err)=>{
	// 		this.showToast('Failed to choose file :-( ');
	// 	})
	// }

	selectCoverimage(){
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 1000,
      		targetHeight: 800,
      		allowEdit: true,
			sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: true,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imagedata) => {
			
      		this.selectimagedata =  imagedata;
      		this.imagetaken  = false;
			this.galleryimage = true;
			this.coverselected = true;
			this.showToast('Success: picture taken :)');
		}, (err) => {
			this.showToast('Error: during selecting picture :(');
		});
	}

	// Capture photo using camera
	captureCoverimage(){
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 1000,
      		targetHeight: 800,
      		allowEdit: true,
			sourceType: this.camera.PictureSourceType.CAMERA,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: true,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imagedata) => {
			
      		this.cameraimagedata =  imagedata;
			this.imagetaken  = true;
			this.galleryimage = false;
			this.coverselected = true;
			this.showToast('Success: picture taken :)');
		}, (err) => {
			this.showToast('Error: during clicking picture :(');
		});
		
	}
	selectProfileimage(){
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 1000,
      		targetHeight: 800,
      		allowEdit: true,
			sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: true,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imagedata) => {
			
      		this.selectimagedata =  imagedata;
      		this.imagetaken  = false;
			this.galleryimage = true;
			this.profileselected = true;
			this.showToast('Success: picture taken :)');
		}, (err) => {
			this.showToast('Error: during selecting picture :(');
		});
	}

	// Capture photo using camera
	captureProfileiamge(){
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 1000,
      		targetHeight: 800,
      		allowEdit: true,
			sourceType: this.camera.PictureSourceType.CAMERA,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: true,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imagedata) => {
			
      		this.cameraimagedata =  imagedata;
			this.imagetaken  = true;
			this.galleryimage = false;
			this.profileselected = true;
			this.showToast('Success: picture taken :)');
		}, (err) => {
			this.showToast('Error: during clicking picture :(');
		});
		
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
		if(this.galleryimage && !this.imagetaken) {
			alert("You have selected an image.");			
			this.authservice.updateCoverphoto(this.selectimagedata);
		}else if (this.imagetaken && !this.galleryimage) {
			alert("You have captured an image.");			
			this.authservice.updateCoverphoto(this.cameraimagedata);
		}
		else{
			this.showToast("Please capture or select an image.");
		}
	}
	oncoverCancel(){
		this.coverselected = false;
	}
	onprofileSubmit(){
		this.profileselected = false;
		if(this.galleryimage && !this.imagetaken) {
			alert("You have selected an image.");
			this.authservice.updateProfilephoto(this.selectimagedata);
		}else if (this.imagetaken && !this.galleryimage) {
			alert("You have captured an image.");			
			this.authservice.updateProfilephoto(this.cameraimagedata);
		}
		else{
			this.showToast("Please capture or select an image.");
		}
	}
	onprofileCancel(){
		this.profileselected = false;
	}
	onmapClick(){
		this.navCtrl.push("Updatelocation");
	}
	nameTouched(){
		this.nameselected = true;
	}
	onnameSubmit(){
		this.nameselected = false;
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
			this.showToast("Kindly enter contact no.");
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
			this.showToast("Please give new club.");
		}
	}
	onclubCancel(){
		this.clubselected = false;
	}

	sportnameTouched(){
		this.sportnameselected = true;
	}
	onsportNamesubmit(){
		this.sportnameselected = false;
		if(this.sportname) {			
			this.authservice.updateSportName(this.sportname);
		}else{
			this.showToast("Please enter sportname.");
		}
	}
	onsportnameCancel(){
		this.sportnameselected = false;
	}


	ngOnDestroy(){
		this.authsubscription.unsubscribe();
	}
	onCancel(){
		this.navCtrl.pop();
	}
}
