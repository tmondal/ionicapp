import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { Geolocation } from '@ionic-native/geolocation';
import { 
	GoogleMap,
	GoogleMaps,
	GoogleMapsEvent,
	LatLng,
	CameraPosition,
	Marker,
	MarkerOptions	
} from '@ionic-native/google-maps';




@IonicPage()
@Component({
  selector: 'page-updatelocation',
  templateUrl: 'updatelocation.html',
})
export class Updatelocation {

	pos: LatLng;
	newlat: number;
	newlng: number;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public googleMaps: GoogleMaps,
		public geolocation: Geolocation,
		public authservice: AuthService
	) {}

	ionViewDidLoad() {
		this.loadMap();
	}

	loadMap() {

		let element: HTMLElement = document.getElementById('map');

		let map: GoogleMap = this.googleMaps.create(element);

		// listen to MAP_READY event
		// You must wait for this event to fire before adding something to the map or modifying it in anyway
		map.one(GoogleMapsEvent.MAP_READY).then(() => {

			
			this.geolocation.getCurrentPosition().then((resp) => {

				// this.newlat = resp.coords.latitude;
				// this.newlng = resp.coords.longitude;
				this.pos = new LatLng(resp.coords.latitude,resp.coords.longitude);

				// create CameraPosition
				let position: CameraPosition = {
					target: this.pos,
					zoom: 18,
					tilt: 30
				};

				// move the map's camera to position
				map.moveCamera(position);

				// create new marker
				let markerOptions: MarkerOptions = {
					position: this.pos,
					title: this.pos.toUrlValue(),
					draggable: true,
					animation: 'BOUNCE'
				};

				map.addMarker(markerOptions).then((marker: Marker) => {

					marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe((obs)=>{
						marker.getPosition().then(latlng =>{
							marker.setTitle(latlng.toUrlValue());
							this.newlat = latlng.lat;
							this.newlng = latlng.lng;
							marker.showInfoWindow();
						});
					})
				});
			}).catch((error) => {
			  alert("Error getting location.");
			});
		});
	}

	updateLocation(){
		this.navCtrl.pop();
		this.authservice.updateLocation(this.newlat,this.newlng);
	}
	oncancel(){
		this.navCtrl.pop();
	}
}
