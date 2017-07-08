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
	user: any;
	usertype: any;

	myname: any = '';
	mycontactno: any = '';
	mycurrentclub: any = '';
	mysportname: any = '';
	myprofile: any;
	mycover: any;
	name: any;
	contactno: any;
	currentclub: any;
	sportname: any;

	coverselected: boolean = false;
	profileselected: boolean = false;
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
		this.doRefresh(1);
	}
	doRefresh(refresher: any){
		this.authservice.getuserbyId(this.authuid).subscribe((user)=>{
			if (user.name) {				
				this.myname = user.name;
			}
			if (user.contactno) {
				this.mycontactno = user.contactno;
			}
			if (user.currentclub) {
				this.currentclub = user.currentclub;
			}
			if (user.sportname) {
				this.mysportname = user.sportname;
			}
			if (user.profileimage) {
				this.myprofile = user.profileimage;
			}
			if (user.coverimage) {
				this.mycover = user.coverimage;
			}
			this.usertype = user.usertype;
		});

		if (refresher != 1) {      
	      setTimeout(() => { }, 500);
	    }
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
			this.doRefresh(2);
		}else if (this.imagetaken && !this.galleryimage) {
			alert("You have captured an image.");			
			this.authservice.updateCoverphoto(this.cameraimagedata);
			this.doRefresh(2);
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
			this.doRefresh(2);
		}else if (this.imagetaken && !this.galleryimage) {
			alert("You have captured an image.");			
			this.authservice.updateProfilephoto(this.cameraimagedata);
			this.doRefresh(2);
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

	onnameSubmit(){
		if(this.name) {			
			this.authservice.updateName(this.name);
			this.doRefresh(2);
		}else{
			this.showToast("Please enter your name");
		}
	}
	onnameCancel(){
		this.name = '';
	}

	oncontactSubmit(){
		if(this.contactno) {			
			this.authservice.updateContactno(this.contactno);
			this.doRefresh(2);
		}else{
			this.showToast("Kindly enter contact no.");
		}
	}
	oncontactCancel(){
		this.contactno = '';
	}

	onclubSubmit(){
		if(this.currentclub) {			
			this.authservice.updateCurrentClub(this.currentclub);
			this.doRefresh(2);
		}else{
			this.showToast("Please give new club.");
		}
	}
	onclubCancel(){
		this.currentclub = '';
	}

	onsportNamesubmit(){
		if(this.sportname) {			
			this.authservice.updateSportName(this.sportname);
			this.doRefresh(2);
		}else{
			this.showToast("Please enter sportname.");
		}
	}
	onsportnameCancel(){
		this.sportname = '';
	}

	ngOnDestroy(){}

	onCancel(){
		this.navCtrl.pop();
	}
}
