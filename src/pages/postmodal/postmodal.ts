import { Component , OnInit} from '@angular/core';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { NavController, NavParams, ViewController, ToastController} from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { PostService } from '../../providers/post-service';
import { AngularFire } from 'angularfire2';




@Component({
  selector: 'page-postmodal',
  templateUrl: 'postmodal.html',
  providers: [FileChooser,FilePath]
})
export class PostmodalPage implements OnInit{

	currentuserId: any;
	posttype: any = "tournament";
	sporttype: any;
	eventdate: any;
	eventtime: any;
	participating: Number = 0;
	entryfee: any;
	prize: any;
	rules: String[] = [];
	rule: String;

	criteria: String[] = [];
	criterion: any;

	phototaken: boolean;
	image: any;
	imagesrc: any;
	nativepath: any;
	imageurl: any = null;
	imagetitle: any;
	likes: any = 0;
	dislikes: any = 0;
	comments: any = 0;

	cricket: any;
	cricketarray: any;
	

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
		public storageservice: StorageService
	) {
		this.phototaken = false;
	}
	ngOnInit(){
		/* Initially i was trying to get current user inside constructor and 
		it got f***ed up when i logout
		*/
		this.af.auth.subscribe(user =>{
			this.currentuserId = user.uid;
		});
	}

	onDismiss(){
		this.viewCtrl.dismiss();
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
	
	tournamentSubmit(){
		let post = { 
			userId: this.currentuserId,
			posttype: this.posttype,
			sporttype: this.sporttype,
			eventdate: this.eventdate,
			eventtime: this.eventtime,
			entryfee: this.entryfee,
			prize: this.prize,
			participating: this.participating,
			rules: this.rules
		}
		this.postservice.addPost(post,this.currentuserId);
		this.viewCtrl.dismiss();
	}
	hiringSubmit(){
		let post = {
			userId: this.currentuserId,
			posttype: this.posttype,
			sporttype: this.sporttype,
			eventdate: this.eventdate,
			eventtime: this.eventtime,
			criteria: this.criteria,
			participating: this.participating
		}
		this.postservice.addPost(post,this.currentuserId);
		this.viewCtrl.dismiss();
	}
	takePicture(){
		const options: CameraOptions = {
			quality: 100,
			sourceType: this.camera.PictureSourceType.CAMERA,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imageSrc) => {
			
      		this.imagesrc = 'data:image/jpeg;base64,' + imageSrc;
			this.phototaken  =true;
			let toast = this.toastCtrl.create({
				message: 'Success: picture taken :)',
				duration: 3000
			});
			toast.present();
		}, (err) => {
			
			let toast = this.toastCtrl.create({
				message: 'Error: during getting picture :(',
				duration: 3000
			});
			toast.present();
		});
	}
	
	chooseFile(){
		this.fileChooser.open().then((uri) =>{
			this.filePath.resolveNativePath(uri).then( (filepath) =>{
				this.nativepath = filepath;
				this.showToast('Success: File choosen :)');
			}).catch((err)=>{
				this.showToast('Failed: could not get native path');
			})
		}).catch((err)=>{
			this.showToast('Failed to choose file :( ');
		})
	}
	showToast(message){
	    let toast = this.toastCtrl.create({
	      message: message,
	      duration: 3000
	    });
	    toast.present();
	}

	imageSubmit(){
			
		let post = {
			userId: this.currentuserId,
			posttype: this.posttype,
			title: this.imagetitle,
			imageurl: this.imageurl,
			likes: this.likes,
			dislikes: this.dislikes,
			comments: this.comments
		}
		this.postservice.uploadFile(post,this.currentuserId,this.nativepath);
		this.viewCtrl.dismiss();
	}
	
}
