import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';



@Injectable()
export class StorageService {

	constructor(public http: Http, public camera: Camera) {
		console.log('Hello StorageService Provider');
	}
	takePicture(){
		const options: CameraOptions = {
			quality: 100,
			sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.ALLMEDIA
		}
		this.camera.getPicture(options).then((imageData) => {
			// upload to firebase

		}, (err) => {
			console.log(err);
		}); 
	}

}
