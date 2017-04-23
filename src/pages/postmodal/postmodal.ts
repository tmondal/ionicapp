import { Component , OnInit} from '@angular/core';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { NavController, NavParams, ViewController, ToastController} from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { PostService } from '../../providers/post-service';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import * as moment from 'moment';



@Component({
  selector: 'page-postmodal',
  templateUrl: 'postmodal.html',
  providers: [FileChooser,FilePath]
})
export class PostmodalPage implements OnInit{

	userref: any;
	userimage: any = null;
	username: any = null;
	currentuserId: any;
	posttype: any = "tournament";
	sporttype: any;
	eventdate: any;
	eventvenue: any = null;
	participating: Number = 0;
	entryfee: any = 0;
	prize: any = 0;
	rules: String[] = [];
	rule: String;

	criteria: String[] = [];
	criterion: any;

	image: any;
	imagesrc: any;
	imagetaken: boolean = false;
	nativepath: any;
	filechoosen: boolean = false;
	videosrc: any;
	videotaken: boolean = false;
	imagetitle: any;
	likes: any = 0;
	dislikes: any = 0;
	comments: any = 0;

	cricket: any;
	cricketarray: any;

	youtubelink: any;
	youtubetitle: any;
	newstr: any;
	

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public af: AngularFire,
		public camera: Camera,
		private fileChooser: FileChooser,
		private filePath: FilePath,
		public postservice: PostService,
		public authservice: AuthService,
		public storageservice: StorageService
	) {}
	
	ngOnInit(){
		/* Initially i was trying to get current user inside constructor and 
		it got f***ed up when i logout
		*/

		// still causes 'uid' of null Type error. So got rid of it by 'user.$key'

		// this.af.auth.subscribe(user =>{ 
		// 	this.currentuserId = user.uid;
		// });

		
		this.authservice.getmyprofile().subscribe((user)=>{
			this.currentuserId = user.$key;
			// this.userimage = user.profileimage;
			// this.username = user.name;
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
	chooseFile(){
		this.fileChooser.open().then((uri) =>{
			this.filePath.resolveNativePath(uri).then( (filepath) =>{
				this.nativepath = filepath;
				this.filechoosen = true;
				this.imagetaken = false;
				this.videotaken = false;
				this.showToast('Success: File choosen :)');
			}).catch((err)=>{
				this.showToast('Failed: could not get native path');
			})
		}).catch((err)=>{
			this.showToast('Failed! Try again :( ');
		})
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
			userimage: this.userimage,
			username: this.username,
			posttype: this.posttype,
			sporttype: this.sporttype,
			eventdate: evtdate,
			eventvenue: this.eventvenue,
			entryfee: this.entryfee,
			prize: this.prize,
			participating: this.participating,
			rules: this.rules
		}
		if(this.posttype && this.sporttype && this.eventdate && this.userimage &&this.username && this.rules) {
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}
		else if(this.posttype && this.sporttype && this.eventdate && !this.userimage &&this.username && this.rules){
			alert("Please edit profile picture before next post.");
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}
		else if(this.posttype && this.sporttype && this.eventdate && this.userimage && !this.username && this.rules) {
			alert("Please edit your name before next post.");
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}
		else if(this.posttype && this.sporttype && this.eventdate && !this.userimage && !this.username && this.rules) {
			alert("Please edit your name and profile pic before next post.");
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}
		else{
			alert("Please give all fields.");
		}
	}
	hiringSubmit(){

		let evtdate = moment(this.eventdate).format("Do MMM YY");
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			userimage: this.userimage,
			username: this.username,
			posttype: this.posttype,
			sporttype: this.sporttype,
			eventdate: evtdate,
			eventvenue: this.eventvenue,
			criteria: this.criteria,
			participating: this.participating
		}
		if(this.posttype && this.sporttype && this.eventdate && this.userimage && this.username && this.criteria) {
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}else if (this.posttype && this.sporttype && this.eventdate && !this.userimage && this.username && this.criteria) {
			alert("Please edit profile picture before next post.");
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}
		else if (this.posttype && this.sporttype && this.eventdate && this.userimage && !this.username && this.criteria) {
			alert("Please edit your name before next post.");
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}
		else if (this.posttype && this.sporttype && this.eventdate && !this.userimage && !this.username && this.criteria) {
			alert("Please edit your name and profile pic before next post.");
			this.viewCtrl.dismiss();
			this.postservice.tournamentAndHiringPost(post,this.currentuserId,this.nativepath);
		}
		else{
			alert("Please supply all fields");
		}
	}
	takePicture(){
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
			
      		this.imagesrc =  imagedata;
			this.imagetaken  = true;
			this.filechoosen = false;
			this.videotaken = false;
			this.showToast('Success: picture taken :)');
		}, (err) => {
			this.showToast('Error: during clicking picture :(');
		});
	}
	
	takeVideo(){
		const options: CameraOptions = {
			quality: 5,
			targetWidth: 100,
      		targetHeight: 100,
			sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.VIDEO,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((videodata) => {
			
      		this.videosrc =  videodata;
			this.videotaken  = true;
			this.filechoosen = false;
			this.imagetaken = false;
			this.showToast('Success: video taken from file :)');
		}, (err) => {
			this.showToast('Error: during taking video :(');
		});
	}

	mediaFileSubmit(){
		
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			userimage: this.userimage,
			username: this.username,
			posttype: this.posttype,
			title: this.imagetitle,
			likes: this.likes,
			dislikes: this.dislikes,
			comments: this.comments
		}
		if (this.filechoosen && !this.imagetaken && !this.videotaken) {
			alert("You have choosen file from device..");
			this.postservice.fileimagePost(post,this.currentuserId,this.nativepath);
			this.viewCtrl.dismiss();
		}else if (this.imagetaken && !this.filechoosen && !this.videotaken) {
			alert("You have taken picture to upload..");
			this.postservice.cameraimagePost(post,this.currentuserId,this.imagesrc);
			this.viewCtrl.dismiss();
		}else if(this.videotaken && !this.imagetaken && !this.filechoosen){
			alert("You decided to upload video form device..");
			this.postservice.cameravideoPost(post,this.currentuserId,this.videosrc);
			this.viewCtrl.dismiss();
		}else{
			alert("You must select one option among all three..");
		}
	}
	youtubeSubmit(){

		this.replacestring();
		let post = {
			created_at: Date.now(),
			userId: this.currentuserId,
			userimage: this.userimage,
			username: this.username,
			posttype: this.posttype,
			youtubelink: this.youtubelink,
			title: this.youtubetitle,
			likes: this.likes,
			dislikes: this.dislikes,
			comments: this.comments
		}
		if (this.youtubelink && this.youtubetitle) {
			console.log("Youtube link: ");
			console.log(this.youtubelink);
			this.postservice.simplePost(post,this.currentuserId);
			this.viewCtrl.dismiss();
		}else if (this.youtubelink && !this.youtubetitle) {
			alert("Proper title attract users to see the video.");
			this.postservice.simplePost(post,this.currentuserId);
			this.viewCtrl.dismiss();
		}else if (!this.youtubelink && this.youtubetitle) {
			alert("You must give a appropriate youtube link. ");
		}else{
			alert("Please provide all fields.");
		}

	}

	replacestring(){
		let re = /watch/;
		if (this.youtubelink.search(re) != -1) {
			let index = this.youtubelink.lastIndexOf("=");
	    	this.newstr = this.youtubelink.substring(index + 1);
	    	console.log("New str: " + this.newstr);
	    	this.youtubelink = 'https://www.youtube.com/embed/' + this.newstr;
		}else{
	    	let index = this.youtubelink.lastIndexOf("/");
	    	this.newstr = this.youtubelink.substring(index);
	    	console.log("New str: " + this.newstr);
	    	this.youtubelink = 'https://www.youtube.com/embed' + this.newstr;
		}
  	}	
}
