import { Component , OnInit} from '@angular/core';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { 
	IonicPage,
	NavController, 
	NavParams, 
	ViewController, 
	ToastController
} from 'ionic-angular';

import { StorageService } from '../../providers/storage-service';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-createpost',
  templateUrl: 'createpost.html',
  providers: [FileChooser,FilePath]
})
export class Createpost implements OnInit{

	userref: any;
	userimage: any = null;
	username: any = null;
	currentuserId: any;
	posttype: any = "tournament";
	sporttype: any;
	eventdate: any;
	eventvenue: any = null;
	participating: Number = 0;
	centuarea: any;
	rules: String[] = [];
	rule: String;

	honestarea: any;
	criteria: String[] = [];
	criterion: any;

	selectimagedata: any;

	cameraimagedata: any;
	galleryimagedata: any;
	galleryvideodata: any;
	imagetaken: boolean = false;
	galleryimage: boolean = false;
	galleryvideo: boolean = false;


	imagetitle: any;
	likes: any = 0;
	dislikes: any = 0;
	comments: any = 0;

	cricket: any;
	cricketarray: any;

	youtubelink: any;
	youtubetitle: any;
	newstr: any;
	
	// result variables
	extratalk: any;


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public af: AngularFire,
		public camera: Camera,
		public mediaCapture: MediaCapture,
		private fileChooser: FileChooser,
		private filePath: FilePath,
		public postservice: PostService,
		public authservice: AuthService,
		public storageservice: StorageService
	) {}
	
	ngOnInit(){
		
		this.authservice.getmyprofile().subscribe((user)=>{
			this.currentuserId = user.$key;
			this.userimage = user.profileimage;
			this.username = user.name;
			if (!this.userimage || !this.username) {
				alert("You must update profile before writing any Post");
			}
		});

	}

	onDismiss(){
		this.navCtrl.pop();
	}

	onRuleAdd(){
		this.rules.push(this.rule);
		this.rule = '';
	}
	onRuleDel(i){
		this.rules.splice(i,1); // splice modifies the array
	}
	onCriteriaAdd(){
		this.criteria.push(this.criterion);
		this.criterion = '';
	}
	onCriteriaDel(i){
		this.criteria.splice(i,1);
	}

	
	// Capture photo using camera
	capturePictureByCamera(){
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 400,
      		targetHeight: 400,
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
			this.galleryvideo = false;
			this.showToast('Success: picture taken :)');
		}, (err) => {
			this.showToast('Error: during clicking picture :(');
		});
		
	}
	captureVideoByCamera(){
		let options = { quality: 0 };
		this.mediaCapture.captureVideo(options).then((video)=>{
			alert("Success: Video captured.");
			alert("Now select the video from gallery.");
		},(error)=>{
			alert("Error: can not capture video.\nBut you can take from gallery.");
		}).then(()=>{
			this.selectGalleryVideo();
		});
	}

	selectGalleryImage(){
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 400,
      		targetHeight: 400,
      		allowEdit: true,
			sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imagedata) => {
			
      		this.galleryimagedata =  imagedata;
			this.imagetaken  = false;
			this.galleryimage = true;
			this.galleryvideo = false;
			this.showToast('Success: image selected :)');
		}, (err) => {
			this.showToast('Error: during selecting picture :(');
		})
		
	}
	// select video form gallery using camera options
	selectGalleryVideo(){

		const options: CameraOptions = {
			quality: 100,
			targetHeight: 250,
			targetWidth: 150,
			sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.VIDEO
		}

		this.camera.getPicture(options).then((videodata) => {
			
      		this.galleryvideodata = "file://" + videodata; // File chooser was giving this format
      		alert(videodata);
			this.imagetaken  = false;
			this.galleryimage = false;
			this.galleryvideo = true;
			this.showToast('Success: video selected from gallery :)');
		}, (err) => {
			this.showToast('Error: during selecting video :(');
		});

	}


	showToast(message){
	    let toast = this.toastCtrl.create({
	      message: message,
	      duration: 3000
	    });
	    toast.present();
	}

	tournamentSubmit(){

		let evtdate = moment(this.eventdate).format("Do MMM YY");
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			posttype: this.posttype,
			sporttype: this.sporttype,
			eventdate: evtdate,
			eventvenue: this.eventvenue,
			participating: this.participating,
			centuarea: this.centuarea | 0,
			rules: this.rules
		}
		if (this.userimage && this.username) {
			
			if(this.posttype && this.sporttype && this.eventdate && this.rules) {
				this.viewCtrl.dismiss();
				if (this.imagetaken && !this.galleryimage) {
					this.postservice.cameraimagePost(post,this.cameraimagedata);
				}else if (this.galleryimage && !this.imagetaken) {
					this.postservice.cameraimagePost(post,this.galleryimagedata);
				}else{
					this.postservice.cameraimagePost(post,null);
				}
			}
			else{
				alert("Please give all fields.\nYou may skip rules");
			}
		}
		else{
			alert("You must edit profile before doing anything\nSee top right corner of Home and follow icons");
		}
	}


	hiringSubmit(){

		let evtdate = moment(this.eventdate).format("Do MMM YY");
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			posttype: this.posttype,
			sporttype: this.sporttype,
			eventdate: evtdate,
			eventvenue: this.eventvenue,
			honestarea: this.honestarea | 0,
			criteria: this.criteria,
			participating: this.participating
		}

		if (this.userimage && this.username) {
			
			if(this.posttype && this.sporttype && this.eventdate && this.criteria) {
				this.viewCtrl.dismiss();
				if (this.imagetaken && !this.galleryimage) {
					this.postservice.cameraimagePost(post,this.cameraimagedata);
				}else if (this.galleryimage && !this.imagetaken) {
					this.postservice.cameraimagePost(post,this.galleryimagedata);
				}else{
					this.postservice.cameraimagePost(post,null);
				}
			}
			else{
				alert("Please supply all fields");
			}
		}
		else{
			alert("You must edit profile before doing anything\nSee top right corner of Home and follow icons");
		}
	}

	
	textAndImageVideoSubmit(){
		
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			posttype: this.posttype,
			title: this.imagetitle,
		}
		if (this.userimage && this.username) {			
			if (this.imagetaken && !this.galleryimage && !this.galleryvideo) {
				alert("You captured an image using camera.");
				this.viewCtrl.dismiss();
				this.postservice.cameraimagePost(post,this.cameraimagedata);
			}else if (this.galleryimage && !this.imagetaken && !this.galleryvideo) {
				alert("You selected an image from gallery.");
				this.viewCtrl.dismiss();
				this.postservice.cameraimagePost(post,this.galleryimagedata);
			}else if (this.galleryvideo && !this.imagetaken && !this.galleryimage) {
				alert("You selected a video from gallery.");
				this.viewCtrl.dismiss();
				this.postservice.galleryvideoPost(post,this.galleryvideodata);
			}
			else{
				alert("You must select one option among all options..");
			}
		}
		else{
			alert("You must edit profile before doing anything\nSee top right corner of Home and follow icons");
		}
	}

	youtubeSubmit(){

		this.replacestring();
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			posttype: this.posttype,
			youtubelink: this.youtubelink,
			title: this.youtubetitle,
		}
		if (this.userimage && this.username) {			
			if (this.youtubelink && this.youtubetitle) {
				this.postservice.simplePost(post);
				this.viewCtrl.dismiss();
			}else if (this.youtubelink && !this.youtubetitle) {
				alert("Proper title attract users to see the video.");
				this.postservice.simplePost(post);
				this.viewCtrl.dismiss();
			}else if (!this.youtubelink && this.youtubetitle) {
				alert("You must give a appropriate youtube link. ");
			}else{
				alert("Please provide all fields.");
			}
		}
		else{
			alert("You must edit profile before doing anything\nSee top right corner of Home and follow icons");
		}

	}

	replacestring(){
		let re = /watch/;
		if (this.youtubelink.search(re) != -1) {
			let index = this.youtubelink.lastIndexOf("=");
	    	this.newstr = this.youtubelink.substring(index + 1);
	    	this.youtubelink = 'https://www.youtube.com/embed/' + this.newstr;
		}else{
	    	let index = this.youtubelink.lastIndexOf("/");
	    	this.newstr = this.youtubelink.substring(index);
	    	this.youtubelink = 'https://www.youtube.com/embed' + this.newstr;
		}
  	}

  	matchresultSubmit(){
  		
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			posttype: this.posttype,
			sporttype: this.sporttype,
			extratalk: this.extratalk,
		}
		
		if (this.userimage && this.username) {
			if (this.extratalk) {				
				this.postservice.simplePost(post);
				this.viewCtrl.dismiss();
			}
			else{
				alert("Please write about the match result");
			}
		}
		else{
			alert("You must edit profile before doing anything\nSee top right corner of Home and follow icons");
		}
		
  	}


}
