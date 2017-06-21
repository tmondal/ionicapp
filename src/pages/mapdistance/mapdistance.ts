import { Component ,OnInit} from '@angular/core';
import { IonicPage,NavController, NavParams,ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { 
	GoogleMap,
	GoogleMaps,
	GoogleMapsEvent,
	LatLng,
	CameraPosition,
	Marker,
	MarkerOptions } from '@ionic-native/google-maps';


@IonicPage()
@Component({
  selector: 'page-mapdistance',
  templateUrl: 'mapdistance.html',
})
export class Mapdistance implements OnInit{

	pos: LatLng;
	mylat: any;
	mylng: any;
	postlat: number;
	postlng: number;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public googleMaps: GoogleMaps,
		public geolocation: Geolocation,
	) {
		this.mylat = this.navParams.get("mylat");
		this.mylng = this.navParams.get("mylng");
		this.postlat = this.navParams.get("postlat");
		this.postlng = this.navParams.get("postlng");
	}

	ngOnInit(){
		if (!this.postlat && !this.postlng) {
			this.postlat = 28.7041;
			this.postlng = 77.1025;
		}
		if (!this.mylat && !this.mylng) {
			 this.geolocation.getCurrentPosition().then(pos=>{
			 	this.mylat = pos.coords.latitude;
			 	this.mylng = pos.coords.longitude;
			 	console.log(this.mylat);
			 	console.log(this.mylng);
			 })
		}
	}


	ionViewDidLoad() {
		this.loadMap();
	}

	loadMap() {

		let element: HTMLElement = document.getElementById('map');

		let map: GoogleMap = this.googleMaps.create(element);

		// listen to MAP_READY event
		// You must wait for this event to fire before adding something to the map or modifying it in anyway
		map.one(GoogleMapsEvent.MAP_READY).then(() => {

			if (this.mylat && this.mylng) {
				
			}else{

			}
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
					marker.showInfoWindow();
				});
			}).catch((error) => {
			  alert("Error getting location.");
			});
		});
	}


	oncancel(){
		this.viewCtrl.dismiss();
	}
}
