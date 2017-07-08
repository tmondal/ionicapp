import { Component ,OnInit} from '@angular/core';
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


declare var google;

@IonicPage()
@Component({
  selector: 'page-updatelocation',
  templateUrl: 'updatelocation.html',
  providers: [Geolocation],
})
export class Updatelocation implements OnInit{

	map: GoogleMap;
	pos: LatLng;
	lat: any;
	lng: any;
	newlat: number;
	newlng: number;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public googleMaps: GoogleMaps,
		public geolocation: Geolocation,
		public authservice: AuthService
	) {}

	ngOnInit() {
		this.loadMap();
	}

	loadMap() {

		let element: HTMLElement = document.getElementById('map');

		this.map = this.googleMaps.create(element);

		// listen to MAP_READY event
		// You must wait for this event to fire before adding something to the map or modifying it in anyway
		this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

			
			this.geolocation.getCurrentPosition().then((resp) => {

				this.lat = resp.coords.latitude;
				this.lng = resp.coords.longitude;
				this.pos = new LatLng(resp.coords.latitude,resp.coords.longitude);

				// create CameraPosition
				let position: CameraPosition = {
					target: this.pos,
					zoom: 18,
					tilt: 30,
				};

				// move the map's camera to position
				this.map.moveCamera(position);

				// create new marker
				let markerOptions: MarkerOptions = {
					position: this.pos,
					title: this.pos.toString(),
					draggable: true,
					animation: 'BOUNCE'
				};

				this.map.addMarker(markerOptions).then((marker: Marker) => {

					marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe((obs)=>{
						marker.getPosition().then(latlng =>{
							marker.setTitle(latlng.toString());
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
		alert("pos: " +this.newlat+"/" + this.newlng);
		if (!this.newlat && !this.newlng) {
			this.authservice.updateLocation(this.lat,this.lng);
			this.map.remove();
			this.navCtrl.pop();
		}else{			
			this.authservice.updateLocation(this.newlat,this.newlng);
			this.map.remove();
			this.navCtrl.pop();
		}

	}
	oncancel(){
		this.navCtrl.pop();
	}
}
